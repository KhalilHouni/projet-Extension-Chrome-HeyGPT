const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const apiKey = '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';
const apiUrl = 'https://api.openai.com/v1/completions';
const maxQuestions = 20;
let userQuestions = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/popup/popup.html');
});

app.post('/ask', async (req, res) => {
  const userQuestion = req.body.question;

  try {
    userQuestions.push(userQuestion);

    if (userQuestions.length > maxQuestions) {
      userQuestions.shift();
    }

    const prompt = userQuestions.slice(-maxQuestions).join('\n');

    const response = await axios.post(apiUrl, {
      model: 'gpt-3.5-turbo-instruct',
      prompt: `${prompt}\n\nYou: ${userQuestion}\nBot:`,
      temperature: 0.7,
      max_tokens: 150,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const botReply = response.data.choices[0].text;
    console.log('Bot:', botReply);

    res.json({ botReply });
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});