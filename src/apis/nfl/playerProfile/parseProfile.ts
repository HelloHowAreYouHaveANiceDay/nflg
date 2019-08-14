import cheerio from "cheerio";
import Player from "../../../Entities/Player";
import { feetInchesToInches, profileIdFromUrl } from "../nflPlayer";
import { rawPlayerProfile } from "./rawPlayerProfile";
export function parseProfile(html: string) {
  try {
    const $ = cheerio.load(html);

    const playerNotFoundRedirect = $("#teamRostersSection");
    if (playerNotFoundRedirect.length) {
      return {};
    }

    const profile: rawPlayerProfile = {};

    // number and postion only available to active players
    const numberStrip = $("span.player-number");
    if (numberStrip.length) {
      const number = numberStrip.text().match(/(\d+)/);
      const position = numberStrip.text().match(/([A-Z]+)/);

      if (number) {
        profile.number = +number[0];
      }

      if (position) {
        profile.position = position[0];
      }
    }

    // find and assign player names
    const nameStrip = $("#playerName");

    if (nameStrip.length) {
      const n = nameStrip.attr("content");

      profile.full_name = n;

      const name = n.split(" ");

      if (name) {
        profile.first_name = name[0].trim();
        profile.last_name = name[1].trim();
      }
    }

    // find and assign player_id
    const playerIdMatch = html.match(/(?:GSIS ID: )\W*(\d+\W+\d+)/);
    if (playerIdMatch) {
      profile.player_id = playerIdMatch[1];
    }

    // height
    const heightMatch = html.match(
      /(?:<strong>)(?:Height)(?:<\/strong>)\W\s(\d+\W\d+)/
    );
    if (heightMatch) {
      const h = heightMatch[1];
      profile.height = feetInchesToInches(h);
    }

    // weight
    const weightMatch = html.match(
      /(?:<strong>)(?:Weight)(?:<\/strong>)\W\s(\d+)/
    );
    if (weightMatch) {
      const w = weightMatch[1];
      profile.weight = +w;
    }

    // birthdate
    const birthStrip = html.match(
      /(?:<strong>)(?:Born)(?:<\/strong>)\W+\s+(\d{1,2}\/\d{1,2}\/\d{4})\s+(\b[a-zA-Z\s]+,[ ]?[A-Z]{2}\b)/
    );

    if (birthStrip) {
      profile.birthdate = birthStrip[1];
      profile.birthcity = birthStrip[2];
    }

    const collegeStrip = html.match(
      /(?:<strong>)(?:College)(?:<\/strong>)\W\s+([\w-\s]+)/
    );
    if (collegeStrip) {
      profile.college = collegeStrip[1];
    }

    const playerId = $("#playerId").attr("content");

    const url = $("link[rel=canonical]").attr("href");
    if (url.length) {
      profile.profile_url = url;
      profile.profile_id = profileIdFromUrl(url);
    }

    return profile;
  } catch (error) {
    throw error;
  }
}
