"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import TicTacToe from "@/components/TicTacToe";

interface GamePageProps {
  params: { gameId: string };
}

export default function GamePage({ params }: GamePageProps) {
  const game = useQuery(api.games.get, { gameId: params.gameId as Id<"games"> });

  const renderGame = () => {
    if (!game) {
      return <div>Loading game...</div>;
    }
    if (game.gameType === "tic-tac-toe") {
      return <TicTacToe game={game} />;
    }
    return <div>Unknown game type</div>;
  };

  return (
    <div className="min-h-screen p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Game Spot</h1>
        {/* User button can go here if needed */}
      </header>
      <main>
        {renderGame()}
      </main>
    </div>
  );
}
