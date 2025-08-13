import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// A helper function to get the initial state for a new game
const getInitialState = (gameType: "tic-tac-toe" | "connect-4") => {
  if (gameType === "tic-tac-toe") {
    return {
      board: Array(3).fill(null).map(() => Array(3).fill(null)),
      turn: "X",
    };
  }
  // Placeholder for other games
  throw new Error(`Unknown game type: ${gameType}`);
};

import { handleTicTacToeMove } from "./tic-tac-toe";

export const createGame = mutation({
  args: {
    gameType: v.union(v.literal("tic-tac-toe"), v.literal("connect-4")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to create a game.");
    }
    const playerId = identity.subject;

    const newGame = {
      gameType: args.gameType,
      gameState: getInitialState(args.gameType),
      players: [playerId],
      status: "waiting" as const,
    };

    const gameId = await ctx.db.insert("games", newGame);
    return gameId;
  },
});

export const joinGame = mutation({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to join a game.");
    }
    const playerId = identity.subject;

    const game = await ctx.db.get(args.gameId);
    if (!game) {
      throw new Error("Game not found.");
    }

    if (game.players.length >= 2) {
      throw new Error("Game is already full.");
    }

    if (game.players.includes(playerId)) {
      // Player is already in the game, do nothing.
      return;
    }

    await ctx.db.patch(args.gameId, {
      players: [...game.players, playerId],
      status: "in_progress",
    });
  },
});

export const makeMove = mutation({
  args: {
    gameId: v.id("games"),
    move: v.any(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to make a move.");
    }
    const playerId = identity.subject;

    const game = await ctx.db.get(args.gameId);
    if (!game) {
      throw new Error("Game not found.");
    }

    if (game.status !== "in_progress") {
      throw new Error("Game is not in progress.");
    }

    const playerIndex = game.players.indexOf(playerId);
    if (playerIndex === -1) {
      throw new Error("You are not a player in this game.");
    }
    const playerSymbol = playerIndex === 0 ? "X" : "O";

    if (game.gameType === "tic-tac-toe") {
      const { newGameState, newStatus, winner } = handleTicTacToeMove(
        game.gameState,
        args.move,
        playerSymbol
      );

      let winnerId = null;
      if (winner) {
        if (winner === "Tie") {
          winnerId = "Tie";
        } else {
          winnerId = game.players[winner === "X" ? 0 : 1];
        }
      }

      await ctx.db.patch(args.gameId, {
        gameState: newGameState,
        status: newStatus,
        winner: winnerId,
      });
    } else {
      throw new Error(`Unhandled game type: ${game.gameType}`);
    }
  },
});

export const get = query({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.gameId);
  },
});

export const getWaitingGames = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("games")
      .filter((q) => q.eq(q.field("status"), "waiting"))
      .collect();
  },
});
