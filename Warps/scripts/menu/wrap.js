import * as Minecraft from "@minecraft/server";
import * as UI from "@minecraft/server-ui";
import * as setting from "../config";
import { Hutao } from "../libs/import";

export class Wrap {
  open(player, paths) {
    const form = new UI.ActionFormData()
      .title(title)
      .button(`§1Refresh`, `textures/ui/refresh_light`);

    let currentPath = setting.default.data.wraps;
    const buttons = []

    for (const path of paths) {
      if (currentPath[path]) {
        if ((
          currentPath[path].admin &&
          player.hasTag("admin")
        ) ||
          !currentPath[path].admin
        ) {
          currentPath = setting.default.data.wraps[path].under;
        } else {
          return Hutao.World.wrong(player, `Unknown path`);
        }
      } else {
        return Hutao.World.wrong(player, `The path was been deleted`);
      }
    }

    for (const path of Object.entries(currentPath)) {
      if (path[1].type == "wrap") {
        if ((
          path[1].admin &&
          player.hasTag("admin")
        ) ||
          !path[1].admin
        ) {
          form.button(`${path[1].name}\n§r§0(Wrap)`);
          buttons.push({
            id: path[0],
            name: path[1].name,
            type: "wrap"
          });
        }
      }
    }

    for (const path of Object.entries(currentPath)) {
      if (path[1].type == "directory") {
        if ((
          path[1].admin &&
          player.hasTag("admin")
        ) ||
          !path[1].admin
        ) {
          form.button(`${path[1].name}\n§r§0(Path)`);
          buttons.push({
            id: path[0],
            name: path[1].name,
            type: "directory"
          });
        }
      }
    }

    if (paths.length > 0) {
      form.button(`§cBack`, "textures/ui/arrow_dark_left_stretch");
    }

    form.show(player)
      .then(res => {
        if (res.canceled) {
          if (res.cancelationReason == "UserBusy") return this.open(player, paths);
        }

        if (res.selection == 0) this.open(player, paths);

        if (buttons[res.selection - 1].type == "directory") {
          paths.push(buttons[res.selection - 1].id);

          this.open(player, paths);
        } else if (buttons[res.selection - 1].type == "wrap") {
          let config = Hutao.Database.get("db");
          let currentPath = config.data.wraps;

          for (const path of paths) {
            if (currentPath[path]) {
              if ((
                currentPath[path].admin &&
                player.hasTag("admin")
              ) ||
                !currentPath[path].admin
              ) {
                currentPath = config.data.wraps[path].under;
              } else {
                return Hutao.World.wrong(player, `Unknown path`);
              }
            } else {
              return Hutao.World.wrong(player, `The path was been deleted`);
            }
          }

          if (currentPath) {
            if (currentPath[buttons[res.selection - 1].id]) {
              const currentWrap = currentPath[buttons[res.selection - 1].id];

              player.teleport({
                x: currentWrap.location.x + 0.5,
                y: currentWrap.location.y,
                z: currentWrap.location.z + 0.5
              }, {
                dimension: Minecraft.world.getDimension(currentWrap.dimension),
                rotation: {
                  x: currentWrap.rotation.x,
                  y: currentWrap.rotation.y
                }
              })

              Hutao.World.success(player, `Teleported successfully`);
            }
          }
        }

        if ((res.selection - 1) == buttons.length + 1) {
          paths.splice(paths.length - 1, 1);

          this.open(player, paths);
        }
      })
  }
}

const title = "§2傳送點";