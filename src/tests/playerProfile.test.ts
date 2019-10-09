import ProfileWrapper from "../datasources/nfl/__archive__/playerProfile/ProfileWrapper";

// describe("player profile tests", () => {
//   const playerProfile = new ProfileWrapper();
//   const player_id = "00-0022803";
//   const inactive_player_id = "00-0027265";
//   const invalid_player_id = "xx-0027265";
//   //   let profile: string;
//   beforeAll(async () => {});

//   test("active player", async () => {
//     const profile = await playerProfile.getPlayerProfile(player_id);
//     // console.log(profile);
//     // expect(profile).toBeInstanceOf(Object);
//     expect(profile.first_name).toEqual("Eli");
//   });

//   // inactive players no long return anything
//   // test("inactive player", async () => {
//   //   const profile = await playerProfile.getPlayerProfile(inactive_player_id);
//   //   expect(profile.first_name).toEqual("Victor");
//   // });

//   test("invalid player", async () => {
//     const profile = await playerProfile.getPlayerProfile(invalid_player_id);
//     console.log(profile);
//     expect(profile).toEqual({});
//   });
// });
