let state = Array.from({length: 100}, (v, i) => false);

const BOARD_HEIGHT = 50;
const BOARD_WIDTH = 50;

const board = document.getElementById('board');
for (let i = 0; i < BOARD_WIDTH * BOARD_HEIGHT; i++) {
    const cell = document.createElement('div');
    cell.addEventListener('click', ({ target }) => {
        if (target.classList.contains('alive')) {
            target.classList.remove('alive');
            state[i] = false;
        } else {
            target.classList.add('alive');
            state[i] = true;
        } 
    })
    board.appendChild(cell);
}

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

const cells = document.querySelectorAll('#board div');
document.getElementById('start').addEventListener('click', (event) => {
    event.preventDefault();

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
});