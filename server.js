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
    baseURL: 'https://api.cryptonator.com/api/ticker/'
  });
  
const getApiAndEmit =  socket => {
  try {
    const res =  APIinstance.get('/btc-usd', {
        maxRedirects: 25,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
        .then(function (response) {
            // handle success
            console.log('API CALL');  
            if (response.data.ticker != undefined)     
                socket.emit("FromAPI", response.data);
            console.log(response.data);
            
        })
        .catch(function (error) {
            // handle error
            console.log("Erron in API CALL");
            console.log(error);
        })
        .then(function () {
            // always executed
            console.log('AFTER API CALL');
        });
    // socket.emit("FromAPI", res.data);
    console.log('END OF TRY BLOCK');
  } catch (error) {
    console.log('Reached here2');
    console.error(`Error: ${error.code}`);
  }
};


// const res = axios.get('https://api.cryptonator.com/api/ticker/btc-usd')
//   .then(function (response) {
//     // handle success
//     console.log(response.data);
//   })
//   .catch(function (error) {
//     // handle error
//     console.log(error);
//   })
//   .then(function () {
//     // always executed
//     console.log('run');
//   });

server.listen(port, () => console.log(`Listening on port ${port}`));