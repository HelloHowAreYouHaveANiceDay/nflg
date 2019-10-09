import { Result } from "../../../core/Result";
import R from "ramda";

type seasonType = "REG" | "PRE" | "POST";

export class NFLWeek {
  public year: number;
  public type: seasonType;

  public week: number;

  constructor(year: number, type: seasonType, week: number) {
    this.year = year;
    this.type = type;
    this.week = week;
    return this;
  }

  getValue() {
    return {
      year: this.year,
      type: this.type,
      week: this.week
    };
  }

  static equals(a: NFLWeek, b: NFLWeek) {
    const sameWeek = a.week === b.week;
    const sameYear = a.year === b.year;
    const sameType = a.type === b.type;
    const isEq = [sameWeek, sameYear, sameType].every(t => t);
    return isEq;
  }

  isValid = () => {
    return [
      isValidYear(this.year),
      isValidSeasonType(this.type),
      isValidWeek(this.type, this.week)
    ].every(b => b);
  };

  isEqualTo = (b: NFLWeek) => {
    return NFLWeek.equals(this, b);
  };
}

export class NFLWeekConstructor {
  static NFLWeekFromParams(year: number, stype: string, week: number): NFLWeek {
    return new NFLWeek(year, stype as seasonType, week);
  }

  static NFLWeekFromParamsC = (year: number) => (stype: string) => (
    week: number
  ) => {
    return new NFLWeek(year, stype as seasonType, week);
  };

  static NFLWeeksFromYear(year: number): NFLWeek[] {
    const weeks: NFLWeek[] = [];
    R.range(1, 5).forEach(w => {
      weeks.push(this.NFLWeekFromParams(year, "PRE", w));
    });
    R.range(1, 18).forEach(w => {
      weeks.push(this.NFLWeekFromParams(year, "REG", w));
    });
    R.range(18, 21).forEach(w => {
      weeks.push(this.NFLWeekFromParams(year, "POST", w));
    });
    weeks.push(this.NFLWeekFromParams(year, "POST", 22));
    return weeks.filter(w => w.isValid());
  }
}

function isValidYear(year: number): boolean {
  if (year < 2009) {
    return false;
    // throw new Error("year cannot be before 2009");
  }
  return true;
}

function isValidSeasonType(stype: string): boolean {
  if (stype === "PRE" || stype === "REG" || stype === "POST") {
    return true;
  }
  // throw new Error("season type must be one of PRE, REG, POST");
  return false;
}

function isValidWeek(stype: string, week: number): boolean {
  if (stype === "PRE") {
    if (week >= 1 && week <= 4) {
      return true;
    }
    // throw new Error("week out of range for PREseason games");
    return false;
  } else if (stype === "REG") {
    if (week >= 1 && week <= 17) {
      return true;
    }
    // throw new Error("week out of range for REGseason games");
    return false;
  } else if (stype === "POST") {
    if ((week >= 18 && week <= 20) || week === 22) {
      return true;
    }
    return false;
    // throw new Error("week out of range for POSTseason games");
  } else {
    // throw new Error("invalid season type");
    return false;
  }
}
