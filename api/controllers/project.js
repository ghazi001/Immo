import { db } from "../connect.js";

export const getProjects = (req, res) => {

    const q = `SELECT * FROM projects`;

    db.query(q, (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json(data);
    });
};

export const getProjectsByUserId = (req, res) => {
    const userId = req.query.userId;
    const q = "SELECT p.*, v.ville,c.commune, q.quartier, z.zone FROM projects p left join villes v on p.villeId = v.id left join communes c on p.communeId = c.id left join quartiers q on p.quartierId = q.id left join zones z on p.zoneId = z.id WHERE userId=?";

    db.query(q, [userId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};

export const getPerso = (req, res) => {
    const id = req.query.projectId;
    const q = `SELECT * FROM personnalisations WHERE projectId=?`;

    db.query(q, [id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};

export const addPersonalization = (req, res) => {
    const projectId = req.query.projectId;
    var list = [];
    list = req.body;

    var q = " DELETE FROM personnalisations WHERE projectId=?";
    db.query(q, [projectId], (err, data) => {
        if (err) return res.status(500).json(err);
    });

    q = " INSERT INTO personnalisations (`piece`,`nombre`, `surface`,`projectId`) VALUES ";
    var surface = 0;
    var nbrP = 0;
    list.map((item, index) => {
        nbrP += parseInt(item.nombre);
        surface += parseFloat(item.surface) * parseInt(item.nombre);
        q += "('" + item.piece + "'," + item.nombre + ",'" + item.surface + "'," + projectId + ")";
        if (index != list.length - 1)
            q += " , ";
    });
    db.query(q, (err, data) => {
        if (err) {
            return res.status(500).json(err.data);
        }
    });
    
    q = " UPDATE projects SET nbrPiece=? , surface=? WHERE id=?";
    db.query(q, [nbrP, surface, projectId], (err, data) => {
        if (err) {
            return res.status(500).json(err.data);
        }
        return res.status(200).json("Votre projet a été créé.");
    });
};

export const addProject = (req, res) => {

    const q = " INSERT INTO projects (`villeId`,`communeId`,`quartierId`,`zoneId`,`titre`,`dateTitre`,`typeMaison`,`typeStanding`,`garage`,`nbrPiece`,`surface`,`topologie`,`financement`, `userId`) VALUES(?)";

    const values = [
        req.body.villeId,
        req.body.communeId,
        req.body.quartierId,
        req.body.zoneId,
        req.body.titre,
        req.body.dateTitre,
        req.body.typeMaison,
        req.body.typeStanding,
        req.body.garage,
        req.body.nbrPiece,
        req.body.surface,
        req.body.topologie,
        req.body.financement,
        req.body.userId,
    ];
    db.query(q, [values], (err, data) => {
        if (err) {
            return res.status(500).json(err.data);
        }
        return res.status(200).json(data.insertId);
    });
};

export const deleteProject = (req, res) => {
    const id = req.query.projectId;

    const q = `DELETE FROM projects WHERE id=?`;

    db.query(q, [id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};