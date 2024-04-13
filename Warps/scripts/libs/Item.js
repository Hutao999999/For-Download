import * as Minecraft from "@minecraft/server";

export class Item {
  static changeItemToJSON(item) {
    const itemEnchant = item.getComponent("enchantable").enchantable;
    const itemCooldown = item.getComponent("cooldown");
    const itemDurability = item.getComponent("durability");
    const itemFood = item.getComponent("food");

    let enchantments = [];

    for (const enchantData of itemEnchant.getEnchantments()) {
      enchantments.push({
        type: enchantData.type,
        level: enchantData.level
      });
    }

    return {
      typeId: item.typeId,
      amount: item.amonut,
      enchantments: enchantments,
      lore: item.getLore(),
      nameTag: item.nameTag,
      lockMode: item.lockMode,
      keepOnDeath: item.keepOnDeath,
      canDestroy: item.getCanDestroy(),
      canPlaceOn: item.getCanPlaceOn(),
      cooldown: {
        category: itemCooldown?.cooldownCategory,
        ticks: itemCooldown?.cooldownTicks
      },
      durability: {
        damage: itemDurability?.damage,
        maxDurability: itemDurability?.maxDurability
      },
      food: {
        canAlwaysEat: itemFood?.canAlwaysEat,
        nutrition: itemFood?.nutrition,
        saturationModifier: itemFood?.saturationModifier,
        usingConvertsTo: itemFood?.usingConvertsTo
      }
    };
  }

  static changeJSONToItem(json) {
    const item = new Minecraft.ItemStack(json.typeId, json.amount);
    const itemDurability = item.getComponent("durability");
    const itemEnchant = item.getComponent("enchantable").enchantable;
    const itemCooldown = item.getComponent("cooldown");

    item.setLore(json.lore);
    item.setCanDestroy(json.canDestroy);
    item.setCanPlaceOn(json.canPlaceOn);
    item.nameTag = json.nameTag;
    item.lockMode = json.lockMode;
    item.keepOnDeath = json.keepOnDeath;
    itemDurability.damage = json.durability.damage;

    for (const enchantData of json.enchantments) {
      const enchantment = new Minecraft.Enchantment(enchantData.id, enchantData.level);

      itemEnchant.addEnchantment(enchantment);
    }

    item.getComponent("enchantable").enchantable = itemEnchant;
    item.getComponent("cooldown").cooldownTicks = json.cooldown.ticks;

    return item;
  }
}