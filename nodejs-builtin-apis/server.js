/**
 * Exercise 7 — Node.js based Web development (no Express)
 *
 * Demonstrates built-in modules:
 *   - http   — createServer, handle requests/responses
 *   - fs     — read/write JSON data on disk
 *   - path   — join, extname, dirname
 *   - url    — parse pathname and query string
 *
 * Run: npm start  →  http://localhost:4000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 4000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_FILE = path.join(__dirname, 'data', 'notes.json');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
};

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

function ensureData() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');
}

function readNotes() {
  ensureData();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeNotes(notes) {
  ensureData();
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2), 'utf8');
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (c) => {
      raw += c;
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function serveStatic(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500);
      res.end(err.code === 'ENOENT' ? 'Not found' : 'Server error');
      return;
    }
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname || '/';
  const method = req.method;

  // CORS for local demos (browser may open from file or another origin in class)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (pathname === '/api/notes' && method === 'GET') {
    try {
      sendJson(res, 200, { status: 'ok', data: readNotes(), query: parsed.query });
    } catch (e) {
      sendJson(res, 500, { status: 'error', message: String(e.message) });
    }
    return;
  }

  if (pathname === '/api/notes' && method === 'POST') {
    try {
      const body = await readBody(req);
      const text = (body && body.text) || 'New note';
      const notes = readNotes();
      const id = notes.length ? Math.max(...notes.map((n) => n.id)) + 1 : 1;
      const note = { id, text, createdAt: new Date().toISOString() };
      notes.push(note);
      writeNotes(notes);
      sendJson(res, 201, { status: 'ok', data: note });
    } catch (e) {
      sendJson(res, 400, { status: 'error', message: String(e.message) });
    }
    return;
  }

  const rel = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
  const filePath = path.normalize(path.join(PUBLIC_DIR, rel));
  const root = path.normalize(PUBLIC_DIR + path.sep);
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  fs.stat(filePath, (err, st) => {
    if (!err && st.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    serveStatic(res, filePath);
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Exercise 7 server (http + fs + path + url only): http://localhost:${PORT}`);
});
