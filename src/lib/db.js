import "server-only"; // 이 파일은 서버 전용입니다.

import { MongoClient, ServerApiVersion } from "mongodb";

// 환경설정 파일에서 DB_URI를 가져옵니다.
if(!process.env.DB_URI) {
  throw new Error("DB_URI is not set");   
}

// MongoDB 클라이언트를 생성합니다.
const client = new MongoClient(process.env.DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


// DB에 연결하는 함수입니다.
async function getDB(dbName) {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // console.log(">>>> Connected to MongoDB <<<<");
    return client.db(dbName);
  } catch (err) {
    console.error(err);
  } 
}

// DB에 연결된 후, collection을 가져오는 함수입니다.
// DBNAME은 next_blog_db 입니다.
export async function getCollection(collectionName) {
  const db = await getDB('next_blog_db');
  if(db) {
    // console.log(db.collection(collectionName));
    return db.collection(collectionName);
  }
  return null;
}

