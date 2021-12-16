/**
 * Builds the header & menu
 *
 * Activates darkmode where and when applicable
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { cws } from "./cws.js";
import { KeyboardListener } from "./tools/keyboard-listener.js";
var DarkModeResults;
(function (DarkModeResults) {
    DarkModeResults[DarkModeResults["Dark"] = 0] = "Dark";
    DarkModeResults[DarkModeResults["Light"] = 1] = "Light";
    DarkModeResults[DarkModeResults["NoResponse"] = 2] = "NoResponse";
})(DarkModeResults || (DarkModeResults = {}));
export class PageBuilder {
    static init() {
        const index = window.location.href.search("index.html") !== -1 || window.location.href.split(window.location.origin + '/')[1] === '';
        PageBuilder.buildTop(index);
        PageBuilder.buildBottom();
        const darkModeListener = new KeyboardListener(window);
        darkModeListener.addEventListener((listener) => __awaiter(this, void 0, void 0, function* () {
            const result = yield checkForDarkMode(listener);
            return (result === DarkModeResults.Dark);
        }), () => {
            PageBuilder.doDarkmode(true);
            PageBuilder.darkModeStatus = DarkModeResults.Dark;
            cws.forcedLightingMode = -1;
        });
        darkModeListener.addEventListener((listener) => __awaiter(this, void 0, void 0, function* () {
            const result = yield checkForDarkMode(listener);
            return (result === DarkModeResults.Light);
        }), () => {
            PageBuilder.removeDarkMode();
            PageBuilder.darkModeStatus = DarkModeResults.Light;
            cws.forcedLightingMode = 1;
        });
        function checkForDarkMode(listener) {
            return __awaiter(this, void 0, void 0, function* () {
                return checkForPasscode().then((validResponse) => __awaiter(this, void 0, void 0, function* () {
                    if (validResponse)
                        return yield checkForDark();
                    else
                        return DarkModeResults.NoResponse;
                }));
                function checkForPasscode() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const pressed = listener.isWordDown('river');
                        return pressed;
                    });
                }
                function checkForDark() {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield sleep(1500);
                        const darkPressed = listener.isWordDown('dark'), lightPressed = listener.isWordDown('li');
                        if (darkPressed)
                            console.log('Dark mode activated.');
                        else if (lightPressed)
                            console.log('Light mode activated.');
                        else
                            console.log('No valid input received');
                        if (darkPressed)
                            return DarkModeResults.Dark;
                        if (lightPressed)
                            return DarkModeResults.Light;
                        else
                            return DarkModeResults.NoResponse;
                    });
                }
                function sleep(ms) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return new Promise(resolve => setTimeout(resolve, ms));
                    });
                }
            });
        }
    }
    /**
     * Registers a function to be called when the darkness of the page is determined,
     * or immediately if it already has been
     */
    static addDarkModeListener(listener) {
        if (PageBuilder.darkModeStatus == DarkModeResults.Light) {
            listener(false, PageBuilder.getLightModeStyleSheet());
        }
        else if (PageBuilder.darkModeStatus == DarkModeResults.Dark) {
            listener(true, PageBuilder.getDarkModeStyleSheet());
        }
        else {
            PageBuilder.darkModeListeners.push(listener);
        }
    }
    /**
     * Builds the top of a generic page
     */
    static buildTop(index) {
        // loading
        setTimeout(function () {
            let el = document.getElementById("loadingScreen").children[0];
            el.style.opacity = "1";
        }, 16);
        document.addEventListener('readystatechange', function (event) {
            console.log(document.readyState, event);
            if (document.readyState === "complete") {
                document.getElementById("loadingScreen").style.opacity = "0";
                setTimeout(function () {
                    document.getElementById("loadingScreen").outerHTML = "";
                }, (parseFloat(window.getComputedStyle(document.getElementById("loadingScreen")).transitionDuration) * 1000));
            }
        });
        // darkmode
        PageBuilder.doDarkmode(false);
        // building the page
        let addSrc = "";
        if (!index)
            addSrc = "../";
        // header
        let header = document.createElement("header");
        header.setAttributeNode(cws.betterCreateAttr("id", "header"));
        let headerContent = `<div id='homeHead'> 
          <div id='headerBounds'> 
            <a href='${cws.getRelativeUrlPath('index.html')}'> 
              <img id='headerLogo' src='${cws.getRelativeUrlPath('siteimages/logo.svg')}'/> 
              <div id = 'headerName'> 
                <h1>colestanley.ca</h1> 
              </div> 
            </a> 
            <div class='headerMenu'> 
              <a class='headerDropBox' href='${cws.getRelativeUrlPath('pages/archive.html')}' onclick = ''> 
                <div class='headerDropButton'>Archive</div>  
              </a> 
              <a class='headerDropBox' href='${cws.getRelativeUrlPath('pages/resume.html')}' onclick = ''> 
                <div class='headerDropButton'>Resume</div>  
              </a> 
              <a class='headerDropBox' href='javascript:void(0)' onclick = ''> 
                <div class='headerDropButton'>Tools</div> 
                <div class='headerDropBody' id='toolsMenu'></div> 
              </a> 
              <a class='headerDropBox' href='javascript:void(0)' onclick = ''> 
                <div class='headerDropButton'>Games</div> 
                <div class='headerDropBody' id='gamesMenu'></div> 
              </a> 
            </div> 
          </div> 
          <img id='hamImage' 
             src='${cws.getRelativeUrlPath('siteimages/menuicon.png')}' onclick='openHam();'> 
        </div>`;
        if (index) // removing ../ from URLs
            headerContent = headerContent.replace(/\.\.\//g, "");
        header.innerHTML = headerContent;
        document.body.appendChild(header);
        // menu
        let hamMenu = document.createElement("div");
        hamMenu.id = "hamMenu";
        let menuContent = `<div id = 'side-menu-content'> 
        <div> 
          <h1 id='menuTitle' onclick='closeHam()'>menu</h1> 
        </div> 
        <div id='gamesMenuItem' class='secretDropdownContainer'>
          <button class='upperHam'>
            <div>Games</div>
          </button> 
        </div> 
        <div id='sitesMenuItem' class='secretDropdownContainer'>
          <button class='upperHam'>
            <div>Gadgets &amp; Tools</div>
          </button> 
        </div> 
        <div id='miscMenuItem' class='secretDropdownContainer'> 
          <button class='upperHam'>
            <div>Miscellaneous</div>
          </button> 
          <div class='lowerHam' style='display: none;'>
            <a href='${cws.getRelativeUrlPath('pages/resume.html')}'>Resume</a>
          </div> 
          <div class='lowerHam' style='display: none;'>
            <a href='${cws.getRelativeUrlPath('pages/archive.html')}'>Project Archive</a>
          </div> 
        </div>
        <img  
        class='side-menu-end-button' 
        src='${cws.getRelativeUrlPath('siteimages/closebutton.png')}' onclick='closeHam()'>
      <\div>`;
        if (index)
            menuContent = menuContent.replace(/\.\.\//g, "");
        hamMenu.innerHTML = menuContent;
        document.body.appendChild(hamMenu);
        // links
        let gFontsLoad = document.createElement("link");
        gFontsLoad.setAttributeNode(cws.betterCreateAttr("rel", "preconnect"));
        gFontsLoad.setAttributeNode(cws.betterCreateAttr("href", "https://fonts.gstatic.com"));
        document.head.appendChild(gFontsLoad);
        let poppins = document.createElement("link");
        poppins.setAttributeNode(cws.betterCreateAttr("rel", "stylesheet"));
        poppins.setAttributeNode(cws.betterCreateAttr("href", "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&display=swap"));
        document.head.appendChild(poppins);
    }
    /**
     * Imports scripts at bottom of HTML
     */
    static buildBottom() {
        generateScript("scripts/top-menu.js", true);
        generateScript("scripts/side-menu-open-close.js", false);
        generateScript("scripts/side-menu.js", true);
        function generateScript(name, isModule) {
            let out = document.createElement("script");
            if (isModule)
                out.setAttributeNode(cws.betterCreateAttr("type", "module"));
            out.setAttributeNode(cws.betterCreateAttr("src", cws.getRelativeUrlPath(name)));
            document.body.appendChild(out);
        }
    }
    /**
     * Activates main-dark.css at night
     *
     * @param force Forces darkmode to activate no matter the time of day
     */
    static doDarkmode(force) {
        const mainCSSArr = Array.from(document.getElementsByTagName("link"))
            .filter(function (x) { return x.rel == "stylesheet"; })
            .filter(function (x) { return x.href.search("main.css") != -1; });
        if (mainCSSArr.length == 0) // MAIN.CSS IS NOT PRESENT ON PAGE; dark mode does not apply
            return;
        if (force || cws.isDark) {
            const mainCSS = mainCSSArr[0];
            const darkCSS = document.createElement("link");
            darkCSS.setAttributeNode(cws.betterCreateAttr("href", cws.getRelativeUrlPath("stylesheets/main-dark.css")));
            darkCSS.setAttributeNode(cws.betterCreateAttr("rel", "stylesheet"));
            darkCSS.addEventListener('load', () => {
                const darkStyleSheet = PageBuilder.getDarkModeStyleSheet();
                console.log(darkStyleSheet);
                PageBuilder.darkModeStatus = DarkModeResults.Dark;
                PageBuilder.darkModeListeners.forEach((listener) => {
                    listener(true, darkStyleSheet);
                });
            });
            mainCSS.parentNode.insertBefore(darkCSS, mainCSS.nextSibling); // insertion
        }
        else {
            const lightStyleSheet = PageBuilder.getLightModeStyleSheet();
            PageBuilder.darkModeStatus = DarkModeResults.Light;
            PageBuilder.darkModeListeners.forEach((listener) => {
                listener(false, lightStyleSheet);
            });
        }
    }
    static getDarkModeStyleSheet() {
        return PageBuilder.genericGetStyleSheet('/main-dark.css');
    }
    static getLightModeStyleSheet() {
        return PageBuilder.genericGetStyleSheet('/main.css');
    }
    static genericGetStyleSheet(hrefFragment) {
        const ss = Array.from(document.styleSheets).filter((sheet) => {
            return sheet.href.includes(hrefFragment);
        })[0];
        return ss;
    }
    /**
     * Removes the main_dark.css stylesheet
     */
    static removeDarkMode() {
        Array.from(document.head.querySelectorAll('link')).forEach((link) => {
            if (link.href.includes('dark.css'))
                link.remove();
        });
    }
}
PageBuilder.darkModeListeners = [];
PageBuilder.darkModeStatus = DarkModeResults.NoResponse;
PageBuilder.init();
//# sourceMappingURL=build-page.js.map