const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const { createClient } = require('redis');
const app = express();


const client = createClient({
    url: process.env.DATABASE_URL
});

client.on('error', (err) => {
    console.log('Error ' + err);
});

client.connect().catch(console.error);

app.use(express.json());
app.use(express.static('public'));

app.post('/submit-score', async (req, res) => {
    //const { name, time } = req.body;
    console.log(req.body);
    console.log(req.body.name);
    console.log(req.body.time);

    try {
        //console.log(client)
        await client.zAdd("leaderboard", { value: req.body.name, score: req.body.time}); //value must be string and score must be int or float.
        res.status(200).json({success: true, message:'Score submitted'});
    } catch (err) {
        console.error('Redis error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/leaderboard', async (req, res) => {
    try {
        const scores = await client.zRangeWithScores('leaderboard', 0, -1);
        console.log()
        console.log(scores)
        const leaderboard = scores.map(score => ({ name: score.value, time: score.score }));
        res.status(200).json(leaderboard);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
