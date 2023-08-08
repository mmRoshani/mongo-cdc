import { Collection, Document, MongoClient } from 'mongodb'

export async function Mongo(): Promise<Collection<Document> | MongoClient>{
    const url = 'mongodb://127.0.0.1:27117,127.0.0.1:27118';
    const client = new MongoClient(url)
    
    console.log('Connecting to server...');

    await client.connect();
    
    console.log('Connected successfully to server.');

    return client
};