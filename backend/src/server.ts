import express,{ Request, Response } from "express";
import authRoutes from "./routes/authRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/database";
import { initializeDatabase } from "./config/initDb";


const app = express();


dotenv.config();

const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ message: "Server is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);


// Initialize database and start server
const startServer = async () => {
    try {
        // Test database connection
        console.log('Testing database connection...');
        await pool.query('SELECT NOW()');
        console.log('✅ Connected to PostgreSQL database');
        
        // Initialize database tables
        console.log('\n🔧 Initializing database tables...');
        await initializeDatabase();
        console.log('✅ Database tables initialized successfully\n');
        
        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/health`);
            console.log(`\nAuth endpoints:`);
            console.log(`  - POST http://localhost:${PORT}/api/auth/signup`);
            console.log(`  - POST http://localhost:${PORT}/api/auth/login`);
            console.log(`\nTransaction endpoints (require Authorization header with Bearer token):`);
            console.log(`  - POST   http://localhost:${PORT}/api/transactions`);
            console.log(`  - GET    http://localhost:${PORT}/api/transactions`);
            console.log(`  - GET    http://localhost:${PORT}/api/transactions/:id`);
            console.log(`  - PUT    http://localhost:${PORT}/api/transactions/:id`);
            console.log(`  - DELETE http://localhost:${PORT}/api/transactions/:id`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        console.error('Error details:', error);
        process.exit(1);
    }
};

startServer(); 