import { Request, Response } from "express";
import pool from "../config/database";
import { isDataView } from "node:util/types";
import { create } from "node:domain";

//for creating new transaction
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { type, amount, category, description, date } = req.body;
    const userId = req.userId;

    //validating input
    if (!amount || !category || !date) {
      return res
        .status(400)
        .json({ error: "Amount, category and date are required" });
    }

    if (type !== "income" && type !== "expense") {
      return res
        .status(400)
        .json({ error: "Type must be either income or expense" });
    }

    if (amount <= 0) {
      return res
        .status(400)
        .json({ error: "Amount must be greater than zero" });
    }

    //InsertING     transaction
    const result = await pool.query(
      `INSERT INTO transactions(user_id,type,amount,category,description,date) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [userId, type, amount, category, description || null, date],
    );

    const transaction = result.rows[0];

    res.status(201).json({
      message: "Transaction created successfully",
      transaction: {
        id: transaction.id,
        type: transaction.type,
        amount: parseFloat(transaction.amount),
        category: transaction.category,
        description: transaction.description,
        date: transaction.date,
        created_at: transaction.created_at,
      },
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//getting all transaction for authenticated user
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const { type, category, startDate, endDate } = req.query;

    let query = `SELECT * FROM transactions WHERE user_id = $1`;
    const params: any[] = [userId];
    let paramCount = 1;

    //add filters if provided
    if (type) {
      paramCount++;
      query += ` AND type = $${paramCount}`;
      params.push(type);
    }

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }
    if (startDate) {
      paramCount++;
      query += ` AND date >= $${paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      query += ` AND date <= $${paramCount}`;
      params.push(endDate);
    }

    query += ` ORDER BY date DESC, created_at DESC`;

    const result = await pool.query(query, params);

    //Formating amount to float;
    const transactions = result.rows.map((transaction) => ({
      ...transaction,
      amount: parseFloat(transaction.amount),
    }));

    res.status(200).json({
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//getting single transaction by id
export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM transactions WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const transaction = result.rows[0];

    res.status(200).json({
      transaction: {
        ...transaction,
        amount: parseFloat(transaction.amount),
      },
    });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//updating transaction
export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { type, amount, category, description, date } = req.body;

    const checkResult = await pool.query(
      `SELECT * FROM transactions WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    //validate type if provided
    if (type && type !== "income" && type !== "expense") {
      return res
        .status(400)
        .json({ error: "Type must be either income or expense" });
    }

    if (amount !== undefined && amount <= 0) {
      return res
        .status(400)
        .json({ error: "Amount must be greater than zero" });
    }

    // updating transaction
    const result = await pool.query(
      `UPDATE transactions SET type = COALESCE($1, type), amount = COALESCE($2, amount), category = COALESCE($3, category), description = COALESCE($4, description), date = COALESCE($5, date) WHERE id = $6 AND user_id = $7 RETURNING *`,
      [type, amount, category, description, date, id, userId],
    );

    const transaction = result.rows[0];

    res.status(200).json({
      message: "Transaction updated successfully",
      transaction: {
        ...transaction,
        amount: parseFloat(transaction.amount),
      },
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Deleting Transaction

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json({
      message: "Transaction deleted successfully",
      transaction: {
        ...result.rows[0],
        amount: parseFloat(result.rows[0].amount),
      },
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
