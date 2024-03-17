// import express from "express";
//
// const chatRouter = express.Router();
// const activeConnection = {
//   user: [],
//   message: [],
// };
//
// chatRouter.ws('/chat', (ws, req) => {
//   const {_id} = req.body;
//   console.log(_id);
//   ws.send(JSON.stringify({type: 'LOGIN', payload: 'you did login'}));
//   ws.on('message', (message) => {
//     const parsedData = JSON.parse(message.toString());
//   });
//   ws.on('close', () => {
//     console.log('Client disconnected!');
//   });
// });
//
// export default chatRouter;