export interface formattedBid {
    id: number;
    name: string;
    description: string;
    total: string;
    rawTotal: number;
    state: string;
    speedrun: string;
    speedrunEndtime: number;
    public: string;
    isBitsChallenge: boolean;
    options?: Option[];
    type: string;
    goalMet?: boolean;
    goal?: string;
    rawGoal?: number;
}

interface Option {
    id: number;
    parent: number;
    name: string;
    description: string;
    speedrun: number;
    total: string;
    rawTotal: number;
}
