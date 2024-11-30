import express from "express";
const app = express();
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import dataRoutes from "./routes/data.js";
import projectRoutes from "./routes/project.js";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";

//middlewares
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
app.use(express.json());
app.use(
    cors({
        origin: "http://http://188.165.231.114:3000",
    })
);
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../client/public/upload");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
    const file = req.file;
    res.status(200).json(file.filename);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/data", dataRoutes);

app.listen(8800, () => {
    console.log("API working!");
});