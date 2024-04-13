import * as Minecraft from "@minecraft/server";

export class SetTickTimeOut {
  constructor(
    run,
    ticks
  ) {
    this.run = run;
    this.ticks = ticks;

    return this;
  }

  run() {
    let tick = 0;

    const timeout = Minecraft.system.runInterval(() => {
      if (tick >= this.ticks) {
        this.run();
        Minecraft.system.clearRun(timeout);
      }

      tick++;
    })
  }
}