import { NextFunction,Request,Response } from "express";
import {body,ValidationChain, validationResult} from "express-validator";


export const validate=(validations:ValidationChain[])=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
        for(let validation of validations){
            const result=await validation.run(req);
            if(!result.isEmpty()){
                break;
            }
        }
        const errors=validationResult(req);
        if(errors.isEmpty()){
            return next();
        }
        return res.status(422).json({errors:errors.array()})
    };
};


export const loginValidator: ValidationChain[] = [
    body("email").trim().isEmail().withMessage("A valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
];


export const signupValidator: ValidationChain[] = [
    body("name").notEmpty().withMessage("Name is required"),
    ...loginValidator, // Reuse email and password validations from login
];
// export { validate, signupValidator };