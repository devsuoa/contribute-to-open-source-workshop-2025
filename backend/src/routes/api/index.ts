import express from "express";
import users from "./users.js";
import competitions from "./competitions.js";
import problems from "./problems.js";
import competitionUser from "./competition-user.js";
import submissions from "./submissions.js";

const router = express.Router();

router.use("/users", users);
router.use("/competitions", competitions);
router.use("/competitions", competitionUser);
router.use("/problems", problems);
router.use("/submissions", submissions);

export default router;
