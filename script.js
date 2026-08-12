const IMAGE_URL = 'FB_IMG_1786506435544.jpg'; 
const board = document.getElementById('board');
const bgm = document.getElementById('bgm');
const winModal = document.getElementById('win-modal');
let pieces = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let draggedIndex = null;
let musicStarted = false;

function initGame() {
    winModal.classList.add('hidden');
    do { pieces.sort(() => Math.random() - 0.5); } while (isComplete());
    renderBoard();
}

function renderBoard() {
    board.innerHTML = '';
    pieces.forEach((correctPos, currentIndex) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.dataset.index = currentIndex;
        const x = (correctPos % 3) * (280 / 3);
        const y = Math.floor(correctPos / 3) * (280 / 3);
        tile.style.backgroundImage = `url('${IMAGE_URL}')`;
        tile.style.backgroundPosition = `-${x}px -${y}px`;
        tile.draggable = true;
        tile.addEventListener('dragstart', handleDragStart);
        tile.addEventListener('dragover', (e) => e.preventDefault());
        tile.addEventListener('drop', handleDrop);
        tile.addEventListener('touchstart', handleTouchStart, { passive: false });
        tile.addEventListener('touchend', handleTouchEnd);
        board.appendChild(tile);
    });
}

function startAudio() {
    if (!musicStarted && bgm) { bgm.play().catch(() => {}); musicStarted = true; }
}

function handleDragStart(e) { startAudio(); draggedIndex = parseInt(e.target.dataset.index); }
function handleDrop(e) { e.preventDefault(); swapPieces(draggedIndex, parseInt(e.target.dataset.index)); }

let touchStartIndex = null;
function handleTouchStart(e) { startAudio(); touchStartIndex = parseInt(e.currentTarget.dataset.index); }
function handleTouchEnd(e) {
    const touch = e.changedTouches[0];
    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    if (targetElement && targetElement.classList.contains('tile')) {
        const touchEndIndex = parseInt(targetElement.dataset.index);
        if (touchStartIndex !== null && touchStartIndex !== touchEndIndex) { swapPieces(touchStartIndex, touchEndIndex); }
    }
    touchStartIndex = null;
}

function swapPieces(fromIndex, toIndex) {
    if (fromIndex === null || toIndex === null || isNaN(fromIndex) || isNaN(toIndex)) return;
    const temp = pieces[fromIndex];
    pieces[fromIndex] = pieces[toIndex];
    pieces[toIndex] = temp;
    renderBoard();
    if (isComplete()) { setTimeout(() => { winModal.classList.remove('hidden'); }, 200); }
}

function isComplete() { return pieces.every((val, index) => val === index); }
function restartGame() { initGame(); }
initGame();
