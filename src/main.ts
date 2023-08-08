import { Cdc } from "./cdc.js"
import { Mongo } from "./mongo.js"
import http from "http"
import { getBody } from "./utils/get-body.js"
import { StartProduce } from "./validator/start-profuce.js"
import { getEnv } from '@fullstacksjs/toolbox';
import * as dotenv from 'dotenv';

dotenv.config();

console.log("CDC started.")

const uri: string = getEnv('MONGO_CONNECTION_STRING', 'mongodb://127.0.0.1:27017,127.0.0.1:27018');
const client = await Mongo(uri)


const host = getEnv('SERVER_HOST', 'localhost')
const port = parseInt(getEnv(process.env.SERVER_PORT,'3030') , 10)
const autoProduce = JSON.parse(getEnv('AUTO_PRODUCE', 'false'))

const cdc = new Cdc(client)
let cdcAlreadyCreated: boolean = false

if (autoProduce) {
  cdc.startProduceChanges({fullDocument: "updateLookup"})
  cdcAlreadyCreated = true
  console.log('Automatic production has been started.')
}

// ----- server -----

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
        cdcAlreadyCreated = false
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