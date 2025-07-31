//define the modules imports
import express from "express";
import { PrismaClient } from "@prisma/client";
//import { Prisma } from "@prisma/client";

//define the router e Prisma 
const router = express.Router();
const prisma = new PrismaClient();

router.get('/list-user', async (req, res) => {
    try {

        //declare the methodo that will find the user
        const users = await prisma.user.findMany({ omit: { password: true }});




        //declare the response status
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error. Private List-user' });
    }
});

export default router;