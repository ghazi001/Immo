import express from "express"
import { getUsers, test, getUser } from "../controllers/user.js";

const router = express.Router();

router.get("/all", getUsers)
router.get("/test", test)
router.get("/find/:userId", getUser)

export default router
