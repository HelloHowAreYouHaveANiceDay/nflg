import { EspnFFLSettings, EspnFFLMember } from "./espnLeagueSettings";
import EspnFantasyTeam from "../../Entities/EspnFantasyTeam";
import _ from "lodash";

export function parseTeamsFromSettings(settings: EspnFFLSettings) {
  try {
    const rawOwners = settings.members;
    const rawTeams = settings.teams;
    const owners = rawOwners.map(parseOwner);
    const parse = parseTeam(owners);
    const teams = rawTeams.map(parse);
    return teams;
  } catch (error) {
    throw error;
  }
}

const parseTeam = (ownerTeams: OwnerTeam[]) => (fantasyTeam: any) => {
  //@ts-ignore
  const t: EspnFantasyTeam = {};

  const owner = _.find(
    ownerTeams,
    team => team.id === fantasyTeam.primaryOwner
  );

  if (!owner) {
    throw new Error("owner not found");
  }

  t.owner_name = owner.name;
  t.owner_id = owner.id;
  t.owner_nickname = owner.display_name;

  t.abbrev = fantasyTeam.abbrev;
  t.fantasy_team_id = fantasyTeam.id;
  t.projected_rank = fantasyTeam.currentProjectedRank;
  t.logo = fantasyTeam.logo;
  t.name = `${fantasyTeam.location} ${fantasyTeam.nickname}`;
  // primary owner handler
  t.playoff_seed = fantasyTeam.playoffSeed;
  t.points = fantasyTeam.points;
  t.points_adjusted = fantasyTeam.pointsAdjusted;
  t.points_delta = fantasyTeam.pointsDelta;

  t.record_away_gb = fantasyTeam.record.away.gamesBack;
  t.record_away_losses = fantasyTeam.record.away.losses;
  t.record_away_pct = fantasyTeam.record.away.percentage;
  t.record_away_pa = fantasyTeam.record.away.pointsAgainst;
  t.record_away_pf = fantasyTeam.record.away.pointsFor;
  t.record_away_streak_len = fantasyTeam.record.away.streakLength;
  t.record_away_streak_typ = fantasyTeam.record.away.streakType;
  t.record_away_ties = fantasyTeam.record.away.ties;
  t.record_away_wins = fantasyTeam.record.away.wins;

  t.record_division_gb = fantasyTeam.record.division.gamesBack;
  t.record_division_losses = fantasyTeam.record.division.losses;
  t.record_division_pct = fantasyTeam.record.division.percentage;
  t.record_division_pa = fantasyTeam.record.division.pointsAgainst;
  t.record_division_pf = fantasyTeam.record.division.pointsFor;
  t.record_division_streak_len = fantasyTeam.record.division.streakLength;
  t.record_division_streak_typ = fantasyTeam.record.division.streakType;
  t.record_division_ties = fantasyTeam.record.division.ties;
  t.record_division_wins = fantasyTeam.record.division.wins;

  t.record_home_gb = fantasyTeam.record.home.gamesBack;
  t.record_home_losses = fantasyTeam.record.home.losses;
  t.record_home_pct = fantasyTeam.record.home.percentage;
  t.record_home_pa = fantasyTeam.record.home.pointsAgainst;
  t.record_home_pf = fantasyTeam.record.home.pointsFor;
  t.record_home_streak_len = fantasyTeam.record.home.streakLength;
  t.record_home_streak_typ = fantasyTeam.record.home.streakType;
  t.record_home_ties = fantasyTeam.record.home.ties;
  t.record_home_wins = fantasyTeam.record.home.wins;

  t.record_overall_gb = fantasyTeam.record.overall.gamesBack;
  t.record_overall_losses = fantasyTeam.record.overall.losses;
  t.record_overall_pct = fantasyTeam.record.overall.percentage;
  t.record_overall_pa = fantasyTeam.record.overall.pointsAgainst;
  t.record_overall_pf = fantasyTeam.record.overall.pointsFor;
  t.record_overall_streak_len = fantasyTeam.record.overall.streakLength;
  t.record_overall_streak_typ = fantasyTeam.record.overall.streakType;
  t.record_overall_ties = fantasyTeam.record.overall.ties;
  t.record_overall_wins = fantasyTeam.record.overall.wins;

  return t;
};

interface OwnerTeam {
  display_name: string;
  id: string;

  name: string;
}

function parseOwner(member: EspnFFLMember) {
  const o: OwnerTeam = {
    display_name: member.displayName,
    id: member.id,
    name: `${member.firstName} ${member.lastName}`
  };

  return o;
}
