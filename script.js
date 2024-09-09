//Try to go full on OOP

//store gameboard as an array inside of a gameboard object

// players will be stored in objects

// object to control flow of the game

// as least global variables/code as possible -- try to use factories for everything
//if you only need 1 instance of something (ex gameboard), insta invoke it by wrapping in IIFE (module)


//1 - make the game console first
// check when game is over

// 2- after it works in console, start with DOM handling (html/css). do this in a OBJECT

//3 - write functions so players can add marks on the board (preventing adding when spot already taken)

// 4- clean up ui + let players put their names + include button to start/restart

const setGameBoard = (function () {
    const gameboard = {
        cells: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    };

    return gameboard;
})();

const createPlayer = (name, mark) => {
    this.name = name;
    this.mark = mark;
    this.selections = [];

    return { name, mark, selections };
};

const getCpuSelection = () => {
    let selection = Math.ceil(Math.random() * 9);
    return selection;
};

getPlayerSelection = () => {
    let selectedRow = prompt("Select a row (1-3): ");    
    let selectedCol = prompt("Select a column (1-3): ");
    let selection = 0;

    switch (parseInt(selectedRow + selectedCol)) {
        case 11:
        case 12:
        case 13:
        case 23:
        case 33:
            selection = selectedRow * selectedCol;
            break;
        case 21:
            selection = 4;
            break;
        case 22:
            selection = 5;
            break;
        case 31:
            selection = 7;
            break;
        case 32:
            selection = 8;
            break;
    }

    return selection;
};

const gameflow = (function () {
    const playerName = prompt("Enter your name: ");
    const playerMark = prompt("Enter your choice: ");
    const player1 = createPlayer(playerName, playerMark);
    console.log(player1);
    
    let selection = getPlayerSelection();
    console.log(selection);



    let cpuMark = playerMark === "x" ? "o" : "x";
})();

// let selection = 0;
// switch (gameboard) {
//     case row[0] === 1 && column[0] === 1:
//         selection = 1;
//     case row[0] === 1 && column[0] === 1:
//         selection = 1;
// }

//function to select the cell
//to determine the cell to select, player will pick a row and a column
//ex if column2 row2, cell = 5
//selected target will be:

//function to store each player's selections
//when player selects, push their selected cell# to an array

//function to restart game
//clear up both player selections
//nice to have: count games won by each player

// console.table(setGameBoard());