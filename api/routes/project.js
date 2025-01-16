import express from "express";
import { getProjectsByUserId, getProjects, addProject, addPersonalization, getPerso, deleteProject } from "../controllers/project.js";

const router = express.Router()

router.get("/list", getProjectsByUserId)
router.get("/", getProjects)
router.post("/addProject", addProject)
router.delete("/deleteProject", deleteProject)
router.post("/addPerso", addPersonalization)
router.get("/getPerso", getPerso)



export default router