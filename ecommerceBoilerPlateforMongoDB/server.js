const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3999;

const server = http.createServer(app)
		.listen(port,() => console.log(`Server spinning on port: ${port}`));



		