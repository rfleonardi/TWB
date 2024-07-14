import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import app from './app.js';

dotenv.config({ path: '.env'})
const port = process.env.PORT || 8080
const server = http.createServer(app)

server.listen(port, () => {
  console.log(`Server running on ${process.env.ENDPOINT}:${port}`);
})