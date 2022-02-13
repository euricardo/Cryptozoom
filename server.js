const { createServer } = require("http");
const WebSocket = require("ws");
const { app, sessionParser } = require("./app");
const { Spot } = require('@binance/connector')

const clientBin = new Spot('', '', {
  wsURL: 'wss://testnet.binance.vision' // If optional base URL is not provided, wsURL defaults to wss://stream.binance.com:9443
})

const PORT = process.env.PORT ?? 3000;
const server = createServer(app);
const wss = new WebSocket.Server({ clientTracking: false, noServer: true });
const map = new Map();

server.on("upgrade", (request, socket, head) => {
  console.log("Parsing session from request...");

  sessionParser(request, {}, () => {
    
    if (!request.session.user?.id) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }
    console.log("Session is parsed!");
    // switch from http to ws
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });
});

//_________________________________________________

wss.on("connection", (ws, request) => {
  const { id, name } = request.session.user;
  map.set(id, ws);
  console.log(id);
  console.log(map.id);




  ws.on("message", async (message) => {
    const parsed = JSON.parse(message);
    console.log(parsed);

    const callbacks = {
      open: () => clientBin.logger.log('open'),
      close: () => clientBin.logger.log('closed'),
      message: data => {

        for (const [userid,ws] of map) {
          if(userid===id){
            ws.send(data);
          }
        }
        
        // console.log("message data");
        // map.forEach((client) => {
        //   if (client.readyState === WebSocket.OPEN) {
        //     client.send(
        //       data
        //     )
        //   }
        // })
        
        // // найти клиента по айди
        // // client.send(
        // //   JSON.stringify({
        // //     type: 'jjkk',
        // //     payload: { data },
        // //   })
        // // )
  
      }
    }

    clientBin.combinedStreams(["btcusdt@miniTicker", "btcusdt@miniTicker"],callbacks);



    // switch (parsed.type) {
    //   case "NEW_MESSAGE":
    //     console.log("message on back", parsed);
    //     map.forEach((client) => {
    //       if (client.readyState === WebSocket.OPEN) {
    //         client.send(
    //           JSON.stringify({
    //             type: parsed.type,
    //             payload: { name, message: parsed.payload.text },
    //           })
    //         );
    //       }
    //     });
    //     break;
    //   case "CONNECT":
    //     map.forEach((client) => {
    //       if (client.readyState === WebSocket.OPEN) {
    //         client.send(
    //           JSON.stringify({
    //             type: parsed.type,
    //             payload: { name, id},
    //           })
    //         );
    //       }
    //     });
    //     break;

    //   default:
    //     break;
    // }
  });

  ws.on("close", () => {
    map.delete(id);
  });
});






//_________________________________________________

server.listen(PORT, () =>
  console.log(`Server has been started on PORT: ${PORT}`)
)
