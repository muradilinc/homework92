import express from 'express';
import expressWs from 'express-ws';

const app = express();
const port = 8000;

app.listen(port, () => {
  console.log('port started: ' + port);
});
