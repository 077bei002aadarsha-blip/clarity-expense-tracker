import express,{ Request, Response } from "express";
import authRoutes from "./routes/authRoutes";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/database";


const app = express();


dotenv.config();

const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ message: "Server is healthy" });
});

app.use("/api/auth", authRoutes);


app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Auth endpoints:`);
    console.log(`  - POST http://localhost:${PORT}/api/auth/signup`);
    console.log(`  - POST http://localhost:${PORT}/api/auth/login`);
    
    // Test database connection
    try {
        await pool.query('SELECT NOW()');
        console.log('Connected to PostgreSQL database');
    } catch (error) {
        console.error('Failed to connect to PostgreSQL:', error);
    }
}); 