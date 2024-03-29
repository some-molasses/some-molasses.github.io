import { Molasses } from "../../../molasses";
import { MenuItemSingle } from "../../../services/menus/menu-item-single";

export class ShowcaseItem {
  private static next_id = 0;

  private _id: number = ShowcaseItem.next_id++;
  container: HTMLElement;

  static readonly classNames = {
    image: 'image',
  }

  private hasShadow: boolean = false;

  get id(): number { return this._id }

  giveShadow(this: ShowcaseItem, location: 'top' | 'bot'): ShowcaseItem {
    if (!this.hasShadow)
      this.container.classList.add(location === 'top' ? 'top-shadow' : 'bottom-shadow');
    else {
      this.container.classList.remove('top-shadow');
      this.container.classList.remove('bottom-shadow');
      this.container.classList.add('both-shadow')
    }

    this.hasShadow = true;
    return this;
  }

  rebuildContainer(this: ShowcaseItem, parent: HTMLElement, children: HTMLElement[], config: {
    isLeftAligned?: boolean,
    isSecret?: boolean,
    href?: string,
    highlightType?: number,
    classList?: string[]
  }): void {
    const
      content = Molasses.createElement({
        type: 'div',
        classList: 'showcase-item-content',
        children: config.isLeftAligned ? children.reverse() : children,
      }),
      container = Molasses.createElement({
        type: 'div',
        classList: ['showcase-item-container']
          .concat(config.classList ?? [])
          .concat(config.highlightType > 0 ? [`highlight`, `highlight-${config.highlightType}`] : []),
        children: [
          Molasses.createElement({
            type: 'div',
            id: `showcase_item_${this.id}`,
            classList: ['showcase-item']
              .concat(config.isSecret ? ['secret-item'] : [])
              .concat(!config.isLeftAligned ? ['right-aligned-item'] : []),
            children: config.href ? [
              Molasses.createElement({
                type: 'a',
                otherNodes: [{ type: 'href', value: config.href }],
                children: [
                  content
                ]
              })
            ] : [
              content
            ]
          })
        ]
      });

    if (this.container)
      this.container.remove();

    this.container = container;
    parent.appendChild(this.container);
  }

  protected rebuildImage(this: ShowcaseItem, item: MenuItemSingle): HTMLDivElement {
    return Molasses.createElement({
      type: 'div',
      classList: 'image-shadow-container no-opacity',
      children: [
        Molasses.createElement({
          type: 'img',
          classList: [ShowcaseItem.classNames.image, 'single-item-image']
            .concat(item.invertOnDark ? ['dark-invert-filter'] : [])
            .concat(!item.singleLinks.thumbnail || item.singleLinks.thumbnail.match(/logo(.*)\.svg/) ? ['site-logo'] : []),
          otherNodes: [
            { type: 'src', value: item.singleLinks.thumbnail },
            { type: 'alt', value: "" },
          ]
        })
      ]
    });
  }
}
