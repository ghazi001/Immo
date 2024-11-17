import express from "express";
import { getCities, getmunicipalities, getZones, getQuarters } from "../controllers/data.js";

const router = express.Router()

router.get("/cities", getCities)
router.get("/communes/:Id", getmunicipalities)
router.get("/zones/:Id", getZones)
router.get("/quarters/:Id", getQuarters)


export default router