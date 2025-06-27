import express, { Request, Response } from "express";
import UserModel from "../../db/user-schema.js";
import type { User } from "../../types/types.js";

const router = express.Router();

/*
 * GET /api/users
 * Checks if a user with the given email exists.
 * Expects a query parameter `email`.
 */
router.get("/", async (req: Request, res: Response) => {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    res.status(400).json({ error: "Missing or invalid email" });
    return;
  }

  try {
    const user = await UserModel.findOne({ email });
    res.json({ exists: !!user });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/*
 * POST /api/users
 * Creates a new user with the provided details.
 * Expects a JSON body with `email`, `nick`, `yearLevel`, and `preferredLanguage`.
 */
router.post(
  "/",
  async (req: Request<unknown, unknown, User>, res: Response) => {
    const { email, nick, yearLevel, preferredLanguage } = req.body;

    if (!email || !nick || !yearLevel || !preferredLanguage) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    try {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        res.status(400).json({ error: "User already exists" });
        return;
      }

      const newUser = new UserModel({
        email,
        nick,
        yearLevel,
        preferredLanguage,
      });

      await newUser.save();
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

/*
 * GET /api/users/details
 * Returns user details for the given email.
 * Expects a query parameter `email`.
 */
router.get("/details", async (req: Request, res: Response) => {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    res.status(400).json({ error: "Missing or invalid email" });
    return;
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      nick: user.nick,
      yearLevel: user.yearLevel,
      preferredLanguage: user.preferredLanguage,
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/preferred-language", async (req: Request, res: Response) => {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    res.status(400).json({ error: "Missing or invalid email" });
    return;
  }

  try {
    const user = await UserModel.findOne({ email })
      .select("preferredLanguage -_id")
      .lean();

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ preferredLanguage: user.preferredLanguage });
  } catch (err) {
    console.error("Error fetching preferred language:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
