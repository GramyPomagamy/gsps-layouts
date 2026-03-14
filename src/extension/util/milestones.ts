import {
  type Milestones as MilestonesTypes,
  type RawMilestone,
} from "@gsps-layouts/types";
import axios from "axios";

type MilestonesRequestReturnType = {
  data: RawMilestone[];
};

export class Milestones {
  private readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  public async getMilestones(): Promise<MilestonesTypes> {
    const rawMilestones = await axios.get<MilestonesRequestReturnType>(
      this.url,
    );

    if (rawMilestones.status !== 200) {
      throw new Error("Failed to download milestones");
    }

    return this.processMilestones(rawMilestones.data);
  }

  private processMilestones(
    milestones: MilestonesRequestReturnType,
  ): MilestonesTypes {
    return milestones.data
      .sort((a: RawMilestone, b: RawMilestone) => {
        return parseInt(a.Kwota) - parseInt(b.Kwota);
      })
      .map((milestone) => ({
        name: milestone.Nazwa,
        amount: parseInt(milestone.Kwota),
      }));
  }
}
