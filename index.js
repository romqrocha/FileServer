import http from 'http';
import url from 'url';
import fs from 'fs';
import {en} from './langs/en.js';

class FileServer {
    /**
     * Creates and returns the file server
     * @returns {http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>}
     */
    static server() {
        const server = http.createServer((req, res) => {
            const routeHandlers = {
                "read": FileServer.renderFile,
                "write": FileServer.appendToFile,
            }

            let urlPath = req.url.slice(1)

            if (!urlPath.includes('/')) {
                urlPath = urlPath.concat('/');
            }
            if (urlPath.includes('?')) {
                const index = urlPath.indexOf('?');
                urlPath = urlPath.slice(0, index);
            }
            const firstSlash = urlPath.indexOf('/');

            const route = urlPath.slice(0, firstSlash);
            const fileName = urlPath.slice(firstSlash + 1);
            const filePath = `./files/${fileName}`;

            const handler = routeHandlers[route];
            if (!handler) {
                const errMsg = `${en.routing.msg404.replace('%0', route)}`
                return FileServer.renderError(404, errMsg, res);
            }

            handler(filePath, req, res);
        });
        return server;
    }

    /**
     * Renders a 404 with the specified message
     * @param {number} code
     * @param {string} msg 
     * @param {http.ServerResponse<http.IncomingMessage>} res 
     * @param {string} logMsg
     * @returns {http.ServerResponse<http.IncomingMessage>}
     */
    static renderError(code, msg, res, logMsg=null) {
        if (logMsg && logMsg !== "") {
            console.log(logMsg);
        }

        res.writeHead(code, {'Content-Type': 'text/html'});
        return res.end(`${code.toString()}: ${msg}`);
    }

    /**
     * Renders file as HTML
     * @param {string} filePath 
     * @param {http.IncomingMessage} req
     * @param {http.ServerResponse<http.IncomingMessage>} res
     * @returns {http.ServerResponse<http.IncomingMessage>}
     */
    static renderFile(filePath, req, res) {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                const fileName = filePath.replace('./files/', '');
                const errMsg = `${en.read.msg404.replace('%0', fileName)}`;
                return FileServer.renderError(404, errMsg, res, err.toString());
            }

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        });
    }

    /**
     * Appends text to file
     * @param {string} filePath
     * @param {http.IncomingMessage} req
     * @param {http.ServerResponse<http.IncomingMessage>} res
     * @returns {http.ServerResponse<http.IncomingMessage>}
     */
    static appendToFile(filePath, req, res) {
        const query = url.parse(req.url, true);
        const data = query.query['text'];

        if (!data) {
            const errMsg = en.write.msg400;
            return FileServer.renderError(400, errMsg, res);
        }

        fs.appendFile(filePath, data, (err) => {
            if (err) {
                const errMsg = en.write.msgWriteErr;
                return FileServer.renderError(500, errMsg, res, err.toString());
            }

            res.writeHead(200, {'Content-Type': 'text/html'});
            return res.end(en.write.msgWriteSuccess);
        })
    }    
    
} 

FileServer.server().listen(8889);
