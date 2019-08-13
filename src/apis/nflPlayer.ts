import cheerio from "cheerio";
import Player from "../Entities/Player";

export function parseProfile(html: string): Player {
  try {
    const $ = cheerio.load(html);
    // number and postiion only available to active players
    const numberStrip = $("span.player-number").text();
    // const playerInfo = $('div.player-info').children()
    const nameStrip = $("#playerName").attr("content");
    const playerId = $("#playerId").attr("content");
    let team = $("#playerTeam").attr("content");
    const url = $("link[rel=canonical]").attr("href");
    // const physicalRow = playerInfo.filter((i, e) => i == 2);
    // regex seems to be the easiest way to get at these specific pieces of data.

    // const gsisId = html.match(/(?:GSIS ID: )\W*(\d+\W+\d+)/)[1];
    const heightMatch = html.match(
      /(?:<strong>)(?:Height)(?:<\/strong>)\W\s(\d+\W\d+)/
    );
    const heightStrip = heightMatch ? heightMatch[1] : null;

    const weightMatch = html.match(
      /(?:<strong>)(?:Weight)(?:<\/strong>)\W\s(\d+)/
    );
    const weightStrip = weightMatch ? weightMatch[1] : null;
    // const ageStrip = html.match(/(?:<strong>)(?:Age)(?:<\/strong>)\W\s(\d+)/)![1];
    const birthStrip = html.match(
      /(?:<strong>)(?:Born)(?:<\/strong>)\W+\s+(\d{1,2}\/\d{1,2}\/\d{4})\s+(\b[a-zA-Z\s]+,[ ]?[A-Z]{2}\b)/
    );
    const collegeStrip = html.match(
      /(?:<strong>)(?:College)(?:<\/strong>)\W\s+([\w-\s]+)/
    );

    // console.log(numberStrip);
    let number = 0;
    let position = "";

    // TODO: a lot of redundancy here.
    const first_name = nameStrip.split(" ")[0].trim();
    const last_name = nameStrip.split(" ")[1].trim();
    const full_name = `${first_name} ${last_name}`;

    let birthDate = "";
    let birthCity = "";
    if (birthStrip != null) {
      birthDate = birthStrip![1];
      birthCity = birthStrip![2];
    }

    let weight = 0;
    if (weightStrip != null) {
      weight = +weightStrip;
    }
    let college = "";
    if (collegeStrip) {
      college = collegeStrip[1];
    }
    // const age = +ageStrip;

    let height = 0;
    if (heightStrip != null) {
      height = feetInchesToInches(heightStrip);
    }

    if (numberStrip == null) {
      team = "";
    } else {
      const numberPresent = numberStrip.match(/(\d+)/);
      const positionPresent = numberStrip.match(/([A-Z]+)/);
      if (numberPresent != null && positionPresent != null) {
        number = +numberStrip.match(/(\d+)/)![0];
        position = numberStrip.match(/([A-Z]+)/)![0];
      }
    }

    return {
      full_name,
      player_id: "",
      first_name,
      gsisId: playerId,
      last_name,
      birthcity: birthCity,
      birthdate: birthDate,
      college,
      profile_url: url,
      profile_id: profileIdFromUrl(url),
      number,
      position,
      weight,
      height
    };
  } catch (error) {
    throw error;
  }
}

function profileIdFromUrl(url: string) {
  return url.match(/([0-9]+)/)![0];
}

function feetInchesToInches(height: string) {
  const [feet, inches] = height.split("-");
  return 12 * +feet + +inches;
}
