// Import necessary modules
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

// Define CORS options
const corsOptions = {
    origin: 'chrome-extension://iogijhjfhbigeacmkpbkbkkbpcgmphij', // Replace with your actual extension ID
    optionsSuccessStatus: 200 // For legacy browser support
};

// Apply CORS with the specified options to all requests
app.use(cors(corsOptions));

// Enable CORS preflight for POST requests on /api/proxy
app.options('/api/proxy', cors(corsOptions)); 

// Middleware to parse JSON bodies
app.use(express.json());

// Define a POST route for the proxy endpoint
app.post('/api/proxy', async (req, res) => {
    try {
        const apiResponse = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.body.apiKey}` // Pass the API key securely from your frontend
            },
            body: JSON.stringify(req.body.data) // Pass the data to the API
        });
        const data = await apiResponse.json();
        res.json(data);
    } catch (error) {
        console.error('API request failed:', error);
        res.status(500).json({ error: 'Failed to fetch API' });
    }
});

// Start the server on a specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
