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
  type: string;
  allowUserOptions: boolean;
  options: {
    id: number;
    parent: number;
    name: string;
    total: string;
    rawTotal: number;
    speedrun: number;
  }[];
  goal?: number;
  public: string;
}
