import { Cdc } from "./cdc.js"
import { Mongo } from "./mongo.js"
import http from "http"
import { getBody } from "./utils/get-body.js"
import { StartProduce } from "./validator/start-profuce.js"

console.log("CDC started.")


const client = await Mongo()

// ----- server -----

const host = 'localhost'  // TODO: read from env
const port = 3030         // TODO: read from env
const cdc = new Cdc(client)
let cdcAlreadyCreated: boolean = false

const requestListener = async function (req, res) {
  res.setHeader("Content-Type", "application/json");
  if(req.method === 'POST'){
    switch (req.url) {
      case "/start-producer":
      if(!cdcAlreadyCreated) {
        cdc.startProduceChanges(new StartProduce(await getBody(req)))
        cdcAlreadyCreated = true
      }
        res.writeHead(201);
        res.end(`{"message": "CDC initialized"}`);
        break
      case "/stop-producer":
        // eslint-disable-next-line no-case-declarations
        const result = await cdc.stopProduceChanges()
        res.writeHead(200);
        res.end(`{"message": "CDC stopped", "result": ${result}}`);
        break
      default:
      res.writeHead(404);
      res.end(JSON.stringify({error:"Resource not found"}));
  }
  }else{
    res.writeHead(404);
    res.end(JSON.stringify({error:"Use valid http method"}));
  }
};


const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Http server is running on http://${host}:${port}`);
});