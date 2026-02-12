import {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    host: process.env.PGHOST || process.env.DB_HOST,
    port: Number(process.env.PGPORT || process.env.DB_PORT),
    user: process.env.PGUSER || process.env.DB_USER,
    database: process.env.PGDATABASE || process.env.DB_NAME,
    password: process.env.PGPASSWORD || process.env.DB_PASSWORD,
})


pool.on('connect', ()=>{
console.log('Connected to the database');
})

pool.on('error', (err)=>{
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export default pool;