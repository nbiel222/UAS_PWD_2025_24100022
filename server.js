const http = require('http');
const fs = require ('fs');
const path = require('path');
const { stream } = require('undici-types');

const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, req.url);

    fs.access(filePath, fs.constants.F_OK,(err) => {
        if(err) {
            res.statusCode = 404;
            res.end('File not faund');
            return;
    }

    fs.stat(filePath,(err,stats) => {
        if (err) {
            res.statusCode = 500;
            res.end('server error');
            return;
        }
        res.setHeader('Content-length', stats.size);
        res.setHeader('Content-Type', 'application/octet-steam');
         
        const steam  = fs.createReadStream(filePath);

        stream.on('error',(err) => {
            console.error('Error reding file:' err);
            if (!res.headersSent) {
                res.statusCode = 500;
                res.end('Error reading file');
            }
        });

        stream.pipe(res);
      });
    });
});

const PORT = 3000;
server.listen(PORT, () => {
console.log (`File server running at http://localhost:${PORT}/`);
});