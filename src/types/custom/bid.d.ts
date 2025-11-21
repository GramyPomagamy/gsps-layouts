export interface Bid {
  id: number;
  name: string;
  description?: string;
  longDescription?: string;
  total: string;
  rawTotal: number;
  game?: string;
  category?: string;
  runStartTime?: number;
  runEndTime?: number;
  type: 'challenge' | 'choice';
  allowUserOptions: boolean;
  options: {
    id: number;
    parent: number;
    name: string;
    description: string;
    total: string;
    rawTotal: number;
    speedrun: number;
  }[];
  goal?: string;
  rawGoal?: number;
  public: string;
  state?: 'OPEN' | 'CLOSED';
}
