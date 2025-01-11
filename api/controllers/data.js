import { db } from "../connect.js";

export const getCities = (req, res) => {

    const q = `SELECT * FROM villes`;

    db.query(q, (err, data) => {
        if (err) {
            return res.status(500).json(err);
            console.log("Error");
        }
        return res.status(200).json(data);
    });
};

export const getmunicipalities = (req, res) => {
    console.log("Start Api:");
    const id = req.query.villeId;
    console.log(id);
    const q = "SELECT * FROM communes WHERE id_ville=?";

    db.query(q, [id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};


export const getZones = (req, res) => {
    const id = req.query.communeId;
    const q = "SELECT * FROM zones WHERE id_commune=?";

    db.query(q, [id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};

export const getQuarters = (req, res) => {
    const id = req.query.communeId;

    const q = "SELECT * FROM quartiers WHERE id_commune=?";

    db.query(q, [id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};