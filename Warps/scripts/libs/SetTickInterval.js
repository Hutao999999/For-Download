import * as Minecraft from "@minecraft/server";

export class SetTickInterval {
  constructor(
    run,
    tick = 0,
    firstRun = true
  ) {
    this.run = run;
    this.tick = tick;
    this.firstRun = firstRun;
    this.interval;

    return this;
  }

  on() {
    let start = 0;

    this.interval = Minecraft.system.runInterval(() => {
      if (start % this.tick == 0) {
        if (start == 0) {
          if (this.firstRun) {
            this.run();
          }
        } else {
          this.run();
        }
      }

      start++;
    });
  }

  off() {
    Minecraft.system.clearRun(this.interval);
  }
}