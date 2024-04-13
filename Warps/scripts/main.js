import * as Minecraft from "@minecraft/server";
import * as setting from "./config";
import { Hutao } from "./libs/import";
import { SetWrap } from "./menu/setWrap";
import { Wrap } from "./menu/wrap";

if (!Hutao.Database.has()) {
  Hutao.Scoreboard(setting.database).addObjective("");
  Hutao.Database.set("db", setting.default);
}

Minecraft.world.afterEvents.itemUse.subscribe(ev => {
  const source = ev.source;
  const item = ev.itemStack;

  if (source.hasTag("admin")) {
    if (item.typeId == "hutao:set_wrap") {
      new SetWrap().open(Hutao.Entity.changeEntityToPlayer(source), []);
    }
  }

  if (item.typeId == "hutao:wrap") {
    new Wrap().open(Hutao.Entity.changeEntityToPlayer(source), []);
  }
})

Minecraft.system.runInterval(() => {
  if (Minecraft.system.currentTick % 2 == 0) {
    const config = Hutao.Database.get("db");

    setting.default.data = config.data;
  }

  for (const player of Minecraft.world.getPlayers()) {
    if (player.hasTag("hutao:openWrap")) {
      new Wrap().open(player, []);

      Hutao.World.success(player, `Close the chat bar to open §dSet Wrap §7menu`);
    }

    if (player.hasTag("hutao:openSetWrap")) {
      if (player.hasTag("admin")) {
        new SetWrap().open(player, []);

        Hutao.World.success(player, `Close the chat bar to open §aWrap §7menu`);
      }
    }

    player.removeTag("hutao:openWrap");
    player.removeTag("hutao:openSetWrap");
  }
})