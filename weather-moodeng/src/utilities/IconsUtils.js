// Import all icons from the directory
const allWeatherIcons = import.meta.glob('../assets/icons/*.png', { eager: true });

export function weatherIcon(imageName) {
  // Construct the path to match the keys in `allWeatherIcons`
  const formattedName = `../assets/icons/${imageName}`;
  
  // Return the matching icon or null if not found
  return allWeatherIcons[formattedName]?.default || allWeatherIcons[formattedName] || null;
}