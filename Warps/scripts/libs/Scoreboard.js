import * as Minecraft from "@minecraft/server";
import { Player } from "./Player";

export class Scoreboard {
  constructor(scoreboard) {
    this.scoreboardObjective = Minecraft.world.scoreboard.getObjective(scoreboard);
    this.scoreboard = scoreboard;
  }

  addObjective(name) {
    if (this.scoreboardObjective) return;

    Minecraft.world.scoreboard.addObjective(this.scoreboard, name);
  }

  removeObjective() {
    if (!this.scoreboardObjective) return;

    Minecraft.world.scoreboard.removeObjective(this.scoreboard);
  }

  setDisplay(display, ascending = false) {
    const displayTypes = {
      sidebar: `Sidebar`,
      list: `List`,
      belowname: `BelowName`
    };

    if (
      this.scoreboard == "" ||
      !this.scoreboard
    ) {
      Minecraft.world.scoreboard.clearObjectiveAtDisplaySlot(displayTypes[display]);
    } else {
      if (!this.scoreboardObjective) return;

      Minecraft.world.scoreboard.setObjectiveAtDisplaySlot(displayTypes[display], {
        objective: this.scoreboardObjective,
        sortOrder: ascending ? 1 : 0
      });
    }
  }

  addScore(name, score) {
    if (!this.scoreboardObjective) return;
    if (isNaN(Number(score))) return;

    this.scoreboardObjective.addScore(Player.changePlayerNameTag(name), Number(score));
  }

  removeScore(name, score) {
    if (!this.scoreboardObjective) return;
    if (isNaN(Number(score))) return;

    this.scoreboardObjective.addScore(Player.changePlayerNameTag(name), -Number(score));
  }

  setScore(name, score) {
    if (!this.scoreboardObjective) return;
    if (isNaN(Number(score))) return;

    this.scoreboardObjective.setScore(Player.changePlayerNameTag(name), Number(score));
  }

  getScore(name) {
    if (!this.scoreboardObjective) return;

    return this.scoreboardObjective.getScore(Player.changePlayerNameTag(name));
  }

  resetScore(name) {
    if (!this.scoreboardObjective) return;

    if (this.getScore(name) != undefined) {
      this.scoreboardObjective.removeParticipant(name);
    }
  }
}