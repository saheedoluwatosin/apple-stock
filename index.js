const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
const yahooFinance = require("yahoo-finance2").default;

const stockQueue = [];

// Function to fetch stock price
const fetchStockPrice = async () => {
    try {
        const stockData = await yahooFinance.quote("AAPL");
        const stockprice = stockData.regularMarketPrice;
        const timestamp = new Date().toISOString();

        stockQueue.push({ stockprice, time: timestamp });

        // Keep queue size manageable (e.g., last 100 entries)
        if (stockQueue.length > 100) {
            stockQueue.shift();
        }
    } catch (error) {
        console.error("Error fetching stock price:", error.message);
    }
};

// Fetch stock price every 5 seconds
setInterval(fetchStockPrice, 5000);

// API endpoint to get stock prices
app.get('/api/stock-prices', (req, res) => {
    res.json(stockQueue);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
