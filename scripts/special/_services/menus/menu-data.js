const PRESENT_MONTH = new Date(Date.now()).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' });
export class MenuData {
}
MenuData.MENU_ITEMS = {
    index: {
        name: "Home",
        shortName: "Home",
        type: "Tool",
        date: PRESENT_MONTH,
        links: {
            href: "",
        },
        showDate: false,
    },
    infectionModel: {
        name: "Infection Model",
        type: "Tool",
        date: "April 2021",
        description: "This simulation models the spread of a contagious infection within a localized community.",
        links: {
            href: "pages/infection.html",
            thumbnail: "siteimages/index/infection.png",
            showcase: 'siteimages/index/infection-spotlight.png',
        },
        showcase: true,
    },
    emWaves: {
        name: "The Propagation of Electromagnetic Waves",
        shortName: "EM Wave Animator",
        type: "Tool",
        date: "May 2020",
        description: "This interactive diagram demonstrates the motion of electromagnetic waves.",
        showcase: true,
        links: {
            href: "pages/emwaves.html",
            thumbnail: "siteimages/index/emwaves.png",
            showcase: "siteimages/index/emwavesbig.png"
        }
    },
    matrices: {
        name: "Matrix Calculator",
        type: "Tool",
        date: "June 2021",
        description: "This calculator calculates matrix operations.",
        links: {
            href: "pages/university/matrices.html"
        },
        "showInSmallMenus": false,
        "isSecret": true
    },
    daydream: {
        name: "Daydream",
        type: "Game",
        date: "June 2019",
        description: "Comb through a grid-based spaceship as you rearrange mirrors to fire a core of the enemy's ship. <br/><br/>Downloaded from Google Drive as an executable .jar file.",
        showcase: true,
        links: {
            href: "https://drive.google.com/open?id=1MlW4gyXsaFHNxZFwPfi4f-45UrGY9k6w",
            "hrefIsExternal": true,
            thumbnail: "siteimages/java/daydream-icon.png",
            showcase: "siteimages/java/daydream-showcase.png"
        },
        "isExternalLink": true
    },
    vectors: {
        name: "Vector Graphing Calculator",
        shortName: "Vector Graphing",
        type: "Tool",
        date: "June 2020",
        description: "Perform vector calculations with a 3D graph.",
        links: {
            href: "pages/vectors.html",
            thumbnail: "siteimages/index/vectors.png"
        }
    },
    wiresV2: {
        name: "Broken Wires",
        shortName: "Broken Wires",
        type: "Game",
        date: "October 2021",
        description: "Reconnect the two ends of a broken circuit in randomly generated puzzles",
        showcase: true,
        links: {
            href: "games/wires-v2.html",
            thumbnail: "siteimages/energy/thumb.png",
            showcase: "siteimages/energy/showcase.png"
        }
    },
    algebra: {
        name: "Algebraic Calculator",
        type: "Tool",
        date: "December 2020",
        description: "Feed equations into the calculator and get calculated answers.",
        links: {
            href: "pages/calculator.html"
        },
        "archive": true
    },
    ticTacToe: {
        name: "Tic Tac Toe AI",
        type: "Game",
        date: "April 2019",
        description: "Play Tic Tac Toe against a machine-learning opponent.<br/><br/>Downloaded from Google Drive as an executable .jar file.",
        links: {
            href: "https://drive.google.com/open?id=1YBHmeOboxp6Vb6JGg8EoS4n8ri_PbSkK",
            "hrefIsExternal": true,
            thumbnail: "siteimages/java/tic-tac-icon.png"
        },
        "invertOnDark": true,
        "isExternalLink": true
    },
    escape: {
        name: "Starship Escape",
        type: "Game",
        date: "July 2018",
        description: "Survive waves of enemies in this original sidescroller!",
        showcase: true,
        links: {
            href: "games/escape.html",
            thumbnail: "siteimages/escape/thumb.png",
            showcase: "siteimages/escape/thumb.png"
        }
    },
    dice: {
        name: "Dice Roller",
        type: "Tool",
        date: "July 2018",
        description: "A simple dice substitute for when you left your real dice at home.",
        links: {
            href: "pages/dice.html",
            thumbnail: "siteimages/dice/dicethumb.png"
        }
    },
    kittenAndCrypt: {
        name: "The Kitten And The Crypt",
        type: "Game",
        date: "June 2018",
        description: "Crawl through a randomly-generated dungeon to retrieve your lost kitten.<br/><br/>Downloaded from Google Drive as an executable .jar file.",
        showcase: true,
        links: {
            href: "https://drive.google.com/open?id=1nYmU7NLD6Ip7YVuD8M3xtqJ0o6QF6mJL",
            "hrefIsExternal": true,
            thumbnail: "siteimages/java/kitten-icon.png",
            showcase: "siteimages/java/kitten-sc.png"
        },
        "isExternalLink": true
    },
    luigi: {
        name: "Mario 1-1",
        type: "Game",
        date: "Fall 2017",
        description: "Play a replica of the first level of Mario!",
        showcase: true,
        links: {
            href: "games/luigi.html",
            thumbnail: "siteimages/mario/thumbnail.png",
            showcase: "siteimages/mario/showcase.png"
        }
    },
    complexCalculator: {
        name: "Complex Number Calculator",
        shortName: "Complex Numbers I",
        type: "Tool",
        date: "December 2020",
        description: "Calculates many attributes of complex numbers.",
        links: {
            href: "pages/complex.html",
            thumbnail: "siteimages/archive/complex.png"
        },
        "archive": true,
        "showInSmallMenus": false
    },
    lunarDefense: {
        name: "Lunar Defense",
        shortName: "Lunar Defense",
        type: "Game",
        date: "Spring 2017",
        description: "Defend the moon from an alien attack in a variety of game modes.",
        showcase: true,
        links: {
            href: "games/lunardefense.html",
            thumbnail: "siteimages/archive/showcasebg.png",
            showcase: "siteimages/archive/showcasebg.png"
        },
        "archive": true
    },
    quadraticCalc: {
        name: "Quadratic Calculator",
        shortName: "Quadratics",
        type: "Tool",
        date: "October 2018",
        description: "Calculates x-intercepts, so you don't have to!",
        links: {
            href: "pages/quadratic.html",
            thumbnail: "siteimages/archive/quadthumb.png"
        },
        "archive": true
    },
    pacManV1: {
        name: "Pac-Man (Version 1)",
        shortName: "Pac-Man V1",
        type: "Game",
        date: "June 2018",
        description: "Play a replica of the Bandai-Namco classic.",
        showcase: true,
        links: {
            href: "games/pacman-v1.html",
            thumbnail: "siteimages/pac/thumb-v1.png",
            showcase: "siteimages/pac/showcase-v1.png"
        },
        "archive": true
    },
    pacManV2: {
        name: "Pac-Man",
        shortName: "Pac-Man",
        type: "Game",
        date: "September 2021",
        description: "Play a replica of the Bandai-Namco classic.",
        showcase: true,
        links: {
            href: "games/pacman-v2.html",
            thumbnail: "siteimages/pac/thumb-v2.png",
            showcase: "siteimages/pac/showcase-v2.png"
        }
    },
    eightBall: {
        name: "Magic 8 Ball",
        shortName: "Eight Ball",
        type: "Tool",
        date: "Fall 2017",
        description: "Ask questions of your future to the all-knowing eight ball",
        links: {
            href: "pages/eightball.html",
            thumbnail: "siteimages/archive/eightballthumbnail.png"
        },
        "archive": true
    },
    npcGenerator: {
        name: "D&D 5e NPC Generator",
        shortName: "NPC Generator",
        type: "Tool",
        date: "February 2020",
        description: "This generator produces Dungeons and Dragons 5e enemies with randomized traits.",
        links: {
            href: "pages/npcs/generator.html",
            thumbnail: "siteimages/npcs/generator-thumbnail.png"
        },
        "invertOnDark": true
    },
    npcCreator: {
        name: "D&D 5e NPC Creator",
        shortName: "NPC Creator",
        type: "Tool",
        date: "August 2021",
        description: "Custom-create D&D 5e NPCs",
        links: {
            href: "pages/npcs/creator.html"
        }
    },
    npcInitiative: {
        name: "D&D 5e Initiative Tracker",
        shortName: "Initiative Tracker",
        type: "Tool",
        date: "August 2021",
        description: "Track initiative for a D&D 5e encounter.",
        links: {
            href: "pages/npcs/initiative-tracker.html",
            thumbnail: "siteimages/npcs/tracker-thumbnail.png"
        },
        "invertOnDark": true
    },
    npcNames: {
        name: "D&D 5e NPC Names List",
        shortName: "NPC Names List",
        type: "Tool",
        date: "August 2021",
        description: "Edit the list of NPC names",
        links: {
            href: "pages/npcs/names-list.html"
        },
        "isSecret": true
    },
    diceHistogram: {
        name: "Dice Histogram",
        shortName: "Dice Histogram",
        type: "Tool",
        date: "December 2021",
        description: "See the distribution of any number of dice rolled",
        links: {
            href: "pages/npcs/histogram.html",
            thumbnail: "siteimages/dice/dicethumb.png"
        },
    },
    npcSummons: {
        name: "D&D 5e Creature Tracker",
        shortName: "Creature Tracker",
        type: "Tool",
        date: "December 2021",
        description: "Handle attack and damage rolls for many creatures at once.",
        links: {
            href: "pages/npcs/summons.html",
            thumbnail: "siteimages/creatures/thumbnail.png"
        },
    },
    wiresV1: {
        name: "Broken Wires (Version 1)",
        shortName: "Broken Wires (V1)",
        type: "Game",
        date: "September 2018",
        description: "Reconnect the two ends of a broken circuit in randomly generated puzzles.  Built in vanilla JavaScript.",
        showcase: false,
        links: {
            href: "games/wires-v1.html",
            thumbnail: "siteimages/energy/thumb.png",
            showcase: "siteimages/energy/showcase.png"
        },
        "archive": true,
    },
    covidDashboard: {
        name: "COVID-19 Dashboard",
        shortName: "COVID Dashboard",
        type: "Tool",
        date: "July 2022",
        description: "Track daily COVID-19 updates using the COVID-19 Canada Open Data Working Group's open API.",
        links: {
            thumbnail: "siteimages/covid/thumb.png",
            href: "pages/covid-data/home.html",
        },
    },
    archive: {
        name: "Archive",
        shortName: "Archive",
        type: "Tool",
        date: "December 2016 - Present",
        links: {
            thumbnail: "siteimages/archive-lock.png",
            href: "pages/archive.html",
        },
        invertOnDark: true,
    },
    resume: {
        name: "Resume",
        shortName: "Resume",
        type: "Tool",
        date: PRESENT_MONTH,
        links: {
            href: "pages/resume.html",
        },
    },
    overwatchHome: {
        name: "Overwatch Impacts",
        shortName: "Overwatch - Home",
        description: 'The first web project I wrote (working with a friend), giving an analysis of the video game Overwatch.',
        type: "Tool",
        date: 'December 2016',
        links: {
            href: "pages/overwatchimpacts/home.html",
            thumbnail: "siteimages/archive/owithumbnail.png",
        },
        archive: true,
        noindex: true,
    },
    overwatchCommunity: {
        name: "Overwatch Impacts - Community",
        shortName: "Overwatch - Community",
        type: "Tool",
        date: 'December 2016',
        links: {
            href: "pages/overwatchimpacts/community.html",
        },
        noindex: true,
    },
    overwatchDevelopment: {
        name: "Overwatch Impacts - Development",
        shortName: "Overwatch - Development",
        type: "Tool",
        date: 'December 2016',
        links: {
            href: "pages/overwatchimpacts/development.html",
        },
        noindex: true,
    },
    overwatchGameplay: {
        name: "Overwatch Impacts - Gameplay",
        shortName: "Overwatch - Gameplay",
        type: "Tool",
        date: 'December 2016',
        links: {
            href: "pages/overwatchimpacts/gameplay.html",
        },
        noindex: true,
    },
    overwatchSociety: {
        name: "Overwatch Impacts - Society",
        shortName: "Overwatch - Society",
        type: "Tool",
        date: 'December 2016',
        links: {
            href: "pages/overwatchimpacts/society.html",
        },
        noindex: true,
    },
    wordle: {
        name: "Wordle",
        description: 'A rebuild of the popular puzzle game Wordle.',
        type: "Game",
        date: 'April 2022',
        links: {
            href: "games/wordle.html",
            thumbnail: "siteimages/wordle/thumb-light.png",
        },
    },
};
//# sourceMappingURL=menu-data.js.map