# FileServer
A minimal Node.js server for me to test my webhosting architecture. Currently hosted at https://fileserver.romqrocha.ca/.

## Run with Node.js
1. `cd <root folder>`
2. `npm i`
3. `node index.js`
4. Access it on `localhost:2101`

## Usage
### Routes
`/read/<filename>`: For reading files
<br/>
`/write/<filename>?text=<content>`: For appending to files

### Parameters
`text`: The text content to append to the file

### Example
`https://fileserver.romqrocha.ca/write/example.txt?text=Hi From GitHub`
<br/>
`https://fileserver.romqrocha.ca/read/example.txt`
