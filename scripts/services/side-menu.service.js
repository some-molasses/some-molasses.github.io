/**
 * SideMenuService
 *
 * Handles the mobile menu
 *
 * @author Cole Stanley
 * Created: 2017
 */
import { cws } from '../cws.js';
import { Button } from '../components/button.component.js';
import { MenuItemMulti } from './menus/menu-item-multi.js';
import { MenuItemSingle } from './menus/menu-item-single.js';
import { MenuLayouts } from './menus/menu-layouts.data.js';
import { TopMenuService } from './top-menu.service.js';
export class SideMenuService {
    static build() {
        SideMenuService.menu = SideMenuService.buildMenuStructure();
        SideMenuService.generateMenu();
        const categories = Array.from(SideMenuService.menu.querySelectorAll('.side-menu-dropdown-category'));
        categories.forEach((category) => {
            Button.createByAttachment(category, (event) => {
                const path = event.composedPath();
                // If a dropdown was clicked, don't display anything
                for (let i = 0; i < path.length; i++) {
                    if (path[i] instanceof HTMLBodyElement)
                        break;
                    else if (path[i].classList.contains('dropdown'))
                        return;
                }
                SideMenuService.displayMenuItems(category);
            });
        });
    }
    static createMenuItem(item, parent) {
        const newItem = document.createElement('div');
        newItem.classList.add('side-menu-item');
        newItem.id = `menu-item-${SideMenuService.itemNo}`;
        if (item instanceof MenuItemSingle)
            newItem.appendChild(cws.createElement({
                type: 'a',
                innerText: item.shortName,
                otherNodes: { href: item.singleLinks.href },
            }));
        if (!parent) {
            if (item instanceof MenuItemSingle && item.type === 'Game')
                parent = document.getElementById('games-dropdown-category');
            else
                parent = document.getElementById('tools-dropdown-category');
        }
        parent.appendChild(newItem);
        if (item instanceof MenuItemMulti) {
            newItem.classList.add('dropdown');
            const subMenu = document.createElement('div');
            subMenu.classList.add('side-menu-dropdown');
            newItem.appendChild(subMenu);
            Button.createByAttachment(newItem, () => {
                if (subMenu.style.display !== '')
                    subMenu.style.display = '';
                else
                    subMenu.style.display = 'block';
            });
            item.children.forEach((child) => {
                SideMenuService.createMenuItem(child, subMenu);
            });
            return;
        }
        SideMenuService.itemNo++;
    }
    static buildMenuStructure() {
        function createCategory(name, type, content) {
            return cws.createElement({
                type: 'div',
                id: `${type}-dropdown-category`,
                classList: 'side-menu-dropdown-category side-menu-top-level-item',
                children: (content || []).concat([cws.createElement({
                        type: 'button',
                        classList: 'side-menu-top-level-button',
                        innerHTML: name,
                    })]),
            });
        }
        function createTopLevelButton(name, link) {
            return cws.createElement({
                type: 'div',
                classList: 'side-menu-top-level-item',
                children: [cws.createElement({
                        type: 'a',
                        classList: 'side-menu-top-level-button',
                        otherNodes: [{ type: 'href', value: link }],
                        innerText: name,
                    })]
            });
        }
        const sideMenu = cws.createElement({
            type: 'nav',
            id: 'side-menu',
            children: [
                cws.createElement({
                    type: 'div',
                    id: 'side-menu-content',
                    children: [
                        cws.createElement({
                            type: 'div',
                            id: 'side-menu-title-container',
                            children: [cws.createElement({
                                    type: 'h1',
                                    id: 'side-menu-title',
                                    innerText: 'menu',
                                })],
                        }),
                        createCategory('Games', 'games'),
                        createCategory('Tools', 'tools'),
                        createTopLevelButton('Archive', '/pages/archive.html'),
                        createTopLevelButton('Resume', '/pages/resume.html'),
                        cws.createElement({
                            type: 'button',
                            id: 'side-menu-end-button',
                            children: [cws.createElement({
                                    type: 'img',
                                    otherNodes: [{ type: 'src', value: '/siteimages/closebutton.png' }],
                                })]
                        }),
                        cws.createElement({
                            type: 'div',
                            classList: 'dark-mode-container',
                            children: [
                                cws.createElement({
                                    type: 'span',
                                    innerText: 'Dark mode'
                                }),
                                TopMenuService.createDarkModeToggle('side-menu-dark-toggle'),
                            ]
                        })
                    ],
                }),
            ]
        });
        sideMenu.querySelector('#side-menu-end-button').addEventListener('click', SideMenuService.toggleMenu);
        document.body.appendChild(sideMenu);
        return sideMenu;
    }
    static displayMenuItems(category) {
        const buttons = category.querySelectorAll('.side-menu-item');
        buttons.forEach((button) => {
            if (button.style.display !== 'block')
                button.style.display = 'block';
            else
                button.style.display = 'none';
        });
    }
    static generateMenu() {
        MenuLayouts.TOP_MENU.games.forEach((item) => { SideMenuService.createMenuItem(item); });
        MenuLayouts.TOP_MENU.tools.forEach((item) => { SideMenuService.createMenuItem(item); });
    }
    static toggleMenu() {
        document.getElementById('side-menu-opener').classList.toggle('hidden');
        document.getElementById('side-menu').classList.toggle('open');
    }
}
SideMenuService.itemNo = 0;
//# sourceMappingURL=side-menu.service.js.map