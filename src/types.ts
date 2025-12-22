export interface Team {
  id: string;
  name: string;
  score: number;
  color: string;
}

export interface GameState {
  round: number;
  teams: Record<string, Team>;
}
