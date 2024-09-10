const gameboard = (function () {
    const cells = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let remainingCells = cells.map(cell => cell);
    const getRemainingCells = () => remainingCells;
    const updateRemainingCells = (filtering) => {
        remainingCells = remainingCells.filter(filtering);
        console.table("remaining cells: ", remainingCells);
    }

    return  {
        cells,
        remainingCells,
        getRemainingCells,
        updateRemainingCells,
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
    selection = prompt(`
        Type in the number that corresponds to the cell you want to mark: 
        _(1) _(2) _(3)
        _(4) _(5) _(6)
        _(7) _(8) _(9)
    `);

    console.log("Player Selection: " + selection);

    return selection;
};

const gameflow = (function () {
    const playerName = prompt("Enter your name: ");
    const playerMark = prompt("Enter your choice: ");
    const player1 = createPlayer(playerName, playerMark);

    let cpuMark = playerMark === "x" ? "o" : "x";
    const player2 = createPlayer("CPU", cpuMark);
    
    player1.selections.push(parseInt(getPlayerSelection()));
    gameboard.updateRemainingCells(cell => !player1.selections.includes(cell));

    player2.selections.push(getCpuSelection());
    gameboard.updateRemainingCells(cell => !player2.selections.includes(cell));

})();



//function to restart game
//clear up both player selections
//nice to have: count games won by each player
