import { Channel } from 'src/types/custom';

interface ChannelInfo {
  value: Channel;
  name: string;
  color: string;
  backgroundColor: string;
}

const defaultValues = {
  color: "inherit",
  backgroundColor: "transparent",
};

export const channels: ChannelInfo[] = [
  {
    value: "",
    name: "(brak)",
    ...defaultValues,
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
  { value: "Host1", name: "Host1", ...defaultValues },
  { value: "Host2", name: "Host2", ...defaultValues },
  { value: "Host3", name: "Host3", ...defaultValues },
  { value: "Donacje", name: "Donacje", ...defaultValues },
  { value: "Gra1", name: "Gra1", ...defaultValues },
  { value: "Gra2", name: "Gra2", ...defaultValues },
];
