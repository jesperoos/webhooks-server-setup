import { WebSocketServer } from 'ws';
import rateLimit from 'express-rate-limit';
import express from 'express';
import { Gitlab } from '@gitbeaker/node';
import * as dotenv from 'dotenv';
dotenv.config()

const app = express();
app.set('view engine', 'ejs');
app.use('/public', express.static('public'))

// Set up rate limiter for all requests to the server
const limiter = rateLimit({
  windowMs: 60000 * 5, // 5 minutes
  max: 30, // 30 requests per 5 minutes.
});
app.use(limiter);

// Initialize GitLab API client
const api = new Gitlab({
  host: 'https://gitlab.lnu.se',
  token: process.env.GITLAB_TOKEN
});

// Create WebSocket server
const wss = new WebSocketServer({ port: 8080, maxPayload: 128 });
wss.on('connection', (ws) => {
  ws.send('WebSocket connected');
});

const ping = setInterval(() => {
  wss.clients.forEach((client) => {
    client.send('ping');
  });
}, 10000);

// Handle GitLab webhook events
app.post('/webhook', (req, res) => {
  const event = req.headers['x-gitlab-event'];
  const gitlabToken = req.headers['x-gitlab-token']

  if (gitlabToken !== process.env.SECRET_HOOK) {
    return res.sendStatus(401);
  }
  
  if (event === 'Issue Hook') {
    wss.clients.forEach((client) => {
      client.send('Issue-update');
    });
  }

  if (event === 'Push Hook') {
    wss.clients.forEach((client) => {
      client.send('Push-update');
    });
  }

  if (event === 'Tag Push Hook') {
    wss.clients.forEach((client) => {
      client.send('Tag-update');
    });
  }

  if (event === 'Release Hook') {
    wss.clients.forEach((client) => {
      client.send('Release-update');
    });
  }

  res.status(200).send('OK');
});

// Route to home
app.get('/home', async (req, res) => {
  res.render('home')
});

// Route to get project issues
app.get('/issues', async (req, res) => {
  try {
    const projectId = 31061;
    const issues = await api.Issues.all({
      projectId: projectId
    });
    res.render('issues', { issues });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get project commits
app.get('/commits', async (req, res) => {
  res.render('commits')
});

// Route to get project tags
app.get('/tags', async (req, res) => {
  res.render('tags')
});

// Route to get project releases
app.get('/releases', async (req, res) => {
  res.render('releases')
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
