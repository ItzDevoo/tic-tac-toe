import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  games: defineTable({
    gameType: v.union(v.literal("tic-tac-toe"), v.literal("connect-4")),
    gameState: v.any(),
    players: v.array(v.string()), // Storing player identifiers
    status: v.union(
      v.literal("waiting"),
      v.literal("in_progress"),
      v.literal("finished")
    ),
    winner: v.optional(v.string()),
  }),
});
