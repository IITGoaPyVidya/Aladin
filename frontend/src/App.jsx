/**
 * App.jsx — Root component that sets up client-side routing.
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import StockDetails from "./pages/StockDetails";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/stock/:stockName" element={<StockDetails />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
