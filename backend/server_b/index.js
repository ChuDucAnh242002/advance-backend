const express = require('express')
const dotenv = require('dotenv');
const { getConfig, updateConfig } = require('./services/configManager');
require('./services/emoteMomentHandler');

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 8000;

app.get('/', (_req, res) => {
  res.send('Hello World!')
})

app.get('/settings/allowed-emotes', (_req, res) => {
  const { emotes } = getConfig();
    res.json({ emotes });
});

app.post('/settings/allowed-emotes', async (req, res) => {
  const { emotes } = getConfig();
  console.log(req.body);
  const id = req.body.id;
  const action = req.body.action;
  const emote = emotes.find(e => e.id === id);

  if(!['allow', 'disable'].includes(action)){
    res.status(400).json({ error: 'Invalid action. Use "allow" or "disable".' });
    };

  if(!emote){
    res.status(400).json({ error: 'Emote not found.' });
  }  

  const updatedEmotes = emotes.map(e => {
    if(e.id === id){
      return { ...e, active: action === 'allow' ? true : false };
    }
    return e;
  }
  );

  
  await updateConfig({emotes: updatedEmotes});

  res.json({ message: `${action} ${emote.value} emote successfully!` });
});

app.get('/settings/threshold', (_req, res) => {
  const {threshold} = getConfig();
    res.json({ threshold });
});

app.post('/settings/threshold', (req, res) => {
  const {threshold} = getConfig();
  const newThreshold = req.body.threshold;
  if(!newThreshold || isNaN(newThreshold) || newThreshold < 0 || newThreshold > 1){
    res.status(400).json({ error: 'Invalid threshold. Must be a number between 0 and 1.' });
  }
   updateConfig({ threshold: newThreshold });
    res.json({ message: `Threshold updated to ${newThreshold}` });
}); 

app.get('/settings/interval', (_req, res) => {
  const { interval } = getConfig();
    res.json({ interval });
});


app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})