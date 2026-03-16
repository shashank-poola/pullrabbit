import express from "express";
import cors from "cors";
import mainrouter from "./routes";

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors())

const ALLOWED_ORIGINS = [
    "http://localhost:3000"
]

app.use("/api/v1")

app.listen(8000, () => {
    console.log("Server is running on PORT:", PORT)
});