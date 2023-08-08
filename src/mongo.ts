import { Collection, Document, MongoClient } from 'mongodb'

export async function Mongo(url: string): Promise<Collection<Document> | MongoClient>{
    const client = new MongoClient(url)
    
    console.log('Connecting to server...');

    await client.connect();
    
    console.log('Connected successfully to server.');

    return client
};