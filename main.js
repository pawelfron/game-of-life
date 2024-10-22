let state = Array.from({length: 100}, (v, i) => false);
let stopped = true;
let intervalId;

const BOARD_HEIGHT = 50;
const BOARD_WIDTH = 50;

const board = document.getElementById('board');
for (let i = 0; i < BOARD_WIDTH * BOARD_HEIGHT; i++) {
    const cell = document.createElement('div');
    cell.addEventListener('click', ({ target }) => {
        state[i] = !target.classList.contains('alive');
        target.classList.toggle('alive');
    })
    board.appendChild(cell);
}
const cells = document.querySelectorAll('#board div');

const countNeighbours = (i) => {
    const x = i % BOARD_WIDTH;
    const y = Math.floor(i / BOARD_WIDTH);

    let livingNeighbours = 0;
    if (state[i - 1] && x != 0)
        livingNeighbours++;
    if (state [i + 1] && x != BOARD_WIDTH - 1)
        livingNeighbours++;
    if (state[i - 1 - BOARD_WIDTH] && x != 0 && y != 0)
        livingNeighbours++;
    if (state[i - BOARD_WIDTH] && y != 0)
        livingNeighbours++;
    if (state[i + 1 - BOARD_WIDTH] && x != BOARD_WIDTH - 1 && y != 0)
        livingNeighbours++;
    if (state[i - 1 + BOARD_WIDTH] && x != 0 && y != BOARD_HEIGHT - 1)
        livingNeighbours++;
    if (state[i + BOARD_WIDTH] && y != BOARD_HEIGHT - 1)
        livingNeighbours++;
    if (state[i + 1 + BOARD_WIDTH] && x != BOARD_WIDTH - 1 && y != BOARD_HEIGHT - 1)
        livingNeighbours++;

    return livingNeighbours;
}

const update = () => {
    const newState = Array.from({length: 100}, (v, i) => false);

    for (let i = 0; i < BOARD_HEIGHT * BOARD_WIDTH; i++) {
        const livingNeighbours = countNeighbours(i);
        if (state[i] && (livingNeighbours == 2 || livingNeighbours == 3))
            newState[i] = true;
        else if (!state[i] && livingNeighbours == 3)
            newState[i] = true;
    }
    
    for (let i = 0; i < BOARD_HEIGHT * BOARD_WIDTH; i++) {
        if (newState[i])
            cells[i].classList.add('alive');
        else
            cells[i].classList.remove('alive');
    }

    state = newState;
};

const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const nextButton = document.getElementById('next');

nextButton.addEventListener('click', update);
startButton.addEventListener('click', () => {
    if (stopped) {
        stopped = false;
        startButton.classList.add('hidden');
        stopButton.classList.remove('hidden');
        nextButton.classList.add('hidden');

        intervalId = setInterval(update, 500);
    }
});
stopButton.addEventListener('click', () => {
    if (!stopped) {
        stopped = true;
        startButton.classList.remove('hidden');
        stopButton.classList.add('hidden');
        nextButton.classList.remove('hidden');

        clearInterval(intervalId);
    }
});