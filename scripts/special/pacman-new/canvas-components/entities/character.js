import { cws } from "../../../../cws.js";
import { PacmanEntityEnum, PacmanDirectionEnum, PacmanStateEnum } from "../../helper.js";
import { PacmanConstants } from "../constants.js";
import { PacmanEntity } from "./entity.js";
import { PacmanMapNode } from "../map-node.js";
import { PacmanSprites } from "../sprites.js";
import { PacmanState } from "../state.js";
export class PacmanCharacter extends PacmanEntity {
    constructor(data) {
        super(data.x, data.y, PacmanCharacter.WIDTH, PacmanCharacter.WIDTH, data.colour, data.name);
        this.distanceTravelledToDest = 0;
        this.distanceToDest = 0;
        this.aimDirection = null;
        this.direction = PacmanDirectionEnum.STILL;
        this.stupidifier = 0;
        this.isDead = false;
        this.startDelay = 0;
        this.respawnTime = -1;
        /**
         * Resets this Character's home to its current position
         */
        this.resetHome = function () {
            this.home.x = this.x;
            this.home.y = this.y;
        };
        this.home = { x: data.x, y: data.y };
        this.currentNodeID = data.startNodeID;
        this.destinationNodeID = this.currentNodeID;
        this.startDelay = data.startDelay || 0;
        this.homeNodeID = data.startNodeID;
        this.initialDirection = data.initialDirection;
        this.isFrozen = !data.unfreezeAtStart;
        this.initialFrozen = !data.unfreezeAtStart;
        this.revive(false);
    }
    get displayPos() {
        let centerer = (PacmanConstants.HALL_WIDTH - this.width) / 2;
        return { x: this.x + centerer, y: this.y + centerer };
    }
    get homeNode() {
        return PacmanMapNode.getNodeByID(this.homeNodeID);
    }
    get isFleeing() {
        return (this.name != PacmanEntityEnum.PLAYER
            && cws.orEquals(PacmanState.gameState, [PacmanStateEnum.CHASE, PacmanStateEnum.GHOST_DEATH_PAUSE])
            && (this.respawnTime < PacmanState.chaseStartTime
                || PacmanState.lifeStartTime + this.startDelay > PacmanState.chaseStartTime)
            && !this.isDead);
    }
    get isPlayer() {
        return this.name === PacmanEntityEnum.PLAYER;
    }
    get speed() {
        if (this.isDead)
            return PacmanCharacter.BASE_RETURN_SPEED;
        if (this.isFleeing)
            return PacmanCharacter.CHASE_SPEED;
        else
            return PacmanCharacter.BASE_SPEED;
    }
    getImage() {
        return PacmanSprites.spritesTree.getValue(this.getImageSource());
    }
    getImageSource() {
        let src = "";
        // folder
        if (this.isFleeing) {
            src = "chase";
        }
        else if (this.isDead) {
            if (this.name === PacmanEntityEnum.PLAYER) {
                src = "pacd";
            }
            else {
                src = "death";
            }
        }
        else {
            switch (this.name) {
                case PacmanEntityEnum.PLAYER:
                    src = "pacman";
                    break;
                case PacmanEntityEnum.RED:
                    src = "red";
                    break;
                case PacmanEntityEnum.PINK:
                    src = "pink";
                    break;
                case PacmanEntityEnum.CYAN:
                    src = "cyan";
                    break;
                case PacmanEntityEnum.ORANGE:
                    src = "orange";
                    break;
            }
        }
        src += "/";
        // state (normally direction)
        if (this.isFleeing) {
            if ((PacmanState.chaseStartTime + PacmanConstants.CHASE_LEN * 0.75) < PacmanState.animationNow) {
                if ((PacmanState.animationNow - PacmanState.chaseStartTime) % (4 * PacmanConstants.CHARACTER_ANIMATION_UPDATE_INTERVAL) < 2 * PacmanConstants.CHARACTER_ANIMATION_UPDATE_INTERVAL) {
                    src += "b";
                }
                else {
                    src += "w";
                }
            }
            else {
                src += "b";
            }
        }
        else {
            switch (this.direction) {
                case PacmanDirectionEnum.UP:
                    src += "u";
                    break;
                case PacmanDirectionEnum.LEFT:
                    src += "l";
                    break;
                case PacmanDirectionEnum.DOWN:
                    src += "d";
                    break;
                case PacmanDirectionEnum.RIGHT:
                    src += "r";
                    break;
                default:
                    if (this.isPlayer) {
                        src = "pacman/default.png";
                        return src;
                    }
                    else {
                        src += "u";
                    }
            }
        }
        // animation
        if (!this.isDead) {
            if (this.isPlayer) {
                const interval = PacmanConstants.CHARACTER_ANIMATION_UPDATE_INTERVAL / 2, frame = PacmanState.animationNow % (4 * interval);
                if (frame < interval) {
                    src += "1";
                }
                else if (frame < 2 * interval) {
                    src += "2";
                }
                else if (frame < 3 * interval) {
                    src += "1";
                }
                else {
                    src = "pacman/default.png";
                    return src;
                }
            }
            else {
                if (PacmanState.animationNow % (2 * PacmanConstants.CHARACTER_ANIMATION_UPDATE_INTERVAL) < PacmanConstants.CHARACTER_ANIMATION_UPDATE_INTERVAL) {
                    src += "1";
                }
                else {
                    src += "2";
                }
            }
        }
        src += ".png";
        return src;
    }
    draw(canvas) {
        this._drawNormal(canvas, this.getImage());
    }
    _drawNormal(canvas, image) {
        let pos = this.displayPos;
        canvas.drawImage(image, pos.x, pos.y, null, null);
    }
    equals(character) {
        return this.EntityID === character.EntityID;
    }
    /**
     * Moves this character by its speed
     */
    move(directFn) {
        if (!this.isFrozen && (cws.Array.contains([PacmanStateEnum.NORMAL, PacmanStateEnum.CHASE], PacmanState.gameState))) {
            switch (this.direction) {
                case PacmanDirectionEnum.UP:
                    this.y -= this.speed;
                    break;
                case PacmanDirectionEnum.DOWN:
                    this.y += this.speed;
                    break;
                case PacmanDirectionEnum.LEFT:
                    this.x -= this.speed;
                    break;
                case PacmanDirectionEnum.RIGHT:
                    this.x += this.speed;
                    break;
            }
            this.distanceTravelledToDest += this.speed;
        }
        // if character has reached the destination
        if (this.distanceTravelledToDest >= this.distanceToDest) {
            this.currentNodeID = this.destinationNodeID;
            if (!this.isFrozen) {
                directFn();
                // (this as PacmanGhost & PacmanCharacter).direct();
            }
            ;
            this.moveToNode(this.currentNodeID);
        }
    }
    /**
     * Moves this character back to its home
     */
    moveToHome() {
        this.moveToNode(this.homeNodeID);
        this.currentNodeID = this.homeNodeID;
        this.destinationNodeID = this.homeNodeID;
        this.distanceTravelledToDest = 0;
        this.distanceToDest = 0;
    }
    /**
     * Moves this character to the indicated node
     */
    moveToNode(nodeID) {
        const node = PacmanMapNode.getNodeByID(nodeID);
        this.x = node.x;
        this.y = node.y;
    }
    /**
     * Revives this Character
     */
    revive(moveHome) {
        this.respawnTime = PacmanState.now;
        this.isDead = false;
        this.direction = this.initialDirection;
        this.aimDirection = null;
        if (moveHome)
            this.moveToHome();
    }
    get currentNode() {
        return PacmanMapNode.getNodeByID(this.currentNodeID);
    }
    get destinationNode() {
        return PacmanMapNode.getNodeByID(this.destinationNodeID);
    }
    get hasDestination() {
        return (this.destinationNodeID != null && this.destinationNodeID != undefined);
    }
}
PacmanCharacter.WIDTH = PacmanConstants.CHARACTER_DIAMETER;
PacmanCharacter.BASE_SPEED = PacmanConstants.CHARACTER_SPEED;
PacmanCharacter.BASE_RETURN_SPEED = PacmanConstants.RETURN_SPEED;
PacmanCharacter.CHASE_SPEED = PacmanConstants.CHASE_SPEED;
//# sourceMappingURL=character.js.map