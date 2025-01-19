import express from "express"
import { getUser, updatePassword, updateUser } from "../controllers/user.js";

const router = express.Router();

router.get("/find/:userId", getUser)
router.put("/updatePassword", updatePassword)
router.put("/updateAccount", updateUser)

export default router
