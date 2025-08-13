"use client";

interface GamePageProps {
  params: { gameId: string };
}

export default function GamePage({ params }: GamePageProps) {
  return (
    <div className="min-h-screen p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Game Page (Debug)</h1>
      </header>
      <main>
        <p>Attempting to display game with ID:</p>
        <p className="font-mono bg-gray-200 p-2 rounded mt-2">{params.gameId}</p>
      </main>
    </div>
  );
}
