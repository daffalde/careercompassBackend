import { Client, Storage } from "node-appwrite";
import "dotenv/config";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT);

const storage = new Storage(client);

export { storage };
