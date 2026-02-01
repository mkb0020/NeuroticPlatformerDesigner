// ============================================================
// MAKEOVER MODULE
// Handles JSON transformation and ZIP file creation
// ============================================================

function convertLevel(level) {
  const result = {
    GroundSegments: [],
    platforms: []
  };
  
  if (level.firstGroundEnd !== undefined) {
    result.GroundSegments.push({
      x: 0,
      y: 440,
      width: parseFloat(level.firstGroundEnd),
      height: 50
    });
  }
  
  if (level.gauntlets && Array.isArray(level.gauntlets)) {
    level.gauntlets.forEach(gauntlet => {
      if (gauntlet.nextGroundSegmentStartX !== undefined) {
        result.GroundSegments.push({
          x: parseFloat(gauntlet.nextGroundSegmentStartX),
          y: 440,
          width: level.groundSegmentLength || 1500,
          height: 50
        });
      }
    });
  }
  
  if (level.gauntlets && Array.isArray(level.gauntlets)) {
    level.gauntlets.forEach(gauntlet => {
      if (gauntlet.platforms && Array.isArray(gauntlet.platforms)) {
        gauntlet.platforms.forEach(platform => {
          result.platforms.push({
            x: parseFloat(platform.startX),
            y: parseFloat(platform.y),
            w: level.platformWidth,
            h: 20
          });
        });
      }
    });
  }
  
  return result;
}

function convertAllLevels(data) {
  const convertedLevels = [];
  
  if (!data.levels || !Array.isArray(data.levels)) {
    console.error('Invalid data format: No levels array found');
    return convertedLevels;
  }
  
  data.levels.forEach(level => {
    const converted = convertLevel(level);
    convertedLevels.push({
      levelNumber: level.level,
      data: converted
    });
  });
  
  return convertedLevels;
}

window.downloadMakeoverZip = async function() {
  if (!window.calculationResult) {
    alert('Please calculate levels first!');
    return;
  }
  
  try {
    const convertedLevels = convertAllLevels(window.calculationResult);
    
    if (convertedLevels.length === 0) {
      alert('No levels to convert!');
      return;
    }
    
    const zip = new JSZip();
    
    convertedLevels.forEach(level => {
      const jsonString = JSON.stringify(level.data, null, 2);
      zip.file(`reformatted-level${level.levelNumber}.json`, jsonString);
    });
    
    const content = await zip.generateAsync({type: 'blob'});
    
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reformatted-levels.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
  } catch (error) {
    alert('ERROR CREATING ZIP: ' + error.message);
    console.error(error);
  }
};

export { convertLevel, convertAllLevels };