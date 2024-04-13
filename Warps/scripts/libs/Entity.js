import * as Minecraft from "@minecraft/server";

export class Entity {
  static changeEntityToPlayer(entity) {
    for (const player of Minecraft.world.getPlayers()) {
      if (
        entity.typeId == "minecraft:player" &&
        entity.id == player.id
      ) {
        return player;
      }
    }

    return undefined;
  }
}