"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TicTacToeProps {
  game: Doc<"games">;
}

export default function TicTacToe({ game }: TicTacToeProps) {
  const makeMove = useMutation(api.games.makeMove);

  const handleCellClick = (row: number, col: number) => {
    if (game.status === "in_progress") {
      makeMove({ gameId: game._id, move: { row, col } });
    }
  };

  const getStatusMessage = () => {
    if (game.status === "waiting") {
      return "Waiting for another player to join...";
    }
    if (game.status === "finished") {
      if (game.winner === "Tie") return "It's a tie!";
      // This part needs the user's ID to be personalized
      return `Player ${game.winner?.substring(0,6)}... wins!`;
    }
    // This part also needs the user's ID
    return `It's ${game.gameState.turn}'s turn.`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tic-Tac-Toe</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <p className="text-lg font-semibold">{getStatusMessage()}</p>
        <div className="grid grid-cols-3 gap-2">
          {game.gameState.board.map((row: (string | null)[], rowIndex: number) =>
            row.map((cell: string | null, colIndex: number) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-md flex items-center justify-center text-4xl font-bold cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
