// Import sqlite3
import sqlite3 from 'sqlite3';
import { User, Problem, Competition, UserProblemStatus, UserToken } from '../types/types';

export const db = new sqlite3.Database('./database.sqlite');

// Utility functions to query the database
export const getUserById = (id: number): Promise<User | null> => {
    return new Promise<User | null>((resolve, reject) => {
        db.get('SELECT * FROM users WHERE id = ?', [id], (err, row: any) => {
            if (err) {
                return reject(err);
            }
            resolve(row ? { id: row.id, username: row.username, password: row.password } : null);
        });
    });
}

export const getUserByUsername = (username: string): Promise<User | null> => {
    return new Promise<User | null>((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row: any) => {
            if (err) {
                return reject(err);
            }
            resolve(row ? { id: row.id, username: row.username, password: row.password } : null);
        });
    });
}

export const getProblemById = (id: number): Promise<Problem | null> => {
    return new Promise<Problem | null>((resolve, reject) => {
        db.get('SELECT * FROM problems WHERE id = ?', [id], (err, row: any) => {
            if (err) {
                return reject(err);
            }
            resolve(row ? { id: row.id, title: row.title, description: row.description, solution: row.solution } : null);
        });
    });
}

export const getProblemsByCompetitionId = (competitionId: number): Promise<Problem[]> => {
    return new Promise<Problem[]>((resolve, reject) => {
        db.all(`
            SELECT p.* FROM problems p
            JOIN competition_problems cp ON p.id = cp.problem_id
            WHERE cp.competition_id = ?
        `, [competitionId], (err, rows: any[]) => {
            if (err) {
                return reject(err);
            }
            const problems = rows.map(row => ({
                id: row.id,
                title: row.title,
                description: row.description,
                solution: row.solution
            }));
            resolve(problems);
        });
    });
}

export const getAllProblems = (): Promise<Problem[]> => {
    return new Promise<Problem[]>((resolve, reject) => {
        db.all('SELECT * FROM problems', [], (err, rows: any[]) => {
            if (err) {
                return reject(err);
            }
            const problems = rows.map(row => ({
                id: row.id,
                title: row.title,
                description: row.description,
                solution: row.solution
            }));
            resolve(problems);
        });
    });
}

export const getCompetitionById = (id: number): Promise<Competition | null> => {
    return new Promise<Competition | null>((resolve, reject) => {
        db.get('SELECT * FROM competitions WHERE id = ?', [id], (err, row: any) => {
            if (err) {
                return reject(err);
            }
            resolve(row ? { id: row.id, name: row.name, startTime: new Date(row.start_time), endTime: new Date(row.end_time)} : null);
        });
    });
}

export const getAllCompetitions = (): Promise<Competition[]> => {
    return new Promise<Competition[]>((resolve, reject) => {
        db.all('SELECT * FROM competitions', [], (err, rows: any[]) => {
            if (err) {
                return reject(err);
            }
            const competitions = rows.map(row => ({
                id: row.id,
                name: row.name,
                startTime: new Date(row.start_time),
                endTime: new Date(row.end_time)
            }));
            resolve(competitions);
        });
    });
}

export const getPastCompetitions = (): Promise<Competition[]> => {
    return new Promise<Competition[]>((resolve, reject) => {
        const now = new Date().toISOString();
        db.all('SELECT * FROM competitions WHERE end_time < ?', [now], (err, rows: any[]) => {
            if (err) {
                return reject(err);
            }
            const competitions = rows.map(row => ({
                id: row.id,
                name: row.name,
                startTime: new Date(row.start_time),
                endTime: new Date(row.end_time)
            }));
            resolve(competitions);
        });
    });
}

export const getUpcomingCompetitions = (): Promise<Competition[]> => {
    return new Promise<Competition[]>((resolve, reject) => {
        const now = new Date().toISOString();
        db.all('SELECT * FROM competitions WHERE end_time >= ?', [now], (err, rows: any[]) => {
            if (err) {
                return reject(err);
            }
            const competitions = rows.map(row => ({
                id: row.id,
                name: row.name,
                startTime: new Date(row.start_time),
                endTime: new Date(row.end_time)
            }));
            resolve(competitions);
        });
    });
}

export const getUserProblemStatus = (userId: number, problemId: number): Promise<UserProblemStatus | null> => {
    return new Promise<UserProblemStatus | null>((resolve, reject) => {
        db.get('SELECT * FROM user_problem_status WHERE user_id = ? AND problem_id = ?', [userId, problemId], (err, row: any) => {
            if (err) {
                return reject(err);
            }
            resolve(row ? { user_id: row.user_id, problem_id: row.problem_id, last_attempt: row.last_attempt && new Date(row.last_attempt), solved: !!row.solved } : null);
        });
    });
}

export const getUserToken = (token: string): Promise<UserToken | null> => {
    return new Promise<UserToken | null>((resolve, reject) => {
        db.get('SELECT * FROM user_tokens WHERE token = ?', [token], (err, row: any) => {
            if (err) {
                return reject(err);
            }
            resolve(row ? { token_id: row.token_id, user_id: row.user_id, token: row.token, expires_at: new Date(row.expires_at) } : null);
        });
    });
}

export const createUserProblemStatus = (userId: number, problemId: number): Promise<UserProblemStatus> => {
    return new Promise<UserProblemStatus>((resolve, reject) => {
        db.run('INSERT INTO user_problem_status (user_id, problem_id, last_attempt, solved) VALUES (?, ?, ?, ?)',
            [userId, problemId, null, false],
            function (err) {
                if (err) {
                    return reject(err);
                }
                resolve({ user_id: userId, problem_id: problemId, last_attempt: null, solved: false });
            });
    });
}

export const updateUserProblemStatus = (userProblemStatus: UserProblemStatus): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        db.run('REPLACE INTO user_problem_status (user_id, problem_id, last_attempt, solved) VALUES (?, ?, ?, ?)',
            [userProblemStatus.user_id, userProblemStatus.problem_id, userProblemStatus.last_attempt && userProblemStatus.last_attempt.toISOString(), userProblemStatus.solved ? 1 : 0],
            function (err) {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
    });
}

export const createUserToken = (userId: number, token: string, expiresAt: Date): Promise<UserToken> => {
    return new Promise<UserToken>((resolve, reject) => {
        db.run('INSERT INTO user_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
            [userId, token, expiresAt.toISOString()],
            function (err) {
                if (err) {
                    return reject(err);
                }
                resolve({ token_id: this.lastID, user_id: userId, token, expires_at: expiresAt });
            });
    });
}

export const deleteUserToken = (userId: number): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        db.run('DELETE FROM user_tokens WHERE user_id = ?', [userId], function (err) {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

