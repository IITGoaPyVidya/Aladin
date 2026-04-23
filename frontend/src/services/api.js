/**
 * api.js — Axios client pre-configured to talk to the Aladin backend.
 *
 * The base URL is read from the VITE_API_URL environment variable so
 * it can be overridden for each deployment environment without code changes.
 */

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

/**
 * Search stocks by symbol or company name.
 * @param {string} query - Search term
 * @returns {Promise<import('../types').StockSearchResponse>}
 */
export const searchStocks = (query) =>
  api.get("/api/search", { params: { q: query } }).then((r) => r.data);

/**
 * Fetch stock recommendations.
 * @returns {Promise<import('../types').RecommendationResponse>}
 */
export const getRecommendations = () =>
  api.get("/api/recommend").then((r) => r.data);

export default api;
