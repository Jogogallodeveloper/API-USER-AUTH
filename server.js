//import express
import express from "express";
import publicRoutes from './routes/public.js'

//define the metodo of express
const app = express();
//define that i will use JSON to work
app.use(express.json());

//define the login user router
app.use('/users', publicRoutes);

//define the Server PORT
app.listen(3000, () => console.log("Server is Running 🚀"));