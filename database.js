import pkg from 'pg';
const { Pool } = pkg;

import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT || 5432, // Puerto por defecto de PostgreSQL
});


export async function getTodosById(id) {
  const result = await pool.query(`
    SELECT todos.*, shared_todos.shared_with_id
    FROM todos
    LEFT JOIN shared_todos ON todos.id = shared_todos.todo_id
    WHERE todos.user_id = $1 OR shared_todos.shared_with_id = $1;
  `, [id]);

  const rows = result.rows;
  return rows;
}

  



export async function getTodo(id) {
  const result = await pool.query(`SELECT * FROM todos WHERE id = $1`, [id]);
  const row = result.rows[0]; // Accede a la primera fila del resultado

  return row; // Devuelve la fila como resultado
}



export async function getSharedTodoById(id) {
    const result = await pool.query(`SELECT * FROM todos WHERE todo_id = $1`, [id]);
    const row = result.rows[0]; // Accede a la primera fila del resultado
  
    return row; // Devuelve la fila como resultado
  }
  
  
  export async function getUserById(id) {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    const row = result.rows[0]; // Accede a la primera fila del resultado
  
    return row; // Devuelve la fila como resultado
  }
  
  export async function getUserByEmail(email) {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    const row = result.rows[0]; // Accede a la primera fila del resultado
  
    return row; // Devuelve la fila como resultado
  }

  export async function createTodo(user_id, title) {
    const result = await pool.query(`
      INSERT INTO todos (user_id, title)
      VALUES ($1, $2)
      RETURNING id;
    `, [user_id, title]);
  
    const todoID = result.rows[0].id; // Accede al ID de la primera fila del resultado
  
    return getTodo(todoID); // Devuelve la fila como resultado
  }
  
  export async function deleteTodo(id) {
    const result = await pool.query(
      `
      DELETE FROM todos WHERE id = $1;
      `,
      [id]
    );
  
    return result;
  }
  export async function toggleCompleted(id, value) {
    const result = await pool.query(
      `
      UPDATE todos
      SET completed = $1
      WHERE id = $2;
      `,
      [value, id]
    );
  
    return result;
  }
  
  export async function shareTodo(todo_id, user_id, shared_with_id) {
    const result = await pool.query(
      `
      INSERT INTO shared_todos (todo_id, user_id, shared_with_id)
      VALUES ($1, $2, $3)
      RETURNING id;
      `,
      [todo_id, user_id, shared_with_id]
    );
  
    return result.rows[0].id;
  }
  