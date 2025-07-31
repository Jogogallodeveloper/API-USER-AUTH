import express from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

// define the Prisma variable
const prisma = new PrismaClient()

const router = express.Router();

// the terminal comand to generate a random JWT Secret Key
//node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

// define the JWT secret
const JWT_SECRET = process.env.JWT_SECRET;


// define  [POST] the public router
router.post('/register', async (req, res) => {

  try {

    console.log("📩 console entoru no try [REQUEST BODY] =>", req.body);
    // define the const user from de body of the request
    const user = req.body

    if (!user.email || !user.name || !user.password) {
      res.status(400).json({ message: "Missing required (email,name,password) fields" });
    };

    //define the constant that will verifi if the user by his email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    //if the user alrdeay exists in the database, throw error
    if (existingUser) {
      console.warn(`⚠️ duplicated email${user.email}`);
      return res.status(400).json({ message: "Email already exists" });
    }

    //define the category of the encrypto
    const salt = await bcrypt.genSalt(10);
    console.log("🔑 [SALT GERADO] =>", salt); //log

    // define the methoto that will encrypto the password
    const hashPassword = await bcrypt.hash(user.password, salt);
    console.log("🔒 [HASH PASSWORD] =>", hashPassword); //log

    // define the action to create the user
    const userDB = await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: hashPassword, //call the variable passwoard from the schema.prisma but with encrypto by bcrypt bibliotec
      },
    });

    console.log("✅ [USER CRIADO NO DB] =>", userDB); //log

    //define the sucess message
    res.status(201).json(userDB);

  } catch (error) {
    console.error("❌ [ERRO NO SIGNUP] =>", error); //log
    // in case of error define the error message
    res.status(500).json({ message: "Server Error, try again !" });

  };
});

// define [post] router that will be use for the login of the user
router.post('/login', async (req, res) => {
  try {
    console.log("📩 console entoru no try [REQUEST BODY] =>", req.body);
    //define the data of the body
    const user = req.body;

    //validate if the data on json body are ok
    if (!user.email | !user.password) {
      res.status(400).json({ message: "Missing required fields !" });
    };

    //validate if the user exists
    const existUser = await prisma.user.findUnique({
      where: {
        email: user.email
      }
    });

    if (!existUser) {
      console.log("user not exists:", !existUser); // log
      console.warn(`user not found: ${user.email}`);
      return res.status(400).json({ message: "User Not Found !" });
    };

    // Get hashed password from DB
    const hashFromDB = existUser.password;

    // Compare plain text password from request with hash from DB
    const validPassword = await bcrypt.compare(user.password, hashFromDB);
    console.log("🔍 [PASSWORD VALIDATION] =>", validPassword);

    //verify if the password match
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    };

    // Generat JWT Secret Token
    const tokenJwtSecret = jwt.sign({id: user.id},JWT_SECRET, {expiresIn: '1m'});

    // return sucess message
    return res.status(200).json(tokenJwtSecret);

  } catch (error) {
    console.error("❌ [ERRO NO LOGIN] =>", error); //log
    // in case of error define the error message
    res.status(500).json({ message: "Server Error to login, try again !" });
  }
});


//export the object
export default router;