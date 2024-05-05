const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

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
        res.send(data);
    } catch (error) {
        console.error('API request failed:', error);
        res.status(500).send({ error: 'Failed to fetch API' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
