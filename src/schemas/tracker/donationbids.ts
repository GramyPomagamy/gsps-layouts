import z from "zod";

export const DonationBidsSchema = z
  .object({
    model: z.string(),
    pk: z.number(),
    fields: z.object({
      bid: z.number(),
      donation: z.number(),
      amount: z.string(),
      public: z.string(),
    }),
  })
  .array();
