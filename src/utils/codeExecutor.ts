import { GameState, Character, Enemy, Collectible, Position, ExecutionStep } from '../types/game';

export class CodeExecutor {
  private gameState: GameState;
  private logs: string[] = [];
  private steps: ExecutionStep[] = [];
  private isRunning: boolean = false;
  private currentLine: number = 0;
  private codeLines: string[] = [];

  constructor(gameState: GameState) {
    this.gameState = { ...gameState };
  }

  async executeCode(code: string, onUpdate: (state: GameState, logs: string[], currentLine?: number, codeLines?: string[]) => void): Promise<void> {
    this.logs = [];
    this.steps = [];
    this.isRunning = true;
    this.currentLine = 0;

    try {
      // Process the code to expand bracket notation
      const processedCode = this.processCode(code);
      this.codeLines = processedCode.split('\n').filter(line => line.trim() && !line.trim().startsWith('//'));
      
      this.addLog('🚀 Starting step-by-step execution...');
      onUpdate(this.gameState, this.logs, this.currentLine, this.codeLines);
      
      // Execute line by line with animation
      await this.executeStepByStep(processedCode, onUpdate);
      
      this.addLog('✅ Code execution completed successfully!');
      
      // Check win condition
      if (this.checkWinCondition()) {
        this.addLog('🎉 Level completed! Well done!');
        this.gameState.isComplete = true;
      }
      
    } catch (error) {
      this.addLog(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      this.gameState.gameOver = true;
    } finally {
      this.isRunning = false;
      this.currentLine = -1;
      onUpdate(this.gameState, this.logs, this.currentLine, this.codeLines);
    }
  }

  private async executeStepByStep(code: string, onUpdate: (state: GameState, logs: string[], currentLine?: number, codeLines?: string[]) => void): Promise<void> {
    const lines = code.split('\n');
    let executableLineIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines and comments
      if (!line || line.startsWith('//')) {
        continue;
      }

      // Update current line for highlighting
      this.currentLine = executableLineIndex;
      onUpdate(this.gameState, this.logs, this.currentLine, this.codeLines);
      
      // Increased delay for better visibility of highlighting (from 800ms to 1200ms)
      await this.delay(1200);
      
      // Execute the line
      await this.executeLine(line);
      
      // Update state after execution
      onUpdate(this.gameState, this.logs, this.currentLine, this.codeLines);
      
      // Check for game over
      if (this.gameState.gameOver || this.gameState.isComplete) {
        break;
      }
      
      executableLineIndex++;
      
      // Increased delay between commands for better visibility (from 400ms to 800ms)
      await this.delay(800);
    }
  }

