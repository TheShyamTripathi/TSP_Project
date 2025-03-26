// script.js
let cities = [];

function addCity() {
    let name = document.getElementById("cityName").value;
    let x = parseFloat(document.getElementById("xCoord").value);
    let y = parseFloat(document.getElementById("yCoord").value);
    cities.push({ name, x, y });
    document.getElementById("cityName").value = "";
    document.getElementById("xCoord").value = "";
    document.getElementById("yCoord").value = "";
    drawCities();
}

function drawCities() {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.font = "14px Arial";
    cities.forEach(city => {
        ctx.beginPath();
        ctx.arc(city.x, city.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText(city.name, city.x + 8, city.y - 8);
    });
}

async function solveTSP() {
    let response = await fetch("http://localhost:3000/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cities)
    });
    let result = await response.json();
    drawPath(result[0]);
}

function drawPath(path) {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.lineTo(path[0].x, path[0].y);
    ctx.stroke();
}
