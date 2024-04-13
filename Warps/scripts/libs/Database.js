import * as Minecraft from "@minecraft/server";
import * as setting from "../config";
import { Scoreboard } from "./Scoreboard";

export class Database {
  static has() {
    if (Minecraft.world.scoreboard.getObjective(setting.database)) {
      return true;
    } else {
      return false;
    }
  }

  static set(key, value) {
    if (!this.has()) return;

    let json = {};

    json[key] = value;

    if (
      key == undefined ||
      key.trim() == ""
    ) return;

    if (value == undefined) return;

    const item = [...Minecraft.world.scoreboard.getObjective(setting.database).getScores()]
      .map(currentItem => currentItem.participant.displayName)
      .filter(item =>
        item.startsWith(`{\"${key}\"`) &&
        item.endsWith(`}`));

    if (item.length > 0) {
      item.forEach(currentItem => {
        new Scoreboard(setting.database).resetScore(currentItem);
      })
    };

    new Scoreboard(setting.database).setScore(json, Math.random() * 4294967296 - 2147483648);
  }

  static get(key) {
    if (!this.has()) return;

    if (
      key == undefined ||
      key.trim() == ""
    ) return;

    const item = [...Minecraft.world.scoreboard.getObjective(setting.database).getScores()]
      .map(item => item.participant.displayName)
      .filter(item =>
        item.startsWith(`{\"${key}\"`) &&
        item.endsWith(`}`));

    return item.length > 0 ? JSON.parse(`${item[0]}`)[key] : undefined;
  }
}