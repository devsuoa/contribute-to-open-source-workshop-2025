import { db } from './db-utils.js';

const clearDb = () => {
  db.serialize(() => {
    db.run('DROP TABLE IF EXISTS users');
    db.run('DROP TABLE IF EXISTS problems');
    db.run('DROP TABLE IF EXISTS user_problem_status');
    db.run('DROP TABLE IF EXISTS user_tokens')
  });
};

const initDb = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
      )
    `);
    
    db.run(`
      CREATE TABLE IF NOT EXISTS problems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        solution TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS user_problem_status (
        user_id INTEGER,
        problem_id INTEGER,
        last_attempt TIMESTAMP,
        solved BOOLEAN,
        PRIMARY KEY (user_id, problem_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (problem_id) REFERENCES problems(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS user_tokens (
        token_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        token TEXT,
        expires_at TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);



    console.log('Database initialized');
  });
};

const seedDb = () => {
  const USERS = [
    { username: 'alice', password: 'password123' },
    { username: 'bob', password: 'securepass' }
  ];
  
  const PROBLEMS = [
    { title: 'Small Primes', description: 'How many prime numbers are there under 100?', solution: '25' },
    { title: 'Fibonacci', description: `The Fibonacci numbers F(n) are defined as follows. F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2) for n > 1. Find F(10).`, solution: '55' }
  ];

  db.serialize(() => {
    const insertUser = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    USERS.forEach(user => {
      insertUser.run(user.username, user.password);
    });
    insertUser.finalize();

    const insertProblem = db.prepare('INSERT INTO problems (title, description, solution) VALUES (?, ?, ?)');
    PROBLEMS.forEach(problem => {
      insertProblem.run(problem.title, problem.description, problem.solution);
    });
    insertProblem.finalize();

    console.log('Database seeded');
  });
};

clearDb();
initDb();
seedDb();