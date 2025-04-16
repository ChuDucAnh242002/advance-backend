const express = require('express')
const dotenv = require('dotenv');
const { getConfig } = require('./services/configManager');
require('./services/emoteMomentHandler');

dotenv.config();

const app = express()
const port = process.env.PORT || 8000;

app.get('/', (_req, res) => {
  res.send('Hello World!')
})

app.get('/settings/threshold', (_req, res) => {
  const {threshold} = getConfig();
    res.json({ threshold });
});   


app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})