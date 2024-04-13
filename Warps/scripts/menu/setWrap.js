import * as UI from "@minecraft/server-ui";
import * as setting from "../config";
import { Hutao } from "../libs/import";

export class SetWrap {
  open(player, paths) {
    const form = new UI.ActionFormData()
      .title(title)
      .button(`§1Refresh`, `textures/ui/refresh_light`);

    let currentPath = setting.default.data.wraps;
    const buttons = []

    for (const path of paths) {
      if (currentPath[path]) {
        currentPath = setting.default.data.wraps[path].under;
      } else {
        return Hutao.World.wrong(player, `The path was been deleted`);
      }
    }

    for (const path of Object.entries(currentPath)) {
      if (path[1].type == "wrap") {
        form.button(`${path[1].name}\n§r§0(Wrap)`);
        buttons.push({
          id: path[0],
          name: path[1].name,
          type: "wrap"
        });
      }
    }

    for (const path of Object.entries(currentPath)) {
      if (path[1].type == "directory") {
        form.button(`${path[1].name}\n§r§0(Path)`);
        buttons.push({
          id: path[0],
          name: path[1].name,
          type: "directory"
        });
      }
    }

    form.button(`§1Add wrap`, `textures/ui/color_plus`);
    form.button(`§1Add directory`, `textures/ui/color_plus`);
    form.button(`§dSet directory`, `textures/ui/icon_setting`);

    if (paths.length > 0) {
      form.button(`§cDelete path`, `textures/ui/icon_trash`);
      form.button(`§cBack`, "textures/ui/arrow_dark_left_stretch");
    }

    form.show(player)
      .then(res => {
        if (res.canceled) {
          if (res.cancelationReason == "UserBusy") return this.open(player, paths);
        }

        if (res.selection == 0) this.open(player, paths);

        if (
          res.selection > 0 &&
          (res.selection - 1) < buttons.length
        ) {
          if (buttons[res.selection - 1].type == "directory") {
            paths.push(buttons[res.selection - 1].id);

            this.open(player, paths);
          } else if (buttons[res.selection - 1].type == "wrap") {
            let config = Hutao.Database.get("db");
            let currentPath = config.data.wraps;

            for (const path of paths) {
              if (currentPath[path]) {
                currentPath = config.data.wraps[path].under;
              } else {
                return Hutao.World.wrong(player, `The path was been deleted`);
              }
            }

            if (currentPath) {
              if (currentPath[buttons[res.selection - 1].id]) {
                const response = res.selection - 1;

                new UI.ModalFormData()
                  .title(title)
                  .textField(`Name: `, ``, String(currentPath[buttons[res.selection - 1].id].name))
                  .textField(`Location\n\nX: `, ``, String(currentPath[buttons[res.selection - 1].id].location.x))
                  .textField(`Y: `, ``, String(currentPath[buttons[res.selection - 1].id].location.y))
                  .textField(`Z: `, ``, String(currentPath[buttons[res.selection - 1].id].location.z))
                  .dropdown(`Dimension:`, [
                    "Overworld",
                    "Nether",
                    "The End"
                  ], [
                    "Overworld",
                    "Nether",
                    "The End"
                  ].indexOf(currentPath[buttons[res.selection - 1].id].dimension))
                  .textField(`Rotation\n\nX: `, ``, String(currentPath[buttons[res.selection - 1].id].rotation.x))
                  .textField(`Y: `, ``, String(currentPath[buttons[res.selection - 1].id].rotation.y))
                  .toggle(`§cAdmin`, currentPath[buttons[res.selection - 1].id].admin)
                  .toggle(`§cDelete`, false)
                  .show(player)
                  .then(res => {
                    if (res.canceled) return this.open(player, paths);

                    if (currentPath) {
                      if (currentPath[buttons[response].id]) {
                        const validLocation = (number) => {
                          if (number.trim() == "") return {
                            condition: true,
                            reason: "Cannot be empty"
                          }

                          if (isNaN(Number(number))) return {
                            condition: true,
                            reason: "Must be number"
                          }

                          if (!(
                            number <= 30000000 &&
                            number >= -30000000
                          )) {
                            return {
                              condition: true,
                              reason: "Out of range"
                            }
                          }

                          return {
                            condition: false,
                            reason: ""
                          }
                        }

                        const validName = (string) => {
                          if (string.trim() == "") return {
                            condition: true,
                            reason: "Cannot be empty"
                          }

                          if (string.length > 32) return {
                            condition: true,
                            reason: "Too long"
                          }

                          return {
                            condition: false,
                            reason: ""
                          }
                        }

                        const validRotationX = (number) => {
                          if (number.trim() == "") return {
                            condition: true,
                            reason: "Cannot be empty"
                          }

                          if (isNaN(Number(number))) return {
                            condition: true,
                            reason: "Must be number"
                          }

                          if (!(
                            number <= 90 &&
                            number >= -90
                          )) {
                            return {
                              condition: true,
                              reason: "Out of range"
                            }
                          }

                          return {
                            condition: false,
                            reason: ""
                          }
                        }

                        const validRotationY = (number) => {
                          if (number.trim() == "") return {
                            condition: true,
                            reason: "Cannot be empty"
                          }

                          if (isNaN(Number(number))) return {
                            condition: true,
                            reason: "Must be number"
                          }

                          if (!(
                            number <= 180 &&
                            number >= -180
                          )) {
                            return {
                              condition: true,
                              reason: "Out of range"
                            }
                          }

                          return {
                            condition: false,
                            reason: ""
                          }
                        }

                        const validNameR = validName(res.formValues[0]);
                        const validLocationX = validLocation(res.formValues[1]);
                        const validLocationY = validLocation(res.formValues[2]);
                        const validLocationZ = validLocation(res.formValues[3]);
                        const validRotationXR = validRotationX(res.formValues[5]);
                        const validRotationYR = validRotationY(res.formValues[6]);

                        if (validNameR.condition) return Hutao.World.wrong(player, validNameR.reason);
                        if (validLocationX.condition) return Hutao.World.wrong(player, validLocationX.reason);
                        if (validLocationY.condition) return Hutao.World.wrong(player, validLocationY.reason);
                        if (validLocationZ.condition) return Hutao.World.wrong(player, validLocationZ.reason);
                        if (validRotationXR.condition) return Hutao.World.wrong(player, validRotationXR.reason);
                        if (validRotationYR.condition) return Hutao.World.wrong(player, validRotationYR.reason);

                        let config = Hutao.Database.get("db");
                        let currentPath = config.data.wraps;

                        for (const path of paths) {
                          if (currentPath[path]) {
                            currentPath = config.data.wraps[path].under;
                          } else {
                            return Hutao.World.wrong(player, `The path was been deleted`);
                          }
                        }

                        if (res.formValues[8]) {
                          currentPath[buttons[response].id] = undefined;

                          Hutao.Database.set("db", config);
                          Hutao.World.success(player, `Deleted successfully`);
                        } else {
                          const currentWrap = currentPath[buttons[response].id];

                          currentWrap.name = res.formValues[0].trim();
                          currentWrap.location.x = Number(res.formValues[1]);
                          currentWrap.location.y = Number(res.formValues[2]);
                          currentWrap.location.z = Number(res.formValues[3]);
                          currentWrap.dimension = [
                            "overworld",
                            "nether",
                            "the_end"
                          ][res.formValues[4]];
                          currentWrap.rotation.x = Number(res.formValues[5]);
                          currentWrap.rotation.y = Number(res.formValues[6]);
                          currentWrap.admin = res.formValues[7];

                          Hutao.Database.set("db", config);
                          Hutao.World.success(player, `Changed successfully`);
                        }
                      } else {
                        return Hutao.World.wrong(player, `The wrap was been deleted`);
                      }
                    } else {
                      return Hutao.World.wrong(player, `The path was been deleted`);
                    }
                  })
              } else {
                return Hutao.World.wrong(player, `The wrap was been deleted`);
              }
            } else {
              return Hutao.World.wrong(player, `The path was been deleted`);
            }
          }
        }

        if ((res.selection - 1) == buttons.length) {
          let config = Hutao.Database.get("db");
          let currentPath = config.data.wraps;

          for (const path of paths) {
            if (currentPath[path]) {
              currentPath = config.data.wraps[path].under;
            } else {
              return Hutao.World.wrong(player, `The path was been deleted`);
            }
          }

          new UI.ModalFormData()
            .title(title)
            .textField(`Name: `, ``)
            .textField(`Location\n\nX: `, ``, "0")
            .textField(`Y: `, ``, "0")
            .textField(`Z: `, ``, "0")
            .dropdown(`Dimension:`, [
              "Overworld",
              "Nether",
              "The End"
            ], 0)
            .textField(`Rotation\n\nX: `, ``, "0")
            .textField(`Y: `, ``, "0")
            .toggle(`§cAdmin`, false)
            .show(player)
            .then(res => {
              if (res.canceled) return this.open(player, paths);

              const validLocation = (number) => {
                if (number.trim() == "") return {
                  condition: true,
                  reason: "Cannot be empty"
                }

                if (isNaN(Number(number))) return {
                  condition: true,
                  reason: "Must be number"
                }

                if (!(
                  number <= 30000000 &&
                  number >= -30000000
                )) {
                  return {
                    condition: true,
                    reason: "Out of range"
                  }
                }

                return {
                  condition: false,
                  reason: ""
                }
              }

              const validName = (string) => {
                if (string.trim() == "") return {
                  condition: true,
                  reason: "Cannot be empty"
                }

                if (string.length > 32) return {
                  condition: true,
                  reason: "Too long"
                }

                return {
                  condition: false,
                  reason: ""
                }
              }

              const validRotationX = (number) => {
                if (number.trim() == "") return {
                  condition: true,
                  reason: "Cannot be empty"
                }

                if (isNaN(Number(number))) return {
                  condition: true,
                  reason: "Must be number"
                }

                if (!(
                  number <= 90 &&
                  number >= -90
                )) {
                  return {
                    condition: true,
                    reason: "Out of range"
                  }
                }

                return {
                  condition: false,
                  reason: ""
                }
              }

              const validRotationY = (number) => {
                if (number.trim() == "") return {
                  condition: true,
                  reason: "Cannot be empty"
                }

                if (isNaN(Number(number))) return {
                  condition: true,
                  reason: "Must be number"
                }

                if (!(
                  number <= 180 &&
                  number >= -180
                )) {
                  return {
                    condition: true,
                    reason: "Out of range"
                  }
                }

                return {
                  condition: false,
                  reason: ""
                }
              }

              const validNameR = validName(res.formValues[0]);
              const validLocationX = validLocation(res.formValues[1]);
              const validLocationY = validLocation(res.formValues[2]);
              const validLocationZ = validLocation(res.formValues[3]);
              const validRotationXR = validRotationX(res.formValues[5]);
              const validRotationYR = validRotationY(res.formValues[6]);

              if (validNameR.condition) return Hutao.World.wrong(player, validNameR.reason);
              if (validLocationX.condition) return Hutao.World.wrong(player, validLocationX.reason);
              if (validLocationY.condition) return Hutao.World.wrong(player, validLocationY.reason);
              if (validLocationZ.condition) return Hutao.World.wrong(player, validLocationZ.reason);
              if (validRotationXR.condition) return Hutao.World.wrong(player, validRotationXR.reason);
              if (validRotationYR.condition) return Hutao.World.wrong(player, validRotationYR.reason);

              let config = Hutao.Database.get("db");
              let currentPath = config.data.wraps;

              for (const path of paths) {
                if (currentPath[path]) {
                  currentPath = config.data.wraps[path].under;
                } else {
                  return Hutao.World.wrong(player, `The path was been deleted`);
                }
              }

              const currentWrap = {};

              currentWrap.type = "wrap";
              currentWrap.name = res.formValues[0].trim();
              currentWrap.location = {
                x: Number(res.formValues[1]),
                y: Number(res.formValues[2]),
                z: Number(res.formValues[3]),
              };
              currentWrap.dimension = [
                "overworld",
                "nether",
                "the_end"
              ][res.formValues[4]];
              currentWrap.rotation = {
                x: Number(res.formValues[5]),
                y: Number(res.formValues[6]),
              };
              currentWrap.admin = res.formValues[7];
              currentPath[res.formValues[0].trim()] = currentWrap;

              Hutao.Database.set("db", config);
              Hutao.World.success(player, `Added successfully`);
            })
        }

        if ((res.selection - 1) == buttons.length + 1) {
          let config = Hutao.Database.get("db");
          let currentPath = config.data.wraps;

          for (const path of paths) {
            if (currentPath[path]) {
              currentPath = config.data.wraps[path].under;
            } else {
              return Hutao.World.wrong(player, `The path was been deleted`);
            }
          }

          new UI.ModalFormData()
            .title(title)
            .textField(`Name:`, ``)
            .toggle(`§cAdmin`, false)
            .show(player)
            .then(res => {
              if (res.canceled) return this.open(player, paths);

              let config = Hutao.Database.get("db");
              let currentPath = config.data.wraps;

              for (const path of paths) {
                if (currentPath[path]) {
                  currentPath = config.data.wraps[path].under;
                } else {
                  return Hutao.World.wrong(player, `The path was been deleted`);
                }
              }

              const validName = (string) => {
                if (string.trim() == "") return {
                  condition: true,
                  reason: "Cannot be empty"
                }

                if (string.length > 32) return {
                  condition: true,
                  reason: "Too long"
                }

                return {
                  condition: false,
                  reason: ""
                }
              }

              const validNameR = validName(res.formValues[0]);

              if (validNameR.condition) return Hutao.World.wrong(player, validNameR.reason);

              const currentDirectory = {};

              currentDirectory.name = res.formValues[0].trim();
              currentDirectory.admin = res.formValues[1];
              currentDirectory.type = "directory";
              currentDirectory.under = {};
              currentPath[res.formValues[0].trim()] = currentDirectory;

              Hutao.Database.set("db", config);
              Hutao.World.success(player, `Added successfully`);
            })
        }

        if (paths.length > 0) {
          if ((res.selection - 1) == buttons.length + 2) {
            let config = Hutao.Database.get("db");
            let currentPath = config.data.wraps;

            for (const path of paths) {
              if (currentPath[path]) {
                currentPath = config.data.wraps[path].under;
              } else {
                return Hutao.World.wrong(player, `The path was been deleted`);
              }
            }

            new UI.ModalFormData()
              .title(title)
              .textField(`Name:`, ``, paths[paths.length - 1])
              .toggle(`§cAdmin`, currentPath.admin)
              .show(player)
              .then(res => {
                if (res.canceled) return this.open(player, paths);

                let config = Hutao.Database.get("db");
                let currentPath = config.data.wraps;

                for (const path of paths) {
                  if (paths.indexOf(path) != paths.length - 1) {
                    if (currentPath[path]) {
                      currentPath = config.data.wraps[path].under;
                    } else {
                      return Hutao.World.wrong(player, `The path was been deleted`);
                    }
                  }
                }

                const validName = (string) => {
                  if (string.trim() == "") return {
                    condition: true,
                    reason: "Cannot be empty"
                  }

                  if (string.length > 32) return {
                    condition: true,
                    reason: "Too long"
                  }

                  return {
                    condition: false,
                    reason: ""
                  }
                }

                const validNameR = validName(res.formValues[0]);

                if (validNameR.condition) return Hutao.World.wrong(player, validNameR.reason);

                const currentDirectory = currentPath;

                currentDirectory[paths[paths.length - 1]].name = res.formValues[0].trim();
                currentDirectory[paths[paths.length - 1]].admin = res.formValues[1];
                currentDirectory[paths[paths.length - 1]].type = "directory";

                Hutao.Database.set("db", config);
                Hutao.World.success(player, `Set successfully`);
              })
          }

          if ((res.selection - 1) == buttons.length + 3) {
            let config = Hutao.Database.get("db");
            let currentPath = config.data.wraps;

            for (const path of paths) {
              if (paths.indexOf(path) != paths.length - 1) {
                if (currentPath[path]) {
                  currentPath = config.data.wraps[path].under;
                } else {
                  return Hutao.World.wrong(player, `The path was been deleted`);
                }
              }
            }

            if (currentPath) {
              delete currentPath[paths[paths.length - 1]];

              Hutao.Database.set("db", config);
              Hutao.World.success(player, `Changed successfully`);
            } else {
              return Hutao.World.wrong(player, `The path was been deleted`);
            }
          }

          if ((res.selection - 1) == buttons.length + 4) {
            paths.splice(paths.length - 1, 1);

            this.open(player, paths);
          }
        }
      })
  }
}

const title = "§d設定傳送點";