import express from "express";
import piston from "./piston.js";
import users from "./users.js";
import competitions from "./competitions.js";
import problems from "./problems.js";

const router = express.Router();

router.use("/piston", piston);
router.use("/users", users);
router.use("/competitions", competitions);
router.use("/problems", problems);

export default router;
