import { Channel } from 'src/types/custom';

interface ChannelInfo {
  value: Channel;
  name: string;
  color: string;
  backgroundColor: string;
}

export const channels: ChannelInfo[] = [
  {
    value: "",
    name: "(brak)",
    color: "inherit",
    backgroundColor: "transparent",
  },
  {
    value: "H1",
    name: "H1",
    color: "#FFFFFF",
    backgroundColor: "#424242",
  },
  {
    value: "H2",
    name: "H2",
    color: "#212121",
    backgroundColor: "#FAFAFA",
  },
  {
    value: "H3",
    name: "H3",
    color: "#B71C1C",
    backgroundColor: "#FFCDD2",
  },
  {
    value: "H4",
    name: "H4",
    color: "#0D47A1",
    backgroundColor: "#BBDEFB",
  },
  { value: "Host1", name: "Host1", color: "inherit", backgroundColor: "transparent" },
  { value: "Host2", name: "Host2", color: "inherit", backgroundColor: "transparent" },
  { value: "Host3", name: "Host3", color: "inherit", backgroundColor: "transparent" },
  { value: "Donacje", name: "Donacje", color: "inherit", backgroundColor: "transparent" },
  { value: "Gra1", name: "Gra1", color: "inherit", backgroundColor: "transparent" },
  { value: "Gra2", name: "Gra2", color: "inherit", backgroundColor: "transparent" },
];
