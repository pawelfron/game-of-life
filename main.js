const BOARD_HEIGHT = 50;
const BOARD_WIDTH = 50;
const DIRECTIONS = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1]
];

let state = Array.from(
    {length: BOARD_WIDTH},
    () => Array.from({length: BOARD_HEIGHT}, () => false)
);
let stopped = true;
let setupPhase = true;
let intervalId;
let generation = 1;

const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const nextButton = document.getElementById('next');
const resetButton = document.getElementById('reset');
const generationText = document.getElementById('generation');

const board = document.getElementById('board');
for (let i = 0; i < BOARD_WIDTH * BOARD_HEIGHT; i++) {
    const cell = document.createElement('div');
    board.appendChild(cell);
}
const cells = document.querySelectorAll('#board div');

const manualFill = event => event.target.classList.toggle('alive');;

const endSetupPhase = () => {
    for (const cell of cells)
        cell.removeEventListener('click', manualFill);

    for (let x = 0; x < BOARD_WIDTH; x++) {
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            const i = y * BOARD_WIDTH + x
            state[x][y] = cells[i].classList.contains('alive');
        }
    }
}

const isValid = (x, y) => x >= 0 && y >= 0 && x < BOARD_WIDTH && y < BOARD_HEIGHT;

const countNeighbours = (x, y) => {
    let livingNeighbours = 0;
    for (const [xOffset, yOffset] of DIRECTIONS) {
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

    generationText.innerHTML = generation;
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
    generation++;
};

nextButton.addEventListener('click', () => {
    if (setupPhase) {
        setupPhase = false;
        endSetupPhase();
    }

    update();
    render();
});

startButton.addEventListener('click', () => {
    if (setupPhase) {
        setupPhase = false;
        endSetupPhase();
    }

    stopped = false;
    startButton.classList.add('hidden');
    stopButton.classList.remove('hidden');
    nextButton.classList.add('hidden');
    intervalId = setInterval(() => {
        update();
        render();
    }, 500);
});

stopButton.addEventListener('click', () => {
    stopped = true;
    startButton.classList.remove('hidden');
    stopButton.classList.add('hidden');
    nextButton.classList.remove('hidden');
    clearInterval(intervalId);
});

resetButton.addEventListener('click', () => {
    stopped = true;
    clearInterval(intervalId);

    state = Array.from(
        {length: BOARD_WIDTH},
        () => Array.from({length: BOARD_HEIGHT}, () => false)
    );

    for (const cell of cells) {
        cell.addEventListener('click', manualFill);
        cell.classList.remove('alive');
    }

    generation = 1;
    generationText.innerHTML = generation;

    startButton.classList.remove('hidden');
    stopButton.classList.add('hidden');
    nextButton.classList.remove('hidden');

    setupPhase = true;
})

for (const cell of cells)
    cell.addEventListener('click', manualFill);
generationText.innerHTML = generation;