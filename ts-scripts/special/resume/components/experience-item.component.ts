import { cws } from "../../../cws.js";

interface ResumeExperienceItemComponentCreationData {
  parentElement: HTMLElement;
  title: string;
  subtitle?: string;
  dates: string[];
  experiencePoints: string[];
  mainImageUrl: string;
  darkImageUrl: string;
  imageAlt: string;
  flipped?: boolean;
  type: 'table' | 'grid';
  invertDarkImg?: boolean;
}

export class ResumeExperienceItemComponent {
  container: HTMLElement;
  title: string;
  subtitle: string;
  dates: string[];

  isFlipped: boolean;
  rebuildFn: () => void;

  private _experiencePoints: string[];
  private _mainImageSrc: string;
  private _darkImageSrc: string;
  private _imageAlt: string;
  private _invertDarkImg: boolean;

  constructor(data: ResumeExperienceItemComponentCreationData) {
    this.title = data.title;
    this.subtitle = data.subtitle || null;
    this.dates = data.dates;
    this._experiencePoints = data.experiencePoints;
    this.isFlipped = data.flipped || false;

    if (data.type === 'grid')
      this.rebuildFn = this.rebuildGrid;
    else
      this.rebuildFn = this.rebuildTable;

    this._mainImageSrc = validateUrl(data.mainImageUrl);
    this._darkImageSrc = validateUrl(data.darkImageUrl);
    this._imageAlt = data.imageAlt;
    this._invertDarkImg = data.invertDarkImg || false;

    this.rebuildFn();

    data.parentElement.appendChild(this.container);

    function validateUrl(url: string): string {
      if (url.includes('./'))
        throw new Error('URLs should have the siteimages folder as root.');

      return url;
    }
  }

  get images(): HTMLImageElement[] {
    return Array.from(this.container.querySelectorAll('img')) as HTMLImageElement[];
  }

  get experiencePoints(): string[] {
    return this._experiencePoints;
  }

  set experiencePoints(newPoints: string[]) {
    this._experiencePoints = newPoints;
    this.rebuildFn();
  }


  get experiencePointElements(): HTMLLIElement[] {
    return Array.from(this.container.querySelectorAll('li'));
  }
  /**
   * Rebuilds this.container
   */
  private rebuildTable(): void {
    const me = this,
      table = cws.createTable({
        head: [
          [
            cws.createElement({
              type: 'h3',
              classList: 'job-title',
              innerText: me.title,
            }),
            cws.createElement({
              type: 'h3',
              classList: 'experience-date',
              innerText: me.dates.join(', '),
            })
          ],
          this.subtitle ? [
            cws.createElement({
              type: 'h4',
              classList: 'workplace-name',
              innerText: me.subtitle,
            }),
            null
          ] : null,
        ],
        body: [
          getTableBody()
        ],
        classList: ['experience-table']
      }),
      container = cws.createElement({
        type: 'div',
        classList: 'experience-item',
        children: [table],
      });

    if (this.container) {
      this.container.replaceWith(container);
    }

    this.container = container;

    function getTableBody(): HTMLElement[] {
      const elements = [cws.createElement({
        type: 'div',
        children: [
          cws.createElement({
            type: 'div',
            classList: ['experience-image-container', 'mobile-only'],
            children: me.getImages()
          }),
          cws.createElement({
            type: 'ul',
            children: me._experiencePoints.map((point: string) => {
              return cws.createElement({
                type: 'li',
                innerHTML: me.formatPoint(point)
              });
            }),
          }),
        ]
      }),
      cws.createElement({
        type: 'div',
        classList: ['experience-image-container', 'desktop-only'],
        children: me.getImages()
      })];

      if (me.isFlipped)
        return elements.reverse();
      else return elements;
    }
  }

  /**
   * Rebuilds this.container
   */
  private rebuildGrid(): void {
    const me = this,
      grid = cws.createElement({
        type: 'div',
        classList: ['horizontal-grid', 'experience-grid'].concat(me.isFlipped ? ['reversed'] : []),
        children: getGridBody(),
      }),
      container = cws.createElement({
        type: 'div',
        classList: 'experience-item',
        children: [grid],
      });

    if (this.container) {
      this.container.replaceWith(container);
    }

    this.container = container;

    function getGridBody(): HTMLElement[] {
      const els = [cws.createElement({
        type: 'div',
        classList: 'experience-grid-body-cell',
        children: [
          cws.createElement({
            type: 'div',
            children: [
              cws.createElement({
                type: 'h3',
                classList: 'job-title',
                innerText: me.title,
                style: 'float: left'
              }),
              cws.createElement({
                type: 'h3',
                classList: 'experience-date',
                innerText: me.dates.join(', '),
                style: 'float: right'
              })
            ]
          }),
          cws.createElement({
            type: 'h4',
            classList: 'workplace-name',
            innerText: me.subtitle,
            style: 'clear: both'
          }),
          cws.createElement({
            type: 'div',
            classList: ['experience-image-container', 'mobile-only'],
            children: me.getImages(),
          }),
          cws.createElement({
            type: 'ul',
            children: me._experiencePoints.map((point: string) => {
              return cws.createElement({
                type: 'li',
                innerHTML: me.formatPoint(point)
              });
            }),
          }),
        ]
      }), cws.createElement({
        type: 'div',
        classList: ['experience-grid-image-cell', 'desktop-only'],
        children: me.getImages()
      })];

      if (me.isFlipped)
        return els.reverse();
      else return els;
    }
  }

  private formatPoint(point: string): string {
    point = point.replace(/<\/[C, L]>/g, "</span>"); // tag closings
    point = point.replace(/<C>/g, "<span class='resume-highlight'>"); // tag closings

    for (let i = 0; i < point.length; i++) {
      if (point.substring(i, i + 2) === '<L') {
        const endTagIndex = getClosing(i);
        const tag = point.substring(i, endTagIndex);
        const classList = ['resume-highlight', 'resume-highlight-language'];

        if (tag.includes('term')) {
          const tagParts = tag.replace(/<L/g, '').replace(/>/g, '').trim().replace(/'/g, '').split('=');

          for (let j = 0; j < tagParts.length; j++) {
            if (tagParts[j] === 'term') {
              const highlightTerms = tagParts[j + 1].split(' ');
              highlightTerms.forEach((term: string) => {
                classList.push(`highlight-as-${term}`);
              });
            }
          }
        }

        const newResult = point.substring(0, i) + `<span class='${classList.join(' ')}'>` + point.substring(endTagIndex + 1);
        point = newResult;
      }
    }

    return point;

    function getClosing(i: number): number {
      for (let j = i; j < point.length; j++) {
        if (point[j] === '>')
          return j;
      }

      console.log(i, point.substring(i));
      throw new Error('Bad string: ' + point);
    }
  }

  private getImages(): HTMLImageElement[] {
    const me = this,
      classList = ['experience-image'].concat(me.isFlipped ? ['reversed'] : []).concat(me._invertDarkImg ? ['dark-invert-filter'] : []);

    return [cws.createElement({
      type: 'img',
      classList: classList.concat(['dark-none']),
      otherNodes: [{
        type: 'src',
        value: me._mainImageSrc
      }, {
        type: 'alt',
        value: me._imageAlt
      }]
    }), cws.createElement({
      type: 'img',
      classList: classList.concat(['dark-only']),
      otherNodes: [{
        type: 'src',
        value: me._darkImageSrc
      }, {
        type: 'alt',
        value: me._imageAlt
      }]
    })];
  }
}
