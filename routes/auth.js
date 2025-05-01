import express from "express"

import { loginValidator, validate } from "../validators/authValidator.js"
import registerHandler from "../controllers/registerController.js"
import loginHandler from "../controllers/loginController.js"
import { registerAsProviderHandler } from "../controllers/registerController.js"
import authMiddleware from "../middlewares/authmiddleware.js"
const router = express.Router()


router.post("/register", validate, registerHandler)

router.post("/login", loginValidator, loginHandler)

router.post("/register/provider", authMiddleware, registerAsProviderHandler);

export default router
