# Aki175.github.io

BIT CS Test:

This project is a procedural terrain generator built with p5.js that uses
Perlin noise to simulate natural landscapes. It also features an A*
pathfinding algorithm to navigate between  2 points selected by the users.

For this project, i used some resources. For the p5.js I used a github as basis
and tweaked it: https://github.com/RachelfTech/procedural-terrain-generation

Other resources:
https://p5js.org/reference/
https://en.wikipedia.org/wiki/A*_search_algorithm
https://www.youtube.com/watch?v=-L-WgKMFuhE&t=375s

Features:
* Terrain generator. Using perlin noises for smooth realistic terrains. I made
    various landscapes: Hills, water, mountains, ice, snow and grass.

* COntrols:
    Adjustable temperature and rainfall, which changes the enviroment.
    Or it can randomize.

* Pathfinding:
    Click two points on the canvas to find a path using A* search. It is not optimized so 
    it can be a bit slow. Considers terrain costs for different terrains.
    If water becomes Ice then ice is walkable, if it water then not.

    here is the cost grid:
    Ice: 1
    grass : 1
    Mountain : 5
    snow : 4
    water : ∞
    hill : 3
    sand: 2

* Navigation:
    Arrow keys move the map.


search https://aki175.github.io/ to see the project.

or host it local the files.