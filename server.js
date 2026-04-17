const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Simple file-based data store
const DATA_FILE = '/data/campaigns.json';
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) return JSON.parse(fs.readFileSync(DATA_FILE));
  } catch(e) {}
  return {
    campaigns: [],
    leads: [],
    stats: { sourced: 0, contacted: 0, replied: 0, booked: 0 },
    agents: [
      { name: "Lead Agent", status: "idle", lastRun: null },
      { name: "Outreach Agent", status: "idle", lastRun: null },
      { name: "Inbox Agent", status: "idle", lastRun: null }
    ],
    activity: []
  };
}
function saveData(d) {
  fs.mkdirSync('/data', { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2));
}

app.get('/api/data', (req, res) => res.json(loadData()));
app.post('/api/data', (req, res) => { saveData(req.body); res.json({ ok: true }); });

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.listen(PORT, () => console.log(`Dashboard running on port ${PORT}`));
