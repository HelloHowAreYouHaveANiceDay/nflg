export default interface NFLScheduleWeekParams {
  year: number;
  type: "REG" | "PRE" | "POST";

  week: number;
}
