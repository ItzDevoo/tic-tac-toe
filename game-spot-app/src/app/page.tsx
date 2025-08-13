"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const waitingGames = useQuery(api.games.getWaitingGames);
  const createGame = useMutation(api.games.createGame);
  const joinGame = useMutation(api.games.joinGame);

  const handleCreateGame = async () => {
    const gameId = await createGame({ gameType: "tic-tac-toe" });
    router.push(`/games/${gameId}`);
  };

  const handleJoinGame = async (gameId: string) => {
    await joinGame({ gameId });
    router.push(`/games/${gameId}`);
  };

  return (
    <div className="min-h-screen p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">The Game Spot</h1>
        <UserButton afterSignOutUrl="/" />
      </header>
      <main>
        <div className="mb-8">
          <Button onClick={handleCreateGame}>Create New Tic-Tac-Toe Game</Button>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Join a Game</h2>
          {waitingGames ? (
            waitingGames.length > 0 ? (
              <ul className="space-y-2">
                {waitingGames.map((game) => (
                  <li key={game._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <span>Game created by Player {game.players[0].substring(0, 6)}...</span>
                    <Button variant="secondary" onClick={() => handleJoinGame(game._id)}>
                      Join Game
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No games waiting. Create one!</p>
            )
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </main>
    </div>
  );
}
