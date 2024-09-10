const gameboard = (function () {
    const cells = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let remainingCells = cells.map(cell => cell);
    const getRemainingCells = () => remainingCells;
    const updateRemainingCells = (filtering) => {
        remainingCells = remainingCells.filter(filtering);
    };

    let boardState = cells.map(cell => cell);
    const getBoardState = () => boardState;
    const updateBoardState = (playerSelections, playerMark) => {
        boardState.map((cell, index) => boardState[index] = playerSelections.includes(cell) ? playerMark : cell);
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
    this.isWinner = false;

    return { name, mark, selections, isWinner };
};

const getCpuSelection = () => {
    const remainingCells = gameboard.getRemainingCells();
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
    
    const selectionPrompt = () => {
        selection = prompt(`
            Type in the number that corresponds to the cell you want to mark: 
            ${row1}
            ${row2}
            ${row3}
        `);

        if (!gameboard.getRemainingCells().includes(parseInt(selection))) {
            alert("That cell has already been marked. Please type the number of a cell that hasn't been marked");
            selectionPrompt();
        }
        return selection;
    }

    selection = selectionPrompt();
    console.log("Player Selection: " + selection);

    return selection;
};

const checkWinner = (player) => {
    let playerSelections = player.selections.sort((a,b) => a - b);
    console.log(playerSelections);

    const winningCombinations = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9], // Horizontal
        [1, 4, 7], [2, 5, 8], [3, 6, 9], // Vertical
        [1, 5, 9], [3, 5, 7] // Diagonal
    ];

    winningCombinations.forEach(combination => {
        if (combination.every(num => playerSelections.includes(num))) {
            player.isWinner = true;
            alert(`${player.name} won the game!`);
            return;
        }
    });
};

const playGame = (function () {
    const playerName = prompt("Enter your name: ");
    const playerMark = prompt("Enter your choice: ");
    const player1 = createPlayer(playerName, playerMark);

    let cpuMark = playerMark === "x" ? "o" : "x";
    const player2 = createPlayer("CPU", cpuMark);

    const playTurn = (player) => {
        player.selections.push(player === player1 ? parseInt(getPlayerSelection()) : getCpuSelection());
        gameboard.updateRemainingCells(cell => !player.selections.includes(cell));
        gameboard.updateBoardState(player.selections, player.mark);
    }

    while (gameboard.getRemainingCells().length > 0) {
        if (player1.isWinner || player2.isWinner) {
            console.table(player1.selections);
            console.table(player2.selections);
            break;
        }

        playTurn(player1);
        if (player1.selections.length > 2) {
            checkWinner(player1);
        }
        if (gameboard.getRemainingCells().length > 0) {
            playTurn(player2);
            if (player2.selections.length > 2) {
                checkWinner(player2);
            }
        }
    }
})();


//function to restart game
//clear up both player selections
//nice to have: select number of human players (max = 2) and let them play together
//nice to have: play multiple rounds
//nice to have: count games won by each player
