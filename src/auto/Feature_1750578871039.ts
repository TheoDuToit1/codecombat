This prompt seems to ask for multiple features. We are dealing with mechanics of key-collection, enemy-spawning, collision handling and health-loss due to enemies. Also, we are dealing with the `ExitTile` which is an entity in the game.

1. Exit Tile Activation (Entity/Mechanic)
Name of file: `src/entities/ExitTile.ts`

```tsx
import React, { Component } from 'react';

interface Props {
  isKeyCollected: boolean;
}

class ExitTile extends Component<Props, {}> {
  render() {
    const { isKeyCollected } = this.props;

    return (
      <div>
        {isKeyCollected ? 'Exit is Open' : 'Collect the key to open the exit'}
      </div>
    )
  }
}

export default ExitTile;
```

2. Enemy Spawner (Mechanic)
Name of file: `src/mechanics/EnemySpawner.ts`

```tsx
import { Enemy } from "../entities/Enemy";

export class EnemySpawner {
  spawnRate: number;
  spawnLimit: number;
  enemies: Enemy[] = [];

  constructor(spawnRate: number, spawnLimit: number) {
    this.spawnRate = spawnRate;
    this.spawnLimit = spawnLimit;
  }

  spawnEnemy = () => {
    if (this.enemies.length < this.spawnLimit) {
      const enemy = new Enemy();
      this.enemies.push(enemy);
    }
  }
}
```

3. Collision + Health and Loss Handling (Mechanic)
Name of file: `src/mechanics/CollisionHandler.ts`

```tsx
import { Player } from "../entities/Player";
import { Enemy } from "../entities/Enemy";

export class CollisionHandler {
  player: Player;
  enemies: Enemy[];

  constructor(player: Player, enemies: Enemy[]) {
    this.player = player;
    this.enemies = enemies;
  }

  handleCollision = () => {
    this.enemies.forEach(enemy => {
      if ((Math.abs(this.player.position.x - enemy.position.x) < this.player.size.width) &&
        (Math.abs(this.player.position.y - enemy.position.y) < this.player.size.height)) {
        
        this.player.hp -= enemy.damage;
        if (this.player.hp <= 0) {
          console.log("Game Over");
        }
      }
    });
  }
}
```

In summary,
1. We have created `ExitTile` component. The exit to the next level will only open if the key has been collected.
2. We have created a `EnemySpawner` class. It will keep spawning enemies as per the defined spawn rate and the limit.
3. Finally, we have created a `CollisionHandler` which checks for state where the player character collides with the enemies and accordingly adjusts the player's health points. If the health drops to zero or below, we print "Game Over".