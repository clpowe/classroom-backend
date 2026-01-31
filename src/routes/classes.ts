import express from "express";
import { db } from "../db/index.js";
import { classes } from "../db/schema/index.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const [createClass] = await db.insert(classes).values({
            ...req.body,
            inviteCode: Math.random().toString(36).substring(2, 8),
            schedules: []
        }).returning({ id: classes.id });

        if (!createClass) {
            throw new Error("Failed to create class");
        }

        res.status(201).json({ data: createClass });
    } catch (e) {
        console.error(`POST /classes error: ${e}`);
        res.status(500).json({ error: e });
    }
});

export default router;
