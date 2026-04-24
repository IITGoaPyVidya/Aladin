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

/**
 * Screen stocks with filters.
 * @param {object} filters - { min_price, max_price, sector, limit }
 * @returns {Promise<{success: boolean, results: array}>}
 */
export const screenStocks = (filters) =>
  api.get("/api/stocks/screener", { params: filters }).then((r) => r.data);

/**
 * Get sector-wise stock data.
 * @returns {Promise<{success: boolean, sectors: array}>}
 */
export const getSectorsData = () =>
  api.get("/api/stocks/sectors").then((r) => r.data);

/**
 * Get news sentiment for a stock symbol.
 * @param {string} symbol - Stock symbol (e.g., "TATASTEEL")
 * @returns {Promise<{success: boolean, news: array, overall_sentiment: string}>}
 */
export const getNewsSentiment = (symbol) =>
  api.get("/api/stocks/news-sentiment", { params: { symbol } }).then((r) => r.data);

/**
 * Get AI analyst analysis for a stock.
 * @param {string} stockName - Company name
 * @param {string} persona - Analyst persona (fundamental, technical, growth, value, momentum)
 * @returns {Promise<{success: boolean, analysis: object}>}
 */
export const getAIAnalysis = (stockName, persona) =>
  api.get("/api/stocks/ai-analysis", { params: { stock_name: stockName, persona } }).then((r) => r.data);

export default api;
