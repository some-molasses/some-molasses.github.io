import { MenuItemSingle } from "./menu-item-single";
import { MenuItem, MenuItemConfig } from "./menu-item";

type MenuItemMultiConfig = MenuItemConfig & {
  children: MenuItemSingle[];
}

export class MenuItemMulti extends MenuItem {
  children: MenuItemSingle[];

  constructor(config: MenuItemMultiConfig) {
    super({
      name: config.name,
      shortName: config.shortName,
      type: config.type,
      description: config.description,

      showcaseConfig: config.showcaseConfig,
    });

    this.children = config.children;
  }
}
