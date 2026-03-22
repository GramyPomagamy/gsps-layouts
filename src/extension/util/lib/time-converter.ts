export default class TimeConverter {
  private static calc(m: number): (n: number) => number {
    return (n: number) => Math.round(n * m);
  }

  static seconds = TimeConverter.calc(1e3);
  static minutes = TimeConverter.calc(6e4);
  static hours = TimeConverter.calc(36e5);
  static days = TimeConverter.calc(864e5);
  static weeks = TimeConverter.calc(6048e5);
  static months = TimeConverter.calc(26298e5);
  static years = TimeConverter.calc(315576e5);
}
