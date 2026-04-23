# ---- Build stage ----
FROM python:3.11-slim AS builder

WORKDIR /app

# Install dependencies in a virtual environment for clean layering
RUN python -m venv /app/venv
ENV PATH="/app/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---- Runtime stage ----
FROM python:3.11-slim

WORKDIR /app

COPY --from=builder /app/venv /app/venv
ENV PATH="/app/venv/bin:$PATH"

COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Start Uvicorn — Railway sets $PORT automatically; fall back to 8000.
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
