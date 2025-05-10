const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const undoButton = document.getElementById('undoButton');
const penButton = document.getElementById('penButton');
const eraserButton = document.getElementById('eraserButton');
const lineWidthSlider = document.getElementById('lineWidth');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
const drawingHistory = [];
let historyStep = 0;
let isErasingMode = false;
const defaultPenColor = 'black';

let penWidth = 3;
let eraserWidth = 10;

canvas.width = 800;
canvas.height = 600;

ctx.strokeStyle = defaultPenColor;
ctx.lineWidth = penWidth;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

function saveDrawingHistory() {
    drawingHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    historyStep = drawingHistory.length - 1;
    if (drawingHistory.length > 50) {
        drawingHistory.shift();
        historyStep--;
    }
}

function restoreDrawingHistory() {
    if (historyStep >= 0) {
        ctx.putImageData(drawingHistory[historyStep], 0, 0);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function startDrawing(e) {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
    e.preventDefault();
}

function moveDrawing(e) {
    if (!isDrawing) return;
    const currentX = e.offsetX;
    const currentY = e.offsetY;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    lastX = currentX;
    lastY = currentY;
}

function stopDrawing() {
    isDrawing = false;
    saveDrawingHistory();
}

function handleTouchStart(e) {
    if (e.touches.length > 0) {
        isDrawing = true;
        lastX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
        lastY = e.touches[0].clientY - canvas.getBoundingClientRect().top;
        e.preventDefault();
    }
}

function handleTouchMove(e) {
    if (!isDrawing || e.touches.length === 0) return;
    const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    const touchY = e.touches[0].clientY - canvas.getBoundingClientRect().top;
    draw(touchX, touchY);
    e.preventDefault();
}

function draw(x, y) {
    ctx.lineWidth = lineWidthSlider.value;
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
        restoreDrawingHistory();
    }
});

penButton.addEventListener('click', () => {
    isErasingMode = false;
    ctx.strokeStyle = defaultPenColor;
    ctx.lineWidth = penWidth;
    lineWidthSlider.value = penWidth;
    penButton.classList.add('active');
    eraserButton.classList.remove('active');
});

eraserButton.addEventListener('click', () => {
    isErasingMode = true;
    ctx.strokeStyle = getComputedStyle(canvas).backgroundColor;
    ctx.lineWidth = eraserWidth;
    lineWidthSlider.value = eraserWidth;
    eraserButton.classList.add('active');
    penButton.classList.remove('active');
});

lineWidthSlider.addEventListener('input', () => {
    const newLineWidth = parseInt(lineWidthSlider.value);
    if (isErasingMode) {
        eraserWidth = newLineWidth;
    } else {
        penWidth = newLineWidth;
    }
    ctx.lineWidth = newLineWidth;
});

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', moveDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchcancel', stopDrawing);

penButton.classList.add('active');
saveDrawingHistory();
restoreDrawingHistory();
