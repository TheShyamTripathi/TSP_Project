const cities = new Map();  // Store cities and their positions
const paths = [];  // Store connections between cities
const canvas = document.getElementById("tspCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 400;

document.getElementById("cityForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const city1 = document.getElementById("city1").value;
    const city2 = document.getElementById("city2").value;
    const distance = parseFloat(document.getElementById("distance").value);
    
    if (city1 && city2 && !isNaN(distance)) {
        if (!cities.has(city1)) cities.set(city1, randomPosition());
        if (!cities.has(city2)) cities.set(city2, randomPosition());

        paths.push({ city1, city2, distance });
        drawGraph();
    }
    
    this.reset();
});

document.getElementById("solveTSP").addEventListener("click", function() {
    if (paths.length < 2) {
        alert("Please add at least two connections.");
        return;
    }
    const tour = solveTSP();
    drawTour(tour);
});

document.getElementById("clearCanvas").addEventListener("click", function() {
    cities.clear();
    paths.length = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "red";
    paths.forEach(({ city1, city2, distance }) => {
        const { x: x1, y: y1 } = cities.get(city1);
        const { x: x2, y: y2 } = cities.get(city2);
        
        // Draw edges
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        // Draw distance label
        ctx.fillStyle = "black";
        ctx.fillText(distance, (x1 + x2) / 2, (y1 + y2) / 2);
    });

    // Draw cities
    ctx.fillStyle = "red";
    cities.forEach(({ x, y }, name) => {
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText(name, x + 10, y);
    });
}

function drawTour(tour) {
    drawGraph();
    
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cities.get(tour[0]).x, cities.get(tour[0]).y);

    tour.forEach(city => {
        const { x, y } = cities.get(city);
        ctx.lineTo(x, y);
    });
    
    ctx.lineTo(cities.get(tour[0]).x, cities.get(tour[0]).y); // Complete cycle
    ctx.stroke();
}

function solveTSP() {
    const cityList = Array.from(cities.keys());
    if (cityList.length < 2) return [];

    let unvisited = new Set(cityList);
    let tour = [cityList[0]];
    unvisited.delete(cityList[0]);

    while (unvisited.size) {
        let lastCity = tour[tour.length - 1];
        let nearest = findNearestCity(lastCity, unvisited);
        tour.push(nearest);
        unvisited.delete(nearest);
    }

    return tour;
}

function findNearestCity(fromCity, unvisited) {
    let nearestCity = null;
    let minDistance = Infinity;

    paths.forEach(({ city1, city2, distance }) => {
        if ((city1 === fromCity && unvisited.has(city2)) || (city2 === fromCity && unvisited.has(city1))) {
            if (distance < minDistance) {
                minDistance = distance;
                nearestCity = city1 === fromCity ? city2 : city1;
            }
        }
    });

    return nearestCity;
}

// Generate random positions for cities
function randomPosition() {
    return { x: Math.random() * (canvas.width - 50) + 25, y: Math.random() * (canvas.height - 50) + 25 };
}
