let http = require('http');
let server = http.createServer(function(req, res)
{res.writeHead(200);
res.end('My Node JS server is running!');
});
server.listen(3015);