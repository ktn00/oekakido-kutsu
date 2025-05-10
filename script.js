const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

let drawing = false;
let lastX = 0;
let lastY = 0;
const history = [];
let historyStep = 0;

canvas.width = 800;
canvas.height = 600;

ctx.strokeStyle = 'black';
ctx.lineWidth = 2;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

function saveHistory() {
    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    historyStep = history.length - 1;
    if (history.length > 50) {
        history.shift();
        historyStep--;
    }
}

function restoreHistory() {
    if (historyStep >= 0) {
        ctx.putImageData(history[historyStep], 0, 0);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
    e.preventDefault();
});

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    lastX = e.offsetX;
    lastY = e.offsetY;
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
    saveHistory();
});

canvas.addEventListener('mouseout', () => {
    drawing = false;
});

canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
        drawing = true;
        lastX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
        lastY = e.touches[0].clientY - canvas.getBoundingClientRect().top;
        e.preventDefault();
    }
});

canvas.addEventListener('touchmove', (e) => {
    if (!drawing || e.touches.length === 0) return;
    const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    const touchY = e.touches[0].clientY - canvas.getBoundingClientRect().top;
    draw(touchX, touchY);
    e.preventDefault();
});

canvas.addEventListener('touchend', () => {
    drawing = false;
    saveHistory();
});

canvas.addEventListener('touchcancel', () => {
    drawing = false;
});

function draw(x, y) {
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastX = x;
    lastY = y;
}

undoButton.addEventListener('click', () => {
    if (historyStep > 0) {
        historyStep--;
        restoreHistory();
    }
});

saveHistory();
restoreHistory();
