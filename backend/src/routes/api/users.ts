import express, { Request, Response } from "express";
import { createUserToken, getUserByUsername } from "../../db/db-utils";

const router = express.Router();

/*
 * GET /api/users/login
 * Authenticate user and return a token
 */
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  try {
    const user = await getUserByUsername(username);
    if (!user || user.password !== password) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // Create a new token for the user

    // Generate random token string
    let tokenString = '';

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 64; i++) {
      tokenString += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    const cookieDurationMs = 1 * 60 * 60 * 1000; // 1 hour

    const token = await createUserToken(user.id, tokenString, new Date(Date.now() + cookieDurationMs)); // Token valid for 1 hour
    
    // Set token in HttpOnly cookie
    res.cookie('token', token.token, { httpOnly: true, maxAge: cookieDurationMs }); // 1 hour

    res.json({ message: 'Login successful', userId: user.id, token: token.token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error });
  }
});


export default router;
