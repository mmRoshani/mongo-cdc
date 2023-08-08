import { ChangeStream, ChangeStreamDocument, ChangeStreamOptions, Collection, Document, MongoClient } from "mongodb";

export class Cdc {

    private changeStream: ChangeStream<Document, ChangeStreamDocument<Document>>
    constructor(private readonly streamSource: Collection<Document> | MongoClient){}
    
    public startProduceChanges(cdcOptions:  ChangeStreamOptions): void {
        console.log("Start to watch the stream source.")
        this.changeStream = this.streamSource.watch(
            [],          // TODO: 1. fetch the pipeline
            cdcOptions   // TODO: 2. fetch the options 
            )
        this.changeStream.on('change', (change) => {
            console.log(change)
        })
    }

    public async stopProduceChanges(): Promise<boolean> {
        await this.changeStream.close()
        return this.changeStream.closed
    }
}