const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const PUBLIC = path.resolve(__dirname);
const VISITS_FILE = path.join(__dirname, 'visits.json');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files (the HTML, CSS and JS in the project root)
app.use(express.static(PUBLIC, { index: 'index (5).html' }));

// Simple ping endpoint
app.get('/ping', (req, res) => {
  res.json({ ok: true, ts: Date.now(), via: 'backend' });
});

// Mensaje simple
app.get('/api/mensaje', (req, res) => {
  res.json({ mensaje: `Hola desde el servidor! (${new Date().toLocaleString()})` });
});

// Server time
app.get('/api/time', (req, res) => {
  res.json({ now: new Date().toISOString(), locale: new Date().toString(), tz: Intl.DateTimeFormat().resolvedOptions().timeZone });
});

// Random: number and quote
const QUOTES = [
  'No dejes para mañana lo que puedes hacer hoy.',
  'El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es ahora.',
  'Hazlo con pasión o no lo hagas en absoluto.'
];
app.get('/api/random', (req, res) => {
  const num = Math.floor(Math.random() * 1000);
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  res.json({ num, quote });
});

// Visits counter (stored in visits.json)
async function readVisits() {
  try {
    const txt = await fs.readFile(VISITS_FILE, 'utf8');
    return JSON.parse(txt);
  } catch (e) {
    return { count: 0 };
  }
}
async function writeVisits(obj) {
  await fs.writeFile(VISITS_FILE, JSON.stringify(obj, null, 2), 'utf8');
}

app.get('/api/visits', async (req, res) => {
  const v = await readVisits();
  v.count = (v.count || 0) + 1;
  await writeVisits(v);
  res.json({ visits: v.count });
});

app.post('/api/visits/reset', async (req, res) => {
  await writeVisits({ count: 0 });
  res.json({ ok: true, visits: 0 });
});

// Echo POST - returns the posted JSON
app.post('/api/echo', (req, res) => {
  res.json({ received: req.body, ts: Date.now() });
});

// Return request headers for debugging
app.get('/api/headers', (req, res) => {
  res.json({ headers: req.headers, ip: req.ip });
});

// Download a generated text file
app.get('/download', (req, res) => {
  const content = `Export generado: ${new Date().toLocaleString()}\nLínea de ejemplo 1\nLínea de ejemplo 2\n`;
  res.setHeader('Content-Disposition', 'attachment; filename="demo-export.txt"');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(content);
});

// Server-Sent Events: push the current time every second
app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const id = Date.now();
  const interval = setInterval(() => {
    const data = { now: new Date().toISOString(), ts: Date.now() };
    res.write(`id: ${id}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 1000);

  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

// Fallback route to make routing clear
app.use((req, res) => {
  if (req.path.startsWith('/api') || req.path === '/ping') {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(PUBLIC, 'index (5).html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
