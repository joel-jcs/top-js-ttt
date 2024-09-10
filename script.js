const gameboard = (function () {
    const cells = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let remainingCells = cells.map(cell => cell);
    const getRemainingCells = () => remainingCells;
    const updateRemainingCells = (filtering) => {
        remainingCells = remainingCells.filter(filtering);
        console.table("remaining cells: ", remainingCells);
    };

    let boardState = cells.map(cell => cell);
    const getBoardState = () => boardState;
    const updateBoardState = (playerSelections, playerMark) => {
        boardState.map((cell, index) => boardState[index] = playerSelections.includes(cell) ? playerMark : cell);
        console.table("board state: ", boardState);
    };

    return  {
        cells,
        getRemainingCells,
        updateRemainingCells,
        getBoardState,
        updateBoardState,
    };
})();

const createPlayer = (name, mark) => {
    this.name = name;
    this.mark = mark;
    this.selections = [];

    return { name, mark, selections };
};

const getCpuSelection = () => {
    const remainingCells = gameboard.getRemainingCells();
    console.log(remainingCells);
    let index = Math.floor(Math.random() * remainingCells.length);
    let selection = remainingCells[index];
    console.log("CPU Selection: " + selection);
    return selection;
};

getPlayerSelection = () => {
    let selection = 0;
    let boardState = gameboard.getBoardState();
    let row1 = boardState.slice(0, 3);
    let row2 = boardState.slice(3, 6);
    let row3 = boardState.slice(6, 9);
    selection = prompt(`
        Type in the number that corresponds to the cell you want to mark: 
        ${row1}
        ${row2}
        ${row3}
    `);

    // TO-DO ADD CONDITION THAT PLAYER CAN'T SELECT ONE IF IT ISNT WITHIN THE REMAINING CELLS
    console.log("Player Selection: " + selection);

    return selection;
};

const playGame = (function () {
    const playerName = prompt("Enter your name: ");
    const playerMark = prompt("Enter your choice: ");
    const player1 = createPlayer(playerName, playerMark);
    console.log("Player Mark: ", player1.mark);

    let cpuMark = playerMark === "x" ? "o" : "x";
    const player2 = createPlayer("CPU", cpuMark);
    console.log("CPU Mark: ", player2.mark);

    const playTurn = (player) => {
        player.selections.push(player === player1 ? parseInt(getPlayerSelection()) : getCpuSelection());
        gameboard.updateRemainingCells(cell => !player.selections.includes(cell));
        gameboard.updateBoardState(player.selections, player.mark);
    }

    while (gameboard.getRemainingCells().length > 0) {
        playTurn(player1);
        if (gameboard.getRemainingCells().length > 0) {
            playTurn(player2);
        }
    }
})();



//function to restart game
//clear up both player selections
//nice to have: count games won by each player
