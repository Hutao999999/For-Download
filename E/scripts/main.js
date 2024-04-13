import {
  ModalFormData
} from "@minecraft/server-ui";
import * as Minecraft from "@minecraft/server"

Minecraft.world.afterEvents.entityHurt.subscribe(ev => {
  const hurtEntity = ev.hurtEntity
  const damagingEntity = ev.damageSource.damagingEntity
  const cause = ev.damageSource.cause

  if (damagingEntity) {
    if (
      damagingEntity.typeId == "minecraft:player" &&
      hurtEntity.typeId == "minecraft:player"
    ) {
      damagingEntity.addTag("Hurt")
      hurtEntity.addTag("GotHurt")

      Minecraft.system.runTimeout(() => {
        damagingEntity.removeTag("Hurt")
        hurtEntity.removeTag("GotHurt")
      }, 1)
    }
  }
})

Minecraft.world.afterEvents.itemUse.subscribe(ev => {
  const source = ev.source
  const item = ev.itemStack

  if (source.typeId == "minecraft:player") {
    source.addTag("ItemUse")
    source.addTag(`ItemUse:${item.typeId.replace("minecraft:", "")}`)

    Minecraft.system.runTimeout(() => {
      source.removeTag(`ItemUse`)
      source.removeTag(`ItemUse:${item.typeId.replace("minecraft:", "")}`)
    }, 1)
  }
})

Minecraft.system.runInterval(() => {
  for (const player of Minecraft.world.getPlayers()) {
    if (player.isJumping) {
      player.addTag("Jumping")
    } else {
      player.removeTag("Jumping")
    }

    if (player.isSneaking) {
      player.addTag("Sneaking")
    } else {
      player.removeTag("Sneaking")
    }

    if (player.isSprinting) {
      player.addTag("Sprinting")
    } else {
      player.removeTag("Sprinting")
    }

    if (player.hasTag("itemInfo")) {
      player.removeTag("itemInfo")

      const container = player.getComponent("inventory").container
      const Item = container.getItem(player.selectedSlot)
      const Lore = Item.getLore();
      let Name = "";
      try {
        Name = Item.nameTag.replace(/\n/g, `!n`)
      } catch { };
      const modalForm = new ModalFormData();
      modalForm.title("Item Infomation Changer");
      modalForm.textField("Item Name\n§rPlease write !n to start a new line", "", Name);
      modalForm.textField("§lLore", "", String(Lore).replace(/\n/g, `!n`));
      modalForm.show(player).then(response => {
        if (response.canceled) { } else {
          Item.nameTag = response.formValues[0].replaceAll("!n", `\n`);
          let text = response.formValues[1]
          Item.setLore([text.replace(/!n/g, `\n`)]);
          container.setItem(player.selectedSlot, Item);
        }
      })
    }

    player.getTags().filter(item => item.startsWith("lore:") || item.startsWith("name:")).forEach(tag => player.removeTag(tag))

    const container = player.getComponent("inventory").container
    const handItem = container.getItem(player.selectedSlot)

    if (handItem) {
      const lores = handItem.getLore()

      if (lores?.length > 0) {
        lores.forEach(lore => player.addTag(`lore:${lore.replaceAll("\n", "\\n")}`))
      }

      if (handItem.nameTag) {
        player.addTag(`name:${handItem.nameTag.replaceAll("\n", "\\n")}`)
      }

      for (const tag of player.getTags()) {
        if (tag.startsWith("setName:")) {
          handItem.nameTag = tag.slice(8).replaceAll("!n", "\n")
          container.setItem(player.selectedSlot, handItem)
          player.removeTag(tag)
        } else if (tag.startsWith("setLore:")) {
          handItem.setLore([
            tag.slice(8).replaceAll("!n", "\n")
          ])
          container.setItem(player.selectedSlot, handItem)
          player.removeTag(tag)
        }
      }
    }

    player.getTags().filter(item => item.startsWith("setName:") || item.startsWith("setLore:")).forEach(tag => player.removeTag(tag))
  }
})