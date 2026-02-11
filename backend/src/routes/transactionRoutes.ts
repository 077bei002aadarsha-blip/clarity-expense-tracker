import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createTransaction, getTransactions, getTransactionById, updateTransaction, deleteTransaction } from "../controllers/transactionController";

const router = Router();

//creating a new transaction
router.post("/", authMiddleware, createTransaction);


//getting all transactions for authenticated user
router.get("/", authMiddleware, getTransactions);

//getting a single transaction by id
router.get("/:id", authMiddleware, getTransactionById);

//updating a transaction
router.put("/:id", authMiddleware, updateTransaction);

//deleting a transaction
router.delete("/:id", authMiddleware, deleteTransaction);

export default router;
