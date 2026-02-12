import pool from './database';

export const initializeDatabase = async () => {
  try {
    console.log('Initializing database tables...');

    // Drop existing tables to recreate with correct schema
    console.log('Dropping existing tables if they exist...');
    await pool.query('DROP TABLE IF EXISTS transactions CASCADE;');
    await pool.query('DROP TABLE IF EXISTS users CASCADE;');
    console.log('✓ Old tables dropped');

    // Create users table with correct schema
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Users table created with correct schema');

    // Create transactions table
    await pool.query(`
      CREATE TABLE transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Transactions table created');

    // Create indexes
    await pool.query(`
      CREATE INDEX idx_transactions_user_id ON transactions(user_id);
    `);
    await pool.query(`
      CREATE INDEX idx_transactions_date ON transactions(date);
    `);
    console.log('✓ Database indexes created');

    console.log('✅ Database initialization complete!');
  } catch (error: any) {
    console.error('❌ Database initialization error:', {
      message: error.message,
      code: error.code,
      detail: error.detail
    });
    throw error;
  }
};
