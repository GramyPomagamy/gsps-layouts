import { DateTime } from "luxon";
import { z } from "zod";

const money = z
  .string()
  .nullable()
  .transform((val) => (val === null ? null : parseFloat(val)));
const toLuxon = z.string().transform((s) => DateTime.fromISO(s).toMillis());
const toSeconds = z.string().transform((str, ctx) => {
  const parts = str.split(":");
  if (parts.length !== 3) {
    ctx.addIssue({
      code: "custom",
      message: "Invalid time format, expected HH:MM:SS",
    });
    return z.NEVER;
  }

  const [hoursStr, minutesStr, secondsStr] = parts;
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  const seconds = Number(secondsStr);

  if ([hours, minutes, seconds].some((value) => Number.isNaN(value))) {
    ctx.addIssue({
      code: "custom",
      message: "Invalid time format, expected HH:MM:SS",
    });
    return z.NEVER;
  }

  return hours * 3600 + minutes * 60 + seconds;
});

export const BidFieldsSchema = z.object({
  event: z.number(),
  speedrun: z.number(),
  parent: z.number().nullable(),
  name: z.string(),
  state: z.string(),
  description: z.string(),
  shortdescription: z.string(),
  goal: money,
  istarget: z.boolean(),
  allowuseroptions: z.boolean(),
  revealedtime: toLuxon,
  biddependency: z.unknown().nullable(),
  total: money,
  count: z.number(),
  lft: z.number(),
  rght: z.number(),
  tree_id: z.number(),
  level: z.number(),
  public: z.string(),

  speedrun__name: z.string(),
  speedrun__display_name: z.string(),
  speedrun__deprecated_runners: z.string(),
  speedrun__console: z.string(),
  speedrun__description: z.string(),
  speedrun__starttime: toLuxon,
  speedrun__endtime: toLuxon,
  speedrun__order: z.number(),
  speedrun__run_time: toSeconds,
  speedrun__setup_time: toSeconds,
  speedrun__category: z.string(),
  speedrun__public: z.string(),

  event__short: z.string(),
  event__name: z.string(),
  event__receivername: z.string(),
  event__targetamount: money,
  event__minimumdonation: money,
  event__usepaypalsandbox: z.boolean(),
  event__paypalemail: z.string(),
  event__paypalcurrency: z.string(),
  event__datetime: toLuxon,
  event__timezone: z.string(),
  event__locked: z.boolean(),
  event__public: z.string(),

  parent__name: z.string().optional(),
  parent__state: z.string().optional(),
  parent__description: z.string().optional(),
  parent__shortdescription: z.string().optional(),
  parent__goal: money.optional(),
  parent__istarget: z.boolean().optional(),
  parent__allowuseroptions: z.boolean().optional(),
  parent__revealedtime: toLuxon.optional(),
  parent__total: money.optional(),
  parent__count: z.number().optional(),
  parent__lft: z.number().optional(),
  parent__rght: z.number().optional(),
  parent__level: z.number().optional(),
  parent__public: z.string().optional(),
});

export const BidSchema = z.object({
  model: z.string(),
  pk: z.number(),
  fields: BidFieldsSchema,
});

export const BidsArraySchema = z.array(BidSchema);
