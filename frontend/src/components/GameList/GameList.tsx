import { GameCard } from '../GameCard/GameCard';
import type { Game } from '@/types/api';
import './GameList.css';

interface GameListProps {
  games: Game[];
  title?: string;
}

export const GameList = ({ games, title }: GameListProps) => {
  if (games.length === 0) {
    return (
      <div className="game-list-empty">
        <p>No games found</p>
      </div>
    );
  }

  return (
    <div className="game-list-wrapper">
      {title && <h2 className="game-list-title">{title}</h2>}
      <div className="game-list">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
};
