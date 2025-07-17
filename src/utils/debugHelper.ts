/**
 * Debug helper to inspect animation data structure from Supabase
 */

/**
 * Analyzes an animation object to determine its structure
 */
export const analyzeAnimationStructure = (animation: any): string => {
  if (!animation) return 'Animation is undefined or null';
  
  const structure: string[] = [];
  
  // Check for the animations property (old structure)
  if (animation.animations) {
    structure.push('Has "animations" property (old structure)');
    const actions = Object.keys(animation.animations);
    structure.push(`Actions in animations: ${actions.join(', ')}`);
    
    // Check first action structure
    if (actions.length > 0) {
      const firstAction = actions[0];
      const directions = Object.keys(animation.animations[firstAction] || {});
      structure.push(`Directions in ${firstAction}: ${directions.join(', ')}`);
      
      // Check frame structure for first direction
      if (directions.length > 0) {
        const firstDirection = directions[0];
        const frames = animation.animations[firstAction][firstDirection];
        structure.push(`${firstAction}.${firstDirection} has ${frames?.length || 0} frames`);
        if (frames?.length > 0) {
          structure.push(`First frame type: ${typeof frames[0]}`);
          structure.push(`First frame value: ${frames[0]}`);
        }
      }
    }
  }
  
  // Check for direct action properties (new structure)
  const possibleActions = ['Idle', 'Walk', 'Run', 'Attack', 'Hurt', 'Die', 'Interact', 'Guard', 'Punch', 'Dance'];
  const foundActions = possibleActions.filter(action => animation[action]);
  
  if (foundActions.length > 0) {
    structure.push(`Has direct action properties: ${foundActions.join(', ')}`);
    
    // Check first action structure
    const firstAction = foundActions[0];
    const directions = Object.keys(animation[firstAction] || {});
    structure.push(`Directions in ${firstAction}: ${directions.join(', ')}`);
    
    // Check frame structure for first direction
    if (directions.length > 0) {
      const firstDirection = directions[0];
      const frames = animation[firstAction][firstDirection];
      structure.push(`${firstAction}.${firstDirection} has ${frames?.length || 0} frames`);
      if (frames?.length > 0) {
        structure.push(`First frame type: ${typeof frames[0]}`);
        structure.push(`First frame value: ${frames[0]}`);
      }
    }
  }
  
  // Check for lowercase action properties
  const lowercaseActions = ['idle', 'walk', 'run', 'attack', 'hurt', 'die', 'interact', 'guard', 'punch', 'dance'];
  const foundLowercaseActions = lowercaseActions.filter(action => animation[action]);
  
  if (foundLowercaseActions.length > 0) {
    structure.push(`Has lowercase action properties: ${foundLowercaseActions.join(', ')}`);
    
    // Check first action structure
    const firstAction = foundLowercaseActions[0];
    const directions = Object.keys(animation[firstAction] || {});
    structure.push(`Directions in ${firstAction}: ${directions.join(', ')}`);
    
    // Check frame structure for first direction
    if (directions.length > 0) {
      const firstDirection = directions[0];
      const frames = animation[firstAction][firstDirection];
      structure.push(`${firstAction}.${firstDirection} has ${frames?.length || 0} frames`);
      if (frames?.length > 0) {
        structure.push(`First frame type: ${typeof frames[0]}`);
        structure.push(`First frame value: ${frames[0]}`);
      }
    }
  }
  
  return structure.join('\n');
}; 