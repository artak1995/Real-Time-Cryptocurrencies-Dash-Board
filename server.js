const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const port = 8000;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);
const io = socketIo(server);

let interval;
io.on("connection", socket => {
  console.log("New client connected");
//   if (interval) {
//     clearInterval(interval);
//   }
  interval = setInterval(() => getApiAndEmit(socket), 5000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const APIinstance = axios.create({
    baseURL: 'https://api.cryptonator.com/api/ticker/',
    maxRedirects: 25,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
  });
var resObj; 

global.btcBuffer , global.ethBuffer, global.ltcBuffer;

const getApiAndEmit =  socket => {
  try {
    axios.all([
      axios.get('https://api.cryptonator.com/api/ticker/btc-usd', {maxRedirects: 30, headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',}}),
      axios.get('https://api.cryptonator.com/api/ticker/eth-usd', {maxRedirects: 30, headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',}}),
      axios.get('https://api.cryptonator.com/api/ticker/ltc-usd', {maxRedirects: 30, headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',}}),      
      ])
      .then(axios.spread((btcRes, ethRes, ltcRes) => {
        if (btcRes.data.ticker){
          btcBuffer = btcRes.data.ticker;
        }
        if (ethRes.data.ticker){
          ethBuffer = ethRes.data.ticker;
        }
        if (ltcRes.data.ticker){
          ltcBuffer = ltcRes.data.ticker;
        }
        resObj = { btc: btcRes.data.ticker , eth: ethRes.data.ticker, ltc: ltcRes.data.ticker};
        socket.broadcast.emit("FromAPI", resObj);
        console.log(btcBuffer);
        console.log(ethBuffer);
        console.log(ltcBuffer);
        console.log(resObj);
        }))
        .catch(function (error) {
            // handle error
            console.log("Erron in API CALL");
            console.log(error);
        })

    console.log('END OF TRY BLOCK');
  } catch (error) {
    console.log('Reached here2');
    console.error(`Error: ${error.code}`);
  }
};

server.listen(port, () => console.log(`Listening on port ${port}`));