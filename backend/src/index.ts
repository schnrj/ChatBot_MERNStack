import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";

const PORT=process.env.PORT||5000;
 // connections and listeners
 connectToDatabase().then(()=>{
  app.listen(PORT,()=>
  console.log("Server Open & Connected to DataBase")
);
 })
 .catch((error)=>console.log(error));
 