import { MqttClient, connect } from "mqtt"
import { ChangeStream, ChangeStreamDocument, ChangeStreamOptions, Collection, Document, MongoClient } from "mongodb";
import { topicMapper } from "./utils/topic-mapper.js";
import { getEnv } from '@fullstacksjs/toolbox';

export class Cdc {

    private changeStream: ChangeStream<Document, ChangeStreamDocument<Document>>
    private mqtt: MqttClient

    constructor(private readonly streamSource: Collection<Document> | MongoClient){
        const mqttHost:string = getEnv('MQTT_HOST', 'localhost')
        const mqttPort:string = getEnv('MQTT_PORT', '1883')

        this.mqtt = connect(`mqtt://${mqttHost}:${mqttPort}`, { 
            clean: true,
            connectTimeout: 4000,
            username: 'emqx',
            password: 'public',
         })
    }
    
    public startProduceChanges(cdcOptions:  ChangeStreamOptions): void {
        console.log("Connecting to mqtt...")
        this.mqtt.on('connect', function () {})
        console.log("mqtt connected successfully.")

        console.log("Start to watch the stream source.")
        this.changeStream = this.streamSource.watch(
            [],          // TODO: fetch the pipeline
            cdcOptions
            )
        this.changeStream.on('change', (change) => {
            if(this.mqtt.connected){
                const topic = topicMapper(change)
                this.mqtt.publishAsync(topic, JSON.stringify(change) , { qos:0, retain: false })
            }
            else{
                throw new Error('mqtt in not connected, remember token')
            }
        })
    }

    public async stopProduceChanges(): Promise<boolean> {
        try {
            await this.changeStream.close()
        } catch (error) {
            return false  
        }
        console.log('CDC closed successfully.')
        return this.changeStream.closed
    }
}