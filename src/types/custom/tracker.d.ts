export namespace Tracker {
  interface EventInfo {
    id: number;
    short: string;
    total: number;
  }

  // The object from the tracker API.
  interface Prize {
    pk: number;
    model: string;
    fields: {
      name: string;
      description: string; // Can be empty
      shortdescription: string; // Can be empty
      provider: string; // Can be empty
      minimumbid: string;
      image: string; // Can be empty
      startrun: number | null;
      endrun: number | null;
      startrun__starttime?: string;
      endrun__endtime?: string;
      starttime: string | null;
      endtime: string | null;
      state: string;
    };
  }

  interface FormattedPrize {
    id: number;
    name: string;
    provided?: string;
    minimumBid: number;
    image?: string;
    startTime?: number;
    endTime?: number;
  }

  // The object from the tracker API.
  interface Donation {
    pk: number;
    model: string;
    fields: {
      requestedvisibility: string;
      requestedalias: string;
      donor__public: string;
      amount: string;
      comment: string; // Can be empty
      commentstate: string;
      timereceived: string;
    };
  }

  interface FormattedDonation {
    id: number;
    name: string;
    amount: number;
    comment?: string;
    timestamp: number;
    bid?: {
      id?: number;
      amount?: number;
    }[];
  }

  interface DonationBid {
    model: string;
    pk: number;
    fields: {
      bid: number;
      donation: number;
      amount: string;
      public: string;
    };
  }
}
