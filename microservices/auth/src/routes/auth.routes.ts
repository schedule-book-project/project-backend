import express from "express";
import { check } from "express-validator";
import { login, register } from "../controllers/auth.controller";

const router = express.Router();

router.post(
    "/register",
    [
        check("email", "Valid email is required").isEmail(),
        check("password", "Password must be at least 8 characters").isLength({ min: 8 }),
        check("password", "Password must contain an uppercase letter").matches(/[A-Z]/),
        check("password", "Password must contain a lowercase letter").matches(/[a-z]/),
        check("password", "Password must contain a number").matches(/\d/),
        check("password", "Password must contain a special character").matches(/[\W_]/),
    ],
    register
);

router.post(
    "/login",
    [
        check("email", "Valid email is required").isEmail(),
        check("password", "Password is required").exists(),
    ],
    login
);

export default router;
