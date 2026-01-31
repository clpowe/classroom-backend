import express from "express";
import { eq, ilike, or, and, desc, sql, getTableColumns } from "drizzle-orm";

import { user, roleEnum } from "../db/schema/auth.js";
import { db } from "../db/index.js";

const router = express.Router();

// Get all users with optional search, role filter, and pagination
router.get("/", async (req, res) => {
    try {
        const { search, role, page = 1, limit = 10 } = req.query;

        const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
        const limitPerPage = Math.min(
            Math.max(1, parseInt(String(limit), 10) || 10),
            100,
        );

        const offset = (currentPage - 1) * limitPerPage;

        const filterConditions = [];

        // If search query exists, filter by name or email
        if (search) {
            filterConditions.push(
                or(
                    ilike(user.name, `%${search}%`),
                    ilike(user.email, `%${search}%`),
                ),
            );
        }

        // If role query exists, filter by role (exact match)
        if (role) {
            // @ts-ignore - Validating role against enum values if strict type checking was needed, but Drizzle handles types well
            filterConditions.push(eq(user.role, role));
        }

        // Combine all filters using AND if any exist
        const whereClause =
            filterConditions.length > 0 ? and(...filterConditions) : undefined;

        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(user)
            .where(whereClause);

        const totalCount = countResult[0]?.count ?? 0;

        const usersList = await db
            .select({
                ...getTableColumns(user),
            })
            .from(user)
            .where(whereClause)
            .orderBy(desc(user.createdAt))
            .limit(limitPerPage)
            .offset(offset);

        res.status(200).json({
            data: usersList,
            pagination: {
                page: currentPage,
                limit: limitPerPage,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limitPerPage),
            },
        });
    } catch (e) {
        console.error(`GET /users error: ${e}`);
        res.status(500).json({ error: "Failed to get users" });
    }
});

export default router;
