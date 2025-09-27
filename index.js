import http from 'http';
import url from 'url';
import fs from 'fs';


http.createServer((req, res) => {
    const query = url.parse(req.url, true);
    const fileName = `./files/${query.pathname}`

    fs.readFile(fileName, (err, data) => {
        if (err) {
            console.log(err);
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end(query.pathname + "404: File not found!");
        }

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
}).listen(8889);