const http = require('http');
const fs = require('fs');
const config = require('./config.json');

// Configuration
const port = config.port? Number(config.port) : 3000;
const logFile = config.logFile? config.logFile : 'requests.log';

// Set up server
const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // Convert Buffer to string
    });

    req.on('end', () => {

        const logEntry = `
-------------------------------------
Date: ${new Date().toISOString()}
IP: ${req.socket.remoteAddress}
URL: ${req.method} ${req.url}
Headers: ${JSON.stringify(req.headers, null, 2)}
Body:
${body}
`;

        console.log( `${new Date().toISOString()} - Received request to ${req.URL}` );

        fs.appendFileSync(logFile, logEntry);

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Request logged');
    });
});

// Start server
server.listen( port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
