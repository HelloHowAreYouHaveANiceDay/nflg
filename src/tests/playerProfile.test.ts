import ProfileWrapper from "../apis/nfl/playerProfile/ProfileWrapper";

describe("player profile tests", () => {
  const playerProfile = new ProfileWrapper();
  const player_id = "00-0022803";
  //   let profile: string;
  beforeAll(async () => {});

  test("game", async () => {
    const profile = await playerProfile.getPlayerProfile(player_id);
    console.log(profile);
    expect(profile).toBeInstanceOf(Object);
  });
});
