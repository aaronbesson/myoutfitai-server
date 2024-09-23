const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const multer = require('multer');
const FormData = require('form-data');
const app = express();
require('dotenv').config();

// Define CORS options
const corsOptions = {
    origin: 'https://myoutfitai-server.onrender.com',
    methods: 'POST'
};

// Apply CORS with the specified options to all requests
app.use(cors(corsOptions));

// Enable CORS preflight for POST requests on /api/proxy
app.options('/api/proxy', cors(corsOptions)); 

// Middleware to parse JSON bodies
app.use(express.json());

// Define a POST route for the proxy endpoint
const API_KEY = process.env.FASHN_API_KEY;

<<<<<<< HEAD
const upload = multer();

app.post('/api/proxy', upload.fields([{ name: 'model_image' }, { name: 'garment_image' }]), async (req, res) => {
    try {
        const formData = new FormData();
        
        // Append files
        formData.append('model_image', req.files['model_image'][0].buffer, { filename: 'model.jpg' });
        formData.append('garment_image', req.files['garment_image'][0].buffer, { filename: 'garment.jpg' });
        
        // Append other fields
        Object.keys(req.body).forEach(key => {
            formData.append(key, req.body[key]);
        });

        const apiResponse = await fetch('https://api.fashn.ai/v1/run', {
            method: 'POST',
            headers: {
                ...formData.getHeaders(),
                'Authorization': `Bearer ${API_KEY}`
            },
            body: formData
        });
        const initialResponse = await apiResponse.json();
        
        if (initialResponse.id) {
=======
app.post('/api/proxy', async (req, res) => {
    try {
        const apiResponse = await fetch('https://api.fashn.ai/v1/run', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(req.body)
        });
        const initialResponse = await apiResponse.json();
        
        // Check if the response includes a URL to get the result
        if (initialResponse.id) {
            // Poll the URL to get the result
>>>>>>> ac84a01eadad20dea5a57e101382eff5d591adde
            const result = await pollForResult(initialResponse.id);
            res.json(result);
        } else {
            res.json(initialResponse);
        }
    } catch (error) {
        console.error('API request failed:', error);
        res.status(500).json({ error: 'Failed to fetch API' });
    }
});

// Function to poll for result
async function pollForResult(id) {
    while (true) {
        const resultResponse = await fetch(`https://api.fashn.ai/v1/status/${id}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });
        const resultData = await resultResponse.json();

        // Check if the task has completed or failed
        if (resultData.status === 'completed' || resultData.status === 'failed') {
            return resultData;
        }

        // Optionally, implement some delay here
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
    }
}

// Start the server on a specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));