class TerrainType {
  constructor(minHeight, maxHeight, minColor, maxColor) {
    this.minHeight = minHeight;
    this.maxHeight = maxHeight;
    this.minColor = minColor;
    this.maxColor = maxColor;
    // An adjustment to the color lerp for the map type, this weighs the color
    // towards the min or max color.
  }
}

let icyterrain;
let waterTerrain;
let sandTerrain;
let grassTerrain;
let hillTerrain
let mountainTerrain;
let snowyTerrain;

let markers = [];

let zoomFactor = 100;
let mapChanged = true;
// The x and y offset need to be large because Perlin noise mirrors around 0.
let xOffset = 10000;
let yOffset = 10000;

function setup() {
  createCanvas(600, 600);

  // Adjusts the level of detail created by the Perlin noise by layering
  // multiple versions of it together.
  noiseDetail(8, 0.5);

  icyterrain = new TerrainType(
    0, 0.4,
    color(80, 160, 200), color(180, 220, 255)
  );

  waterTerrain = new TerrainType(
    0.0, 0.4,
    color(0, 51, 102), color(30, 176, 251)
  );

  sandTerrain = new TerrainType(
    0.4, 0.45,
    color(194, 178, 128), color(255, 246, 193),
  );

  grassTerrain = new TerrainType(
    0.45, 0.65,
    color(34, 139, 34), color(118, 239, 124)
  );

  hillTerrain = new TerrainType(
    0.65, 0.7,
    color(70, 110, 70), color(101, 160, 100)
  );

  mountainTerrain = new TerrainType(
    0.7, 0.8,
    color(100, 100, 100), color(160, 160, 160)
  );

  snowyTerrain = new TerrainType(
    0.80, 1.0,
    color(180, 220, 255), color(255, 255, 255),
  );

}

function draw() {
  if (keyIsDown(RIGHT_ARROW)) {
    xOffset += 1 / zoomFactor;
    mapChanged = true;
  }
  if (keyIsDown(LEFT_ARROW)) {
    xOffset -= 1 / zoomFactor;
    mapChanged = true;
  }
  if (keyIsDown(UP_ARROW)) {
    yOffset -= 1 / zoomFactor;
    mapChanged = true;
  }
  if (keyIsDown(DOWN_ARROW)) {
    yOffset += 1 / zoomFactor;
    mapChanged = true;
  }

  // We only need to re-draw the canvas if the map has changed.
  if (!mapChanged) {
    return;
  }

  for (x = 0; x < width; x++) {
    for (y = 0; y < height; y++) {
      // Set xVal and yVal for the noise such that the map is centered around
      // the center of the canvas. Adding x and y offset values allows us to
      // move around the noise with the arrow keys.
      const xVal = (x - width / 2) / zoomFactor + xOffset;
      const yVal = (y - height / 2) / zoomFactor + yOffset;
      const noiseValue = noise(xVal, yVal);

      updateTerrainThresholds();

      let terrainColor;
      // Compare the current noise value to each mapType max height and get the
      // terrain color accordingly. For easier extendability and less code 
      // repetition you could store the terrain types in an array and iterate
      // over it with a for loop checking for maxHeight. For this example I just
      // wanted to keep it simple and similar to previous versions.
      if (noiseValue < waterTerrain.maxHeight) {
        terrainColor = getTerrainColor(noiseValue, waterTerrain);
      } else if (noiseValue < icyterrain.maxHeight) {
        terrainColor = getTerrainColor(noiseValue, icyterrain);
      } else if (noiseValue < sandTerrain.maxHeight) {
        terrainColor = getTerrainColor(noiseValue, sandTerrain);
      } else if (noiseValue < grassTerrain.maxHeight) {
        terrainColor = getTerrainColor(noiseValue, grassTerrain);
      } else if (noiseValue < hillTerrain.maxHeight) {
        terrainColor = getTerrainColor(noiseValue, hillTerrain);
      } else if (noiseValue < mountainTerrain.maxHeight) {
          terrainColor = getTerrainColor(noiseValue, mountainTerrain);
      } else {
        terrainColor = getTerrainColor(noiseValue, snowyTerrain);
      }
      set(x, y, terrainColor);
    }
  }
  updatePixels();
  for (let m of markers) {
    stroke(255, 0, 0);
    strokeWeight(4);
    line(m.x - 5, m.y - 5, m.x + 5, m.y + 5);
    line(m.x - 5, m.y + 5, m.x + 5, m.y - 5);
  }

  mapChanged = false;
}

function getTerrainColor(noiseValue, mapType) {
  // Given a noise value, normalize to to be between 0 to 1 representing how
  // close it is to the min or max height for the given terrain type.
  const normalized =
    normalize(noiseValue, mapType.maxHeight, mapType.minHeight);
  // Blend between the min and max height colors based on the normalized
  // noise value.
  return lerpColor(mapType.minColor, mapType.maxColor,
    normalized);
}

// Return a number between 0 and 1 between max and min based on value.
function normalize(value, max, min) {
  if (value > max) {
    return 1;
  }
  if (value < min) {
    return 0;
  }
  return (value - min) / (max - min);
}

let temperature = 0;
let rainfall = 50;

function updateTemperature(value) {
  temperature = value;
  document.getElementById('tempValue').innerText = value + '°C';
  mapChanged = true;
}

function updateRain(value) {
  rainfall = value;
  document.getElementById('rainValue').innerText = value + '%';
  mapChanged = true;
}

function randomizeEnvironment() {
  const temp = Math.floor(Math.random() * 21) - 20;
  const rain = Math.floor(Math.random() * 101);
  document.getElementById('temperature').value = temp;
  document.getElementById('rain').value = rain;
  updateTemperature(temp);
  updateRain(rain);
}

function updateTerrainThresholds() {
  if (temperature < 0) {
    icyterrain.minHeight = map(temperature, -20, 0, 0, 0.4);
    waterTerrain.maxHeight = icyterrain.minHeight;

    snowyTerrain.minHeight = map(temperature, -20, 0, 0.65, 0.8);
    mountainTerrain.maxHeight = snowyTerrain.minHeight;
  } else {
    icyterrain.minHeight = 0;
    waterTerrain.maxHeight = 0.4;

    snowyTerrain.minHeight = 0.8;
    mountainTerrain.maxHeight = 0.8;
  }

  sandTerrain.maxHeight = map(rainfall, 0, 100, 0.45, 0.4);
  grassTerrain.minHeight = sandTerrain.maxHeight;
}

function generateMap() {
  xOffset = 10000 + Math.random() * 10000;
  yOffset = 10000 + Math.random() * 10000;
  markers = []
  mapChanged = true;
} 


function mousePressed() {
    if (
      mouseX >= 0 && mouseX < width &&
      mouseY >= 0 && mouseY < height
    ) {
      if (markers.length < 2) {
        markers.push({ x: mouseX, y: mouseY });
        mapChanged = true;
      } else {
        markers.shift();
        markers.push({ x: mouseX, y: mouseY });
        mapChanged = true;
      }
    }
}

function getTerrainCost(noiseValue) {
  if (noiseValue < waterTerrain.maxHeight) return Infinity;
  else if (noiseValue < icyterrain.maxHeight) return 1;
  else if (noiseValue < sandTerrain.maxHeight) return 2;
  else if (noiseValue < grassTerrain.maxHeight) return 1;
  else if (noiseValue < hillTerrain.maxHeight) return 3;
  else if (noiseValue < mountainTerrain.maxHeight) return 5;
  else return 4;
}


function routeFinder() {
  if (markers.length < 2) return;

  const start = {
    x: Math.floor(markers[0].x),
    y: Math.floor(markers[0].y)
  };
  const goal = {
    x: Math.floor(markers[1].x),
    y: Math.floor(markers[1].y)
  };

  const costGrid = [];
  for (let x = 0; x < width; x++) {
    costGrid[x] = [];
    for (let y = 0; y < height; y++) {
      const xVal = (x - width / 2) / zoomFactor + xOffset;
      const yVal = (y - height / 2) / zoomFactor + yOffset;
      const noiseValue = noise(xVal, yVal);
      costGrid[x][y] = getTerrainCost(noiseValue);
    }
  }

  const openSet = [];
  const closedSet = new Set();
  const cameFrom = {};
  const gScore = {};
  const fScore = {};

  function nodeKey(x, y) {
    return `${x},${y}`;
  }

  gScore[nodeKey(start.x, start.y)] = 0;
  fScore[nodeKey(start.x, start.y)] = heuristic(start, goal);
  openSet.push({ x: start.x, y: start.y, f: fScore[nodeKey(start.x, start.y)] });

  const neighbors = [
    [1, 0], [0, 1], [-1, 0], [0, -1],
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ];

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();
    const currentKey = nodeKey(current.x, current.y);
    closedSet.add(currentKey);

    if (current.x === goal.x && current.y === goal.y) {
      const path = reconstructPath(cameFrom, current, nodeKey);
      console.log("path found!")
      drawPath(path);
      return;
    }

    for (const [dx, dy] of neighbors) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      const neighborKey = nodeKey(nx, ny);

      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      if (!isFinite(costGrid[nx][ny])) continue;
      if (closedSet.has(neighborKey)) continue;

      const tentativeG = gScore[currentKey] + costGrid[nx][ny];
      if (tentativeG < (gScore[neighborKey] ?? Infinity)) {
        cameFrom[neighborKey] = current;
        gScore[neighborKey] = tentativeG;
        fScore[neighborKey] = tentativeG + heuristic({ x: nx, y: ny }, goal);

        if (!openSet.some(n => n.x === nx && n.y === ny)) {
          openSet.push({ x: nx, y: ny, f: fScore[neighborKey] });
        }
      }
    }
  }

  console.log("No path found!");
}

function heuristic(a, b) {
  return dist(a.x, a.y, b.x, b.y);
}

function reconstructPath(cameFrom, current, nodeKey) {
  const path = [];
  let key = nodeKey(current.x, current.y);
  while (cameFrom[key]) {
    path.push({ x: current.x, y: current.y });
    current = cameFrom[key];
    key = nodeKey(current.x, current.y);
  }
  path.push({ x: current.x, y: current.y });
  return path.reverse();
}

function drawPath(path) {
  stroke(255, 0, 0);
  strokeWeight(2);
  drawingContext.setLineDash([10, 5]);
  noFill();
  beginShape();
  for (const p of path) {
    vertex(p.x, p.y);
  }
  endShape();
  drawingContext.setLineDash([]);
}