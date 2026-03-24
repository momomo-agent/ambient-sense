const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8765;
const DIR = __dirname;

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

function serve(req, res) {
  let filePath = path.join(DIR, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

// HTTPS (for camera access)
try {
  const key = fs.readFileSync(path.join(DIR, 'key.pem'));
  const cert = fs.readFileSync(path.join(DIR, 'cert.pem'));
  https.createServer({ key, cert }, serve).listen(PORT, '0.0.0.0', () => {
    console.log(`HTTPS server: https://0.0.0.0:${PORT}`);
  });
} catch (e) {
  // Fallback to HTTP
  http.createServer(serve).listen(PORT, '0.0.0.0', () => {
    console.log(`HTTP server: http://0.0.0.0:${PORT}`);
  });
}
