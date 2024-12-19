const ctx = document.getElementById('stockChart').getContext('2d');

const stockChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Initially empty
        datasets: [{
            label: 'Stock Price',
            data: [], // Initially empty
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'second'
                },
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Stock Price (USD)'
                }
            }
        }
    }
});

async function fetchStockPrices() {
    try {
        const response = await fetch('/api/stock-prices');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const stockData = await response.json();

        // Log the raw API response for debugging
        console.log('Raw stock data:', stockData);

        // Extract timestamps and stock prices
        const labels = stockData.map(entry => new Date(entry.time));  // Use 'time' from the API response
        const data = stockData.map(entry => entry.stockprice);  // Use 'stockprice' from the API response

        // Debugging: Log the labels and data arrays
        console.log('Labels:', labels);
        console.log('Data:', data);

        // Update the chart with new data
        stockChart.data.labels = labels;
        stockChart.data.datasets[0].data = data;
        stockChart.update();
    } catch (error) {
        console.error('Failed to fetch stock prices:', error);
    }
}

// Fetch stock prices every 5 seconds
setInterval(fetchStockPrices, 5000);
