import express, { Request, Response } from "express";
import type { User } from "../../types/types.js";

const router = express.Router();

/*
 * GET /api/users
 * Checks if a user with the given email exists.
 * Expects a query parameter `email`.
 */
router.get("/", async (req: Request, res: Response) => {
  // const { email } = req.query;
  res.status(501).json({ error: "Not implemented" });

});

/*
 * POST /api/users
 * Creates a new user with the provided details.
 * Expects a JSON body with `email`, `nick`, `yearLevel`, and `preferredLanguage`.
 */
router.post(
  "/",
  async (req: Request<unknown, unknown, User>, res: Response) => {
    // const { email, nick, yearLevel, preferredLanguage } = req.body;
    res.status(501).json({ error: "Not implemented" });
  },
);

/*
 * GET /api/users/details
 * Returns user details for the given email.
 * Expects a query parameter `email`.
 */
router.get("/details", async (req: Request, res: Response) => {
  // const { email } = req.query;
  res.status(501).json({ error: "Not implemented" });
});

router.get("/preferred-language", async (req: Request, res: Response) => {
  // const { email } = req.query;
  res.status(501).json({ error: "Not implemented" });
});

export default router;
