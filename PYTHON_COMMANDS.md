# Supported Python Hero Commands

Below are the commands you can use in the XCodeAcademy Python code editor for your hero character:

| Command                | Description                                                      |
|------------------------|------------------------------------------------------------------|
| `hero.moveUp()`        | Move the hero up by one grid cell (or specify steps: `moveUp(3)`) |
| `hero.moveDown()`      | Move the hero down by one grid cell (or specify steps)            |
| `hero.moveLeft()`      | Move the hero left by one grid cell (or specify steps)            |
| `hero.moveRight()`     | Move the hero right by one grid cell (or specify steps)           |
| `hero.moveXY(x, y)`    | Move the hero directly to grid position (x, y)                    |
| `hero.usePotion()`     | Use a health potion to restore health                             |
| `hero.collect()`       | Collect an item at the hero's current position                    |

**Note:**
- All movement commands can be used with or without a step count (e.g., `hero.moveUp(2)`).
- `moveXY` moves the hero directly to the specified grid coordinates.
- `usePotion` and `collect` are available in levels that support health and item collection. 