import express from "express";
import { getCities, getmunicipalities, getZones, getQuarters } from "../controllers/data.js";

const router = express.Router()

router.get("/cities", getCities)
router.get("/communes", getmunicipalities)
router.get("/zones", getZones)
router.get("/quarters", getQuarters)


export default router