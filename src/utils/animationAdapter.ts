/**
 * Adapter utilities to convert between different animation data formats
 */

/**
 * Converts Supabase animation data to the format expected by AnimatedCharacter component
 */
export const adaptSupabaseAnimation = (animation: any): any => {
  if (!animation) return null;
  
  // Create a new object for the adapted animation
  const adapted: any = {};
  
  // Helper to convert direction keys
  const convertDirectionKey = (key: string): string => {
    switch (key.toLowerCase()) {
      case 'n': return 'up';
      case 's': return 'down';
      case 'e': return 'right';
      case 'w': return 'left';
      // For now, map diagonal directions to their closest cardinal direction
      case 'ne': return 'up';
      case 'nw': return 'up';
      case 'se': return 'down';
      case 'sw': return 'down';
      default: return key;
    }
  };
  
  // Helper to convert action keys
  const convertActionKey = (key: string): string => {
    // Convert to lowercase for consistency
    return key.toLowerCase();
  };
  
  // Process animations from the old structure (animations property)
  if (animation.animations) {
    Object.keys(animation.animations).forEach(action => {
      const actionKey = convertActionKey(action);
      adapted[actionKey] = {};
      
      Object.keys(animation.animations[action]).forEach(direction => {
        const directionKey = convertDirectionKey(direction);
        adapted[actionKey][directionKey] = animation.animations[action][direction];
      });
    });
  }
  
  // Process animations from the new structure (direct action properties)
  const possibleActions = ['Idle', 'Walk', 'Run', 'Attack', 'Hurt', 'Die', 'Interact', 'Guard', 'Punch', 'Dance'];
  possibleActions.forEach(action => {
    if (animation[action]) {
      const actionKey = convertActionKey(action);
      adapted[actionKey] = adapted[actionKey] || {};
      
      Object.keys(animation[action]).forEach(direction => {
        const directionKey = convertDirectionKey(direction);
        adapted[actionKey][directionKey] = animation[action][direction];
      });
    }
  });
  
  // Also check for lowercase action properties
  const lowercaseActions = ['idle', 'walk', 'run', 'attack', 'hurt', 'die', 'interact', 'guard', 'punch', 'dance'];
  lowercaseActions.forEach(action => {
    if (animation[action]) {
      adapted[action] = adapted[action] || {};
      
      Object.keys(animation[action]).forEach(direction => {
        const directionKey = convertDirectionKey(direction);
        adapted[action][directionKey] = animation[action][direction];
      });
    }
  });
  
  console.log('Original animation:', animation);
  console.log('Adapted animation:', adapted);
  
  return adapted;
}; 