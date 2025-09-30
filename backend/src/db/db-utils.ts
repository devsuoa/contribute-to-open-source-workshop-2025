// Import sqlite3
import sqlite3 from 'sqlite3';
import { User, Problem, Competition, UserProblemStatus, UserToken, CompetitionUserStatus, Submission } from '../types/types';

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

export const getCompetitionById = async (id: number): Promise<Competition | null> => {
    return new Promise<Competition | null>((resolve, reject) => {
        db.get('SELECT * FROM competitions WHERE id = ?', [id], async (err, row: any) => {
            if (err) {
                return reject(err);
            }
            if (!row) return resolve(null);
            try {
                const problems = await getProblemsByCompetitionId(id);
                resolve({
                    id: row.id,
                    name: row.name,
                    startTime: new Date(row.start_time),
                    endTime: new Date(row.end_time),
                    problems
                });
            } catch (err2) {
                reject(err2);
            }
        });
    });
};

export const getAllCompetitions = (): Promise<Competition[]> => {
    return new Promise<Competition[]>(async (resolve, reject) => {
        db.all('SELECT * FROM competitions', [], async (err, rows: any[]) => {
            if (err) {
                return reject(err);
            }
            try {
                const competitions = await Promise.all(rows.map(async row => ({
                    id: row.id,
                    name: row.name,
                    startTime: new Date(row.start_time),
                    endTime: new Date(row.end_time),
                    problems: await getProblemsByCompetitionId(row.id)
                })));
                resolve(competitions);
            } catch (err2) {
                reject(err2);
            }
        });
    });
}

export const getPastCompetitions = (): Promise<Competition[]> => {
    return new Promise<Competition[]>(async (resolve, reject) => {
        const now = new Date();
        db.all('SELECT * FROM competitions WHERE end_time < ?', [now], async (err, rows: any[]) => {
            if (err) {
                return reject(err);
            }
            try {
                const competitions = await Promise.all(rows.map(async row => ({
                    id: row.id,
                    name: row.name,
                    startTime: new Date(row.start_time),
                    endTime: new Date(row.end_time),
                    problems: await getProblemsByCompetitionId(row.id)
                })));
                resolve(competitions);
            } catch (err2) {
                reject(err2);
            }
        });
    });
}

export const getUpcomingCompetitions = (): Promise<Competition[]> => {
    return new Promise<Competition[]>(async (resolve, reject) => {
        const now = new Date();
        db.all('SELECT * FROM competitions WHERE end_time >= ?', [now], async (err, rows: any[]) => {
            if (err) {
                return reject(err);
            }
            try {
                const competitions = await Promise.all(rows.map(async row => ({
                    id: row.id,
                    name: row.name,
                    startTime: new Date(row.start_time),
                    endTime: new Date(row.end_time),
                    problems: await getProblemsByCompetitionId(row.id)
                })));
                resolve(competitions);
            } catch (err2) {
                reject(err2);
            }
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

export const getUserCompetitionStatus = (userId: number, competitionId: number): Promise<CompetitionUserStatus | null> => {
    return new Promise<CompetitionUserStatus | null>((resolve, reject) => {
        db.get('SELECT * FROM competition_user_status WHERE user_id = ? AND competition_id = ?', [userId, competitionId], (err, row: any) => {
            if (err) {
                return reject(err);
            }
            if (!row) {
                return resolve(null);
            }
            resolve({
                competition_id: row.competition_id,
                user_id: row.user_id,
                points: row.points,
            });
        });
    });
}

export const createUserCompetitionStatus = (userId: number, competitionId: number): Promise<CompetitionUserStatus> => {
    return new Promise<CompetitionUserStatus>((resolve, reject) => {
        db.run('INSERT INTO competition_user_status (user_id, competition_id, points) VALUES (?, ?, ?)', [userId, competitionId, 0],
            function (err) {
                if (err) {
                    return reject(err);
                }
                resolve({ competition_id: competitionId, user_id: userId, points: 0 });
            });
    });
}

export const updateUserCompetitionStatus = (competitionUserStatus: CompetitionUserStatus): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        db.run('REPLACE INTO competition_user_status (user_id, competition_id, points) VALUES (?, ?, ?)',
            [competitionUserStatus.user_id, competitionUserStatus.competition_id, competitionUserStatus.points],
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

export const createSubmission = (submission: Submission): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        db.run('INSERT INTO submissions (competition_id, problem_id, user_id, content, submitted_at, verdict) VALUES (?, ?, ?, ?, ?, ?)',
            [submission.competition_id, submission.problem_id, submission.user_id, submission.content, submission.submitted_at, submission.verdict],
            function (err) {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
    });
}

export const getSubmissions = (competitionId: number, problemId: number, userId: number): Promise<Submission[]> => {
    return new Promise<Submission[]>((resolve, reject) => {
        db.all('SELECT * FROM submissions WHERE competition_id = ? AND problem_id = ? AND user_id = ? ORDER BY submitted_at DESC LIMIT 5',
            [competitionId, problemId, userId],
            (err, rows: any[]) => {
                if (err) {
                    return reject(err);
                }
                const submissions = rows.map(row => ({
                    competition_id: row.competition_id,
                    problem_id: row.problem_id,
                    user_id: row.user_id,
                    content: row.content,
                    submitted_at: new Date(row.submitted_at),
                    verdict: row.verdict
                }));
                resolve(submissions);
            });
    });
}