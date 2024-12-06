import express from "express";
import { getProjectsByUserId, getProjects, addProject } from "../controllers/project.js";

const router = express.Router()

router.get("/list/:UserId", getProjectsByUserId)
router.get("/", getProjects)
router.post("/addProject", addProject)



export default router