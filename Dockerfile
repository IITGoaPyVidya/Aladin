# Multi-stage Dockerfile for Railway - runs both backend and frontend
# Stage 1: Build React frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./

# Build frontend (API URL will be relative - same domain)
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}
ENV CI=false

RUN npm run build

# Stage 2: Setup Python backend + Nginx
FROM python:3.11-slim

# Install nginx and supervisor (to run both services)
RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Setup backend
WORKDIR /app/backend
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./

# Copy frontend build from previous stage
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Create startup script to configure nginx with Railway's PORT
RUN echo '#!/bin/bash\n\
PORT=${PORT:-80}\n\
echo "Configuring nginx to listen on port $PORT"\n\
cat > /etc/nginx/sites-available/default <<EOF\n\
server {\n\
    listen $PORT;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    \n\
    location / {\n\
        try_files \\$uri \\$uri/ /index.html;\n\
    }\n\
    \n\
    location /api {\n\
        proxy_pass http://127.0.0.1:8000;\n\
        proxy_http_version 1.1;\n\
        proxy_set_header Upgrade \\$http_upgrade;\n\
        proxy_set_header Connection "upgrade";\n\
        proxy_set_header Host \\$host;\n\
        proxy_set_header X-Real-IP \\$remote_addr;\n\
        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;\n\
        proxy_set_header X-Forwarded-Proto \\$scheme;\n\
    }\n\
}\n\
EOF\n\
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf\n\
' > /start.sh && chmod +x /start.sh

# Configure supervisor to run both nginx and uvicorn
RUN echo '[supervisord]\n\
nodaemon=true\n\
user=root\n\
logfile=/dev/stdout\n\
logfile_maxbytes=0\n\
\n\
[program:nginx]\n\
command=nginx -g "daemon off;"\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0\n\
stderr_logfile=/dev/stderr\n\
stderr_logfile_maxbytes=0\n\
priority=10\n\
\n\
[program:backend]\n\
command=python -m uvicorn main:app --host 0.0.0.0 --port 8000\n\
directory=/app/backend\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0\n\
stderr_logfile=/dev/stderr\n\
stderr_logfile_maxbytes=0\n\
priority=5\n\
stopasgroup=true\n\
killasgroup=true\n' > /etc/supervisor/conf.d/supervisord.conf

WORKDIR /app

# Railway will assign PORT dynamically, expose it
ENV PORT=80
EXPOSE $PORT

CMD ["/start.sh"]
