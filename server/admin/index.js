import mongodb from "mongodb"
import dotenv from "dotenv"

dotenv.config()

const { MongoClient } = mongodb
const url = process.env.MONGO_URL

const client = new MongoClient(url)

const connectToDatabase = async () => {
  try {
    await client.connect()
    console.log("Connected to MongoDB")
    
    return client.db("Company")
  } catch (err) {
    console.error("Error connecting to MongoDB:", err)
    throw err
  }
}

export default connectToDatabase
