import { BidsArraySchema } from "./tracker/bids";
import { DonationBidsSchema } from "./tracker/donationbids";

export const TrackerSchemas = {
  Bids: BidsArraySchema,
  DonationBids: DonationBidsSchema,
};
