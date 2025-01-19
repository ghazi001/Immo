import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const getUser = (req, res) => {

    const q = "SELECT * FROM users WHERE id=?";

    db.query(q, [userId], (err, data) => {
        if (err) return res.status(500).json(err);
        const { password, ...info } = data[0];
        return res.json(info);
    });
};

export const updateUser = (req, res) => {
    var q = "SELECT * FROM users WHERE username = ?";

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("L'utilisateur n'existe pas!");

        const q = "UPDATE users SET `name`=?,`email`=? WHERE id=? ";

        db.query(
            q,
            [
                req.body.name,
                req.body.email,
                data[0].id,
            ],
            (err, data) => {
                if (err) res.status(500).json(err);
                if (data.affectedRows > 0) return res.json("Updated!");
                return res.status(403).json("You can update only your info!");
            }
        );
    });
};

export const updatePassword = (req, res) => {
    var q = "SELECT * FROM users WHERE username = ?";

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("L'utilisateur n'existe pas!");

        const checkPassword = bcrypt.compareSync(
            req.body.oldPassword,
            data[0].password
        );

        if (!checkPassword)
            return res.status(400).json("Incorrect password");
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.newPassword, salt);

        q = "UPDATE users SET `password`=? WHERE id=? ";

        db.query(
            q,
            [
                hashedPassword,
                data[0].id,
            ],
            (err, data) => {
                if (err) res.status(500).json(err);
                if (data.affectedRows > 0) return res.json("Updated!");
                return res.status(403).json("You can update only your password!");
            }
        );
    });
};