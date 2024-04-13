import * as Minecraft from "@minecraft/server";

export class World {
  static cmd(commands, dimension = "minecraft:overworld") {
    if (typeof string == "object") {
      if (Array.isArray(strings)) {
        for (const command of commands) {
          Minecraft.world.getDimension(dimension).runCommand(command);
        }
      }
    } else {
      Minecraft.world.getDimension(dimension).runCommand(commands);
    }
  }

  static log(message, player) {
    if (player) {
      player.sendMessage(message);
    } else {
      Minecraft.world.sendMessage(message);
    }
  }

  static wrong(player, message) {
    this.log(`§c>>> §r§7${message}`, player);
    player.playSound(`note.bass`);
  }

  static success(player, message) {
    this.log(`§a>>> §r§7${message}`, player);
    player.playSound(`random.orb`);
  }

  static runCommand(player, message) {
    this.log(`§d>>> §r§7${message}`, player);
    player.playSound(`note.pling`);
  }
}