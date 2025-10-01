import { db } from "./db-utils.js";

const clearDb = () => {
  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS users");
    db.run("DROP TABLE IF EXISTS problems");
    db.run("DROP TABLE IF EXISTS user_problem_status");
    db.run("DROP TABLE IF EXISTS competition_user_status");
    db.run("DROP TABLE IF EXISTS user_tokens");
    db.run("DROP TABLE IF EXISTS competitions");
    db.run("DROP TABLE IF EXISTS competition_problems");
    db.run("DROP TABLE IF EXISTS submissions");
    console.log("Database cleared");
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
      CREATE TABLE IF NOT EXISTS competition_user_status (
        competition_id INTEGER,
        user_id INTEGER,
        points INTEGER,
        PRIMARY KEY (competition_id, user_id),
        FOREIGN KEY (competition_id) REFERENCES competitions(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
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

    db.run(`
        CREATE TABLE IF NOT EXISTS competitions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          start_time TIMESTAMP NOT NULL,
          end_time TIMESTAMP NOT NULL
        )
      `);

    db.run(`
        CREATE TABLE IF NOT EXISTS competition_problems (
          competition_id INTEGER,
          problem_id INTEGER,
          PRIMARY KEY (competition_id, problem_id),
          FOREIGN KEY (competition_id) REFERENCES competitions(id),
          FOREIGN KEY (problem_id) REFERENCES problems(id)
        )
      `);

    db.run(`
      CREATE TABLE IF NOT EXISTS submissions (
        competition_id INTEGER,
        problem_id INTEGER,
        user_id INTEGER,
        content TEXT,
        submitted_at TIMESTAMP,
        verdict TEXT CHECK( verdict IN ('Pending', 'Accepted', 'Rejected', 'Error') ) NOT NULL DEFAULT 'Pending',
        FOREIGN KEY (competition_id) REFERENCES competitions(id),
        FOREIGN KEY (problem_id) REFERENCES problems(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    console.log("Database initialized");
  });
};

const seedDb = () => {
  const USERS = [
    { username: "alice", password: "password123" },
    { username: "bob", password: "securepass" },
  ];

  const PROBLEMS = [
    {
      title: "Small Primes",
      description: "How many prime numbers are there under 100?",
      solution: "25",
    },
    {
      title: "Fibonacci",
      description: `The Fibonacci numbers F(n) are defined as follows. F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2) for n > 1. Find F(10).`,
      solution: "55",
    },
    { title: "Factorial", description: "What is 5!?", solution: "120" },
    {
      title: "Sum of Evens",
      description: "What is the sum of all even numbers from 1 to 100?",
      solution: "2550",
    },
  ];

  const COMPETITIONS = [
    {
      name: "Weekly Challenge",
      start_time: new Date(Date.now()), // Start now
      end_time: new Date(Date.now() + 2 * 60 * 60 * 1000), // End in 2 hours
      // end_time: new Date(Date.now() + 60 * 1000),  // End in 1 minute for testing
    },
    {
      name: "Past Challenge",
      start_time: new Date(Date.now() - 24 * 60 * 60 * 1000),
      end_time: new Date(Date.now() - 24 * 50 * 60 * 1000),
    },
  ];

  db.serialize(() => {
    const insertUser = db.prepare(
      "INSERT INTO users (username, password) VALUES (?, ?)",
    );
    USERS.forEach((user) => {
      insertUser.run(user.username, user.password);
    });
    insertUser.finalize();

    const insertProblem = db.prepare(
      "INSERT INTO problems (title, description, solution) VALUES (?, ?, ?)",
    );
    PROBLEMS.forEach((problem) => {
      insertProblem.run(problem.title, problem.description, problem.solution);
    });
    insertProblem.finalize();

    const insertCompetition = db.prepare(
      "INSERT INTO competitions (name, start_time, end_time) VALUES (?, ?, ?)",
    );
    COMPETITIONS.forEach((comp) => {
      insertCompetition.run(comp.name, comp.start_time, comp.end_time);
    });
    insertCompetition.finalize();

    const insertCompProblem = db.prepare(
      "INSERT INTO competition_problems (competition_id, problem_id) VALUES (?, ?)",
    );
    insertCompProblem.run(1, 1);
    insertCompProblem.run(1, 2);
    insertCompProblem.run(2, 3);
    insertCompProblem.run(2, 4);
    insertCompProblem.finalize();

    console.log("Database seeded");
  });
};

clearDb();
initDb();
seedDb();
