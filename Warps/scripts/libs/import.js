import { Database } from "./Database";
import { Entity } from "./Entity";
import { Item } from "./Item";
import { Player } from "./Player";
import { Scoreboard } from "./Scoreboard";
import { SetTickInterval } from "./SetTickInterval";
import { SetTickTimeOut } from "./SetTickTimeOut";
import { World } from "./World";

export class Hutao {
  static World = World;
  static Player = Player;
  static Item = Item;
  static Database = Database;
  static Entity = Entity;

  static Scoreboard(scoreboard) {
    return new Scoreboard(scoreboard);
  }

  static SetTickTimeOut(run, ticks) {
    return new SetTickTimeOut(run, ticks);
  }

  static SetTickInterval(run, tick, firstRun) {
    return new SetTickInterval(run, tick, firstRun);
  }
}