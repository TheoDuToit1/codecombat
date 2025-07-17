/**
 * XCode Academy Command List
 */

export const commands = {
  movement: [
    "moveRight(): Moves your hero to the right.",
    "moveLeft(): Moves your hero to the left.",
    "moveUp(): Moves your hero up.",
    "moveDown(): Moves your hero down.",
    "moveXY(x, y): Moves your hero to the specified coordinates (x, y).",
    "moveTo(target): Moves your hero towards the specified target (another unit or a position)."
  ],
  
  combat: [
    "attack(target): Attacks the specified target (another unit).",
    "findNearestEnemy(): Returns the nearest enemy unit.",
    "findNearestEnemy(area): Returns the nearest enemy unit within the specified area.",
    "attackNearbyEnemy(): Attacks the nearest enemy within attack range.",
    "shield(): Activates the shield ability (if available).",
    "warcry(): Activates the warcry ability (if available).",
    "terrify(): Activates the terrify ability (if available)."
  ],
  
  utility: [
    "findFriends(): Returns a list of friendly units.",
    "getEnemies(): Returns a list of enemy units.",
    "getNearest(enemies): Returns the nearest enemy from a list of enemies.",
    "getCooldown(ability): Returns the cooldown time for the specified ability.",
    "say(message, options): Sends a message to other players or commands your troops (e.g., \"Defend!\", \"Attack!\", \"Move!\").",
    "health: Returns the hero's current health.",
    "maxHealth: Returns the hero's maximum health.",
    "pos: Returns the hero's current position.",
    "targetPos: Returns the hero's target position.",
    "type: Returns the hero's type."
  ],
  
  controlStructures: [
    "while True:: Creates an infinite loop.",
    "if condition:: Creates a conditional statement.",
    "for variable in list:: Iterates through a list.",
    "Math.sqrt(number): Calculates the square root of a number.",
    "abs(number): Returns the absolute value of a number."
  ]
};

export default commands; 