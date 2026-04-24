/**
 * api.js — Axios client for the Aladin backend (Indian Market API).
 *
 * The base URL is read from VITE_API_URL environment variable.
 */

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 35_000, // 35 seconds for Indian Market API calls
  headers: { "Content-Type": "application/json" },
});

/**
 * Search stocks by keyword (company name).
 * @param {string} query - Search keyword
 * @returns {Promise<{query: string, suggestions: string[], total: number}>}
 */
export const searchStocks = (query) =>
  api.get("/api/stocks/search", { params: { q: query } }).then((r) => r.data);

/**
 * Get comprehensive stock details.
 * @param {string} stockName - Full company name (e.g., "Tata Steel")
 * @returns {Promise<{success: boolean, data: object}>}
 */
export const getStockDetails = (stockName) =>
  api.get("/api/stocks/details", { params: { name: stockName } }).then((r) => r.data);

/**
 * Get quick stock summary.
 * @param {string} stockName - Full company name
 * @returns {Promise<{success: boolean, summary: object}>}
 */
export const getStockSummary = (stockName) =>
  api.get("/api/stocks/summary", { params: { name: stockName } }).then((r) => r.data);

/**
 * Get list of popular stocks.
 * @returns {Promise<{stocks: string[], total: number}>}
 */
export const getPopularStocks = () =>
  api.get("/api/stocks/popular").then((r) => r.data);

export default api;
