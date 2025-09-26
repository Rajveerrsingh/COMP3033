// server.js
const connect = require('connect');
const http = require('http');
const { URL } = require('url'); // built-in Node module

const app = connect();

// Route handler for GET /lab2
app.use((req, res, next) => {
  if (req.method !== 'GET' || !req.url.startsWith('/lab2')) return next();

  const url = new URL(req.url, `http://${req.headers.host}`);
  const method = (url.searchParams.get('method') || '').toLowerCase();
  const xStr = url.searchParams.get('x');
  const yStr = url.searchParams.get('y');

  // basic validation
  if (!method || xStr === null || yStr === null) {
    return sendError(res, 400, 'Missing required query params: method, x, y');
  }

  const xNum = Number(xStr);
  const yNum = Number(yStr);
  if (!Number.isFinite(xNum) || !Number.isFinite(yNum)) {
    return sendError(res, 400, 'x and y must be valid numbers');
  }

  let result;
  switch (method) {
    case 'add':
      result = xNum + yNum;
      break;
    case 'subtract':
      result = xNum - yNum;
      break;
    case 'multiply':
      result = xNum * yNum;
      break;
    case 'divide':
      if (yNum === 0) return sendError(res, 400, 'Cannot divide by zero');
      result = xNum / yNum;
      break;
    default:
      return sendError(res, 400, 'Invalid method. Use add, subtract, multiply, or divide');
  }

  const payload = {
    x: String(xStr),
    y: String(yStr),
    operation: method,
    result: String(result)
  };

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
});

// Fallback 404 for everything else
app.use((req, res) => {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

http.createServer(app).listen(3000, () => {
  console.log('lab2 server listening on http://localhost:3000');
});

// helper
function sendError(res, code, msg) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: msg }));
}
