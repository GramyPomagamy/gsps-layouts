export type PlayerType = {
  name: string;
  id: string;
  teamID: string;
  country?: string;
  pronouns?: string;
  social: {
    twitch?: string;
  };
  customData: {
    [k: string]: string;
  };
};
