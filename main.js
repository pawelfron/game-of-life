const BOARD_HEIGHT = 50;
const BOARD_WIDTH = 50;

const directions = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1]
];
let state = Array.from(
    {length: BOARD_WIDTH},
    () => Array.from({length: BOARD_HEIGHT}, () => false)
);
let stopped = true;
let intervalId;

const board = document.getElementById('board');
for (let i = 0; i < BOARD_WIDTH * BOARD_HEIGHT; i++) {
    const cell = document.createElement('div');
    cell.addEventListener('click', ({ target }) => {
        const x = i % BOARD_WIDTH;
        const y = Math.floor(i / BOARD_WIDTH);
        state[x][y] = !target.classList.contains('alive');
        target.classList.toggle('alive');
    })
    board.appendChild(cell);
}
const cells = document.querySelectorAll('#board div');

const isValid = (x, y) => x >= 0 && y >= 0 && x < BOARD_WIDTH && y < BOARD_HEIGHT;

const countNeighbours = (x, y) => {
    let livingNeighbours = 0;
    for (const [xOffset, yOffset] of directions) {
        const newX = x + xOffset;
        const newY = y + yOffset;
        if (isValid(newX, newY) && state[newX][newY])
            livingNeighbours++;
    }
    return livingNeighbours;
}

const render = () => {
    for (let x = 0; x < BOARD_WIDTH; x++) {
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            if (state[x][y])
                cells[y * BOARD_WIDTH + x].classList.add('alive');
            else
                cells[y * BOARD_WIDTH + x].classList.remove('alive');
        }
    }
};

const update = () => {
    const newState = Array.from(
        {length: BOARD_WIDTH},
        () => Array.from({length: BOARD_HEIGHT}, () => false)
    );

    for (let x = 0; x < BOARD_WIDTH; x++) {
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            const livingNeighbours = countNeighbours(x, y);
            if (state[x][y] && (livingNeighbours == 2 || livingNeighbours == 3))
                newState[x][y] = true;
            else if (!state[x][y] && livingNeighbours == 3)
                newState[x][y] = true;
        }
    }

    state = newState;
    render();
};

const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const nextButton = document.getElementById('next');

nextButton.addEventListener('click', update);
startButton.addEventListener('click', () => {
    stopped = false;
    startButton.classList.add('hidden');
    stopButton.classList.remove('hidden');
    nextButton.classList.add('hidden');
    intervalId = setInterval(update, 500);
});
stopButton.addEventListener('click', () => {
    stopped = true;
    startButton.classList.remove('hidden');
    stopButton.classList.add('hidden');
    nextButton.classList.remove('hidden');
    clearInterval(intervalId);
});