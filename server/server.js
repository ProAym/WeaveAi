import express from "express"
import "dotenv/config"
import cors from "cors"
import cookieParser from "cookie-parser";
import { connectToDatabase } from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import projectRouter from "./routes/projectRoute.js";

const app = express();

await connectToDatabase()

app.use(cors({origin: process.env.ORIGINS.split(","), credentials: true}))
app.use(cookieParser())
app.use(express.json())

app.get("/", (req, res)=> res.send("Server is Live!"))
app.use('/api/auth', authRouter)
app.use('/api/projects', projectRouter )



//Centralized error handler
app.use((err, _req, res, _next)=>{
    console.error("[Error]", err);
    if (res.headersSent) return next(err);
    res.status(500).json({error: "Internal server error"});
})

const port = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectToDatabase();
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`)
        })
    } catch (err) {
        console.error("Failed to connect to database:", err.message);
        process.exit(1);
    }
}

startServer();