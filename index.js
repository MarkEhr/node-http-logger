const http = require('http');
const fs = require('fs');
const config = require('./config.json');

const defaultResponse = {
    "status": 200,
    "body": "{\"message\": \"Hello, world!\"}"
};

// Configuration
const port = config.port? Number(config.port) : 3000;
const logFile = config.logFile? config.logFile : 'requests.log';
const response = config.response? config.response : defaultResponse;
if(!response.status ) response.status = 200;
if(!response.body ) response.body = "Request logged";

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

        console.log( `${new Date().toISOString()} - Received request to ${req.url}` );

        fs.appendFileSync(logFile, logEntry);

        if( response.headers ) {
            const status = response.status? response.status : 200;
            res.writeHead(status, response.headers);
        }
        res.end(response.body);
    });
});

// Start server
server.listen( port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
