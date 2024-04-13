import * as Minecraft from "@minecraft/server";

export class Player {
  static changePlayerNameTag(player) {
    if (typeof player == "object") {
      if (player.typeId) {
        if (player.typeId == "minecraft:player") {
          player = JSON.stringify(player.name);
        } else {
          player = player.id;
        }
      } else {
        player = JSON.stringify(player);
      }
    } else {
      if (typeof player != "string") {
        player = JSON.stringify(player);
      }
    }

    return player;
  }

  static getGamemode(player) {
    for (const gamemode in Minecraft.GameMode) {
      if ([
        ...Minecraft.world.getPlayers({
          name: player.name,
          gameMode: Minecraft.GameMode[gamemode]
        })
      ].length > 0) {
        return Minecraft.GameMode[gamemode];
      }
    }
  }

  static setGamemode(player, gamemode) {
    player.runCommand(`gamemode ${gamemode} @s`);
  }
}