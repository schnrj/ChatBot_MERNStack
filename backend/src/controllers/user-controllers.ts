import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { hash ,compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

export const getAllusers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Get all users
        const users = await User.find();
        return res.status(200).json({ message: "ok", users });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};

export const userSignup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // User signup
        const { name, email, password } = req.body; 
        const existingUser=await User.findOne({email});
        if(existingUser) return res.status(401).send("User Already Registered");
        const hashedPassword = await hash(password, 10); 

        const user = new User({ name, email, password: hashedPassword }); 
        await user.save();

        // create token and store the cookies
                // removing all the previous cookies
                res.clearCookie(COOKIE_NAME,{
                    httpOnly:true,
                    domain:"localhost",       
                    signed:true,
                    path:"/",
                });
                const token=createToken(user._id.toString(),user.email,"7d");
        const expires=new Date();
        expires.setDate(expires.getDate()+7);
        res.cookie(COOKIE_NAME,token,{
            path:"/",
            domain:"localhost",
            expires,
            httpOnly:true,
            signed:true,
        });
        
        return res.status(201).json({ message: "ok", name: user.name, email: user.email });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};

export const userLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // User login
        const {email, password } = req.body; 
        const user=await User.findOne({email});
        if(!user) return res.status(401).send("User not Registered");
        
        const isPasswordCorrect=await compare(password,user.password);
        if(!isPasswordCorrect) return res.status(403).send("Incorrect Password");

        // removing all the previous cookies
        res.clearCookie(COOKIE_NAME,{
            httpOnly:true,
            domain:"localhost",       
            signed:true,
            path:"/",
        });
        const token=createToken(user._id.toString(),user.email,"7d");
const expires=new Date();
expires.setDate(expires.getDate()+7);
res.cookie(COOKIE_NAME,token,{
    path:"/",
    domain:"localhost",
    expires,
    httpOnly:true,
    signed:true,
});

        // const hashedPassword = await hash(password, 10); 

        // const user = new User({ name, email, password: hashedPassword }); 
        // await user.save();
        return res.status(200).json({ message: "ok", name: user.name, email: user.email });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