  private async executeLine(line: string): Promise<void> {
    this.addLog(`🔄 Executing: ${line}`);
    
    try {
      // Create yourName API for this line
      const yourName = this.createHeroAPI();
      
      // Execute the single line
      const func = new Function('yourName', line);
      await func(yourName);
      
    } catch (error) {
      throw new Error(`Failed to execute "${line}": ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private processCode(code: string): string {
    // First, expand bracket notation
    const expandedCode = this.expandBracketNotation(code);
    return expandedCode;
  }

  private expandBracketNotation(code: string): string {
    const lines = code.split('\n');
    const expandedLines: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('//')) {
        expandedLines.push(line);
        continue;
      }

      // Check for bracket notation patterns:
      // yourName.moveRight(3) or yourName.moveRight[3] or yourName.moveRight(3);
      const bracketMatch = trimmedLine.match(/^(\s*)(yourName\.\w+)\s*[\(\[](\d+)[\)\]]\s*;?\s*$/);
      
      if (bracketMatch) {
        const [, indent, command, countStr] = bracketMatch;
        const count = parseInt(countStr, 10);
        
        // Validate count
        if (count > 0 && count <= 20) { // Limit to prevent infinite loops
          // Repeat the command the specified number of times
          for (let i = 0; i < count; i++) {
            expandedLines.push(`${indent}${command}();`);
          }
          
          this.addLog(`📝 Expanded: "${command}" repeated ${count} times`);
        } else {
          this.addLog(`⚠️ Invalid repeat count: ${count}. Using 1 instead.`);
          expandedLines.push(`${indent}${command}();`);
        }
      } else {
        // Keep the line as is, but ensure it ends with semicolon if it's a yourName command
        if (trimmedLine.includes('yourName.') && !trimmedLine.endsWith(';') && !trimmedLine.includes('(')) {
          expandedLines.push(line + '();');
        } else {
          expandedLines.push(line);
        }
      }
    }

    return expandedLines.join('\n');
  }

  private createHeroAPI() {
    return {
      moveRight: () => this.move(1, 0, 'right'),
      moveLeft: () => this.move(-1, 0, 'left'),
      moveUp: () => this.move(0, -1, 'up'),
      moveDown: () => this.move(0, 1, 'down'),
      attack: () => this.attack(),
      isEnemyNear: () => this.isEnemyNear(),
      distanceTo: (target: unknown) => this.distanceTo(target),
      say: (message: string) => this.say(message),
      spawnAngryPea: () => this.spawnAngryPea(),
      get health() { return this.gameState.character.health; },
      get gems() { return this.gameState.character.gems; },
      get hasKey() { return this.gameState.character.hasKey; },
      get position() { return { ...this.gameState.character.position }; }
    };
  }

  private move(dx: number, dy: number, direction: string): void {
    const newX = this.gameState.character.position.x + dx;
    const newY = this.gameState.character.position.y + dy;
    
    // Check bounds
    const level = this.getCurrentLevel();
    if (newX < 0 || newX >= level.gridSize.width || newY < 0 || newY >= level.gridSize.height) {
      this.addLog(`🚫 Cannot move ${direction} - outside the grid!`);
      return;
    }
    
    // Check for walls
    const isWall = this.gameState.obstacles.some(
      obs => obs.position.x === newX && obs.position.y === newY && obs.type === 'wall'
    );
    
    if (isWall) {
      this.addLog(`🧱 Cannot move ${direction} - wall blocking!`);
      return;
    }
    
    // Update position
    this.gameState.character.position = { x: newX, y: newY };
    this.gameState.moves++;
    
    this.addLog(`🚶 Moved ${direction} to (${newX}, ${newY})`);
    
    // Check for collectibles
    this.checkCollectibles(newX, newY);
    
    // Check for obstacles (damage)
    this.checkObstacles(newX, newY);
    
    // Update direction
    this.gameState.character.direction = direction as Character["direction"];
  }

  private attack(): void {
    const nearbyEnemies = this.getNearbyEnemies();
    
    if (nearbyEnemies.length === 0) {
      this.addLog('⚔️ No enemies nearby to attack!');
      return;
    }
    
    const enemy = nearbyEnemies[0];
    const damage = 25; // Hero damage
    enemy.health -= damage;
    
    this.addLog(`⚔️ Attacked ${enemy.type} for ${damage} damage!`);
    
    if (enemy.health <= 0) {
      enemy.isAlive = false;
      this.addLog(`💀 Defeated ${enemy.type}!`);
      this.gameState.score += enemy.type === 'dragon' ? 100 : enemy.type === 'orc' ? 50 : 30;
    } else {
      // Enemy attacks back
      this.gameState.character.health -= enemy.damage;
      this.addLog(`💥 ${enemy.type} attacks back for ${enemy.damage} damage!`);
      
      if (this.gameState.character.health <= 0) {
        this.addLog('💀 You have been defeated!');
        this.gameState.gameOver = true;
      }
    }
  }

  private isEnemyNear(): boolean {
    return this.getNearbyEnemies().length > 0;
  }

  private getNearbyEnemies(): Enemy[] {
    const { x, y } = this.gameState.character.position;
    return this.gameState.enemies.filter(enemy => {
      if (!enemy.isAlive) return false;
      const distance = Math.abs(enemy.position.x - x) + Math.abs(enemy.position.y - y);
      return distance === 1;
    });
  }

  private distanceTo(target: Position): number {
    const { x, y } = this.gameState.character.position;
    return Math.abs(target.x - x) + Math.abs(target.y - y);
  }

  private say(message: string): void {
    this.addLog(`💬 Hero says: "${message}"`);
  }

  private checkCollectibles(x: number, y: number): void {
    const collectible = this.gameState.collectibles.find(
      item => item.position.x === x && item.position.y === y && !item.collected
    );
    
    if (collectible) {
      collectible.collected = true;
      
      switch (collectible.type) {
        case 'gem':
          this.gameState.character.gems += collectible.value;
          this.gameState.score += collectible.value;
          this.addLog(`💎 Collected gem! +${collectible.value} gems`);
          break;
        case 'heart':
          this.gameState.character.health = Math.min(
            this.gameState.character.maxHealth,
            this.gameState.character.health + collectible.value
          );
          this.addLog(`❤️ Collected heart! +${collectible.value} health`);
          break;
        case 'key':
          this.gameState.character.hasKey = true;
          this.addLog('🗝️ Collected key! You can now exit.');
          break;
        case 'coin':
          this.gameState.score += collectible.value;
          this.addLog(`🪙 Collected coin! +${collectible.value} points`);
          break;
      }
    }
  }

  private checkObstacles(x: number, y: number): void {
    const obstacle = this.gameState.obstacles.find(
      obs => obs.position.x === x && obs.position.y === y && obs.type !== 'wall'
    );
    
    if (obstacle && obstacle.damage) {
      this.gameState.character.health -= obstacle.damage;
      this.addLog(`💥 Hit ${obstacle.type}! Lost ${obstacle.damage} health.`);
      
      if (this.gameState.character.health <= 0) {
        this.addLog('💀 You have been defeated by the environment!');
        this.gameState.gameOver = true;
      }
    }
  }

  private checkWinCondition(): boolean {
    const { x, y } = this.gameState.character.position;
    const { exit } = this.gameState;
    
    if (x === exit.x && y === exit.y) {
      if (this.gameState.character.hasKey || !this.hasKeyRequirement()) {
        return true;
      } else {
        this.addLog('🚪 You need a key to exit!');
        return false;
      }
    }
    
    return false;
  }

  private hasKeyRequirement(): boolean {
    return this.gameState.collectibles.some(item => item.type === 'key');
  }

  private getCurrentLevel() {
    // This would normally come from the level data
    return {
      gridSize: { width: 12, height: 10 }
    };
  }

  private addLog(message: string): void {
    this.logs.push(`[${new Date().toLocaleTimeString()}] ${message}`);
  }

  private spawnAngryPea(): void {
    const { x, y } = this.gameState.character.position;
    
    // Define possible spawn positions around the character
    const spawnPositions = [
      { x: x + 1, y: y },
      { x: x - 1, y: y },
      { x: x, y: y + 1 },
      { x: x, y: y - 1 }
    ];
    
    // Filter valid positions (not walls, not occupied)
    const validPositions = spawnPositions.filter(pos => {
      // Check bounds
      const level = this.getCurrentLevel();
      if (pos.x < 0 || pos.x >= level.gridSize.width || pos.y < 0 || pos.y >= level.gridSize.height) {
        return false;
      }
      
      // Check for walls
      const isWall = this.gameState.obstacles.some(
        obs => obs.position.x === pos.x && obs.position.y === pos.y && obs.type === 'wall'
      );
      if (isWall) return false;
      
      // Check for enemies
      const hasEnemy = this.gameState.enemies.some(
        enemy => enemy.position.x === pos.x && enemy.position.y === pos.y && enemy.isAlive
      );
      if (hasEnemy) return false;
      
      return true;
    });
    
    if (validPositions.length > 0) {
      // Choose a random valid position
      const spawnPos = validPositions[Math.floor(Math.random() * validPositions.length)];
      
      // Create a new angrypea enemy
      const newEnemy: Enemy = {
        id: `angrypea_${Date.now()}`,
        type: 'grunt', // Using 'grunt' type as it's in the Enemy interface
        position: { ...spawnPos },
        health: 15,
        maxHealth: 15,
        damage: 5,
        isAlive: true,
        speed: 1,
        behavior: 'chase',
      };
      
      // Add to game state
      this.gameState.enemies.push(newEnemy);
      this.addLog(`🌱 An angry pea spawned next to you at (${spawnPos.x}, ${spawnPos.y})!`);
    } else {
      this.addLog('❌ No valid position to spawn an angry pea!');
    }
  }
}