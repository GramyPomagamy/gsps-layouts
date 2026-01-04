import {
  type Milestones as MilestonesTypes,
  type RawMilestone,
} from "@gsps-layouts/types";
import axios from "axios";

export class Milestones {
  private readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  public async getMilestones(): Promise<MilestonesTypes> {
    const rawMilestones = await axios.get<RawMilestone[]>(this.url);

    if (rawMilestones.status !== 200) {
      throw new Error("Failed to download milestones");
    }

    return this.processMilestones(rawMilestones.data);
  }

  private processMilestones(milestones: RawMilestone[]): MilestonesTypes {
    return milestones
      .sort((a: RawMilestone, b: RawMilestone) => {
        return a.Kwota - b.Kwota;
      })
      .map((milestone) => ({
        name: milestone.Nazwa,
        amount: milestone.Kwota,
      }));
  }
}
