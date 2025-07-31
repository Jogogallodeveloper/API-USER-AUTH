//import modules
import express from "express";
import publicRoutes from './routes/public.js';
import privateRoutes from './routes/private.js';
import auth from "./middlewares/auth.js";




//define the metodo of express
const app = express();
//define that i will use JSON to work
app.use(express.json());

//define the login user Public route
app.use('/users', publicRoutes);

//define the list user Private route
app.use('/',auth, privateRoutes);

//define the Server PORT
app.listen(3000, () => console.log("Server is Running 🚀"));