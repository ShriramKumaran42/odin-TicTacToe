function cell() {
    let value  = null;

    const getValue = () => value;
    const setValue = (newValue) => {
        if (value === null) value = newValue;
    };

    const reset = () => {
        value = null;
    }

    return {getValue, setValue, reset};
}

const gameBoard = (() => {
    const rows = 3;
    const cols = 3;
    const board = [];

    for (let i = 0; i < rows; i++){
        board[i] = [];
        for(let j = 0; j < cols; j++){
            board[i].push(cell());
        }
    }
    
    
    const getBoard = () => board;
    
    const setCell = (row, col, value) => {
        if(board[row] && board[row][col]) {
            board[row][col].setValue(value);
        }
    }
    
    const getCell = (row, col) => {
        return board[row]?.[col]?.getValue() || null;
    }

    const resetBoard = () => {
        board.forEach(row => row.forEach(cell => cell.reset()));
    }
    

    return {getBoard, setCell, getCell, resetBoard};
})();

function player(name, symbol) {
    return {name, symbol};
}

const gamePlay = (() => {
    const player1 = player("Player 1", "X");
    const player2 = player("Player 2", "O");
    let isGameOver = false;
    
    let currentPlayer = player1;
    
    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }

    const gameWinner = () => {
        const board = gameBoard.getBoard();
        const winLines = [
            [board[0][0], board[0][1], board[0][2]],
            [board[1][0], board[1][1], board[1][2]],
            [board[2][0], board[2][1], board[2][2]],

            [board[0][0], board[1][0], board[2][0]],
            [board[0][1], board[1][1], board[2][1]],
            [board[0][2], board[1][2], board[2][2]],

            [board[0][0], board[1][1], board[2][2]],
            [board[0][2], board[1][1], board[2][0]]
        ]

        for(let line of winLines) {
            if(line.every(cell => cell.getValue() === currentPlayer.symbol)){
                isGameOver = true;
                displayController.displayMessage(`${currentPlayer.name} is the winner`);
                return true;
            }
        }
        if(board.every(row => row.every(cell => cell.getValue() !== null))) {
            isGameOver = true;
            displayController.displayMessage("the match is draw");
            return true;
        }

        return false;
    }

    const play = (row, col) => {
        if(isGameOver){
            displayController.displayMessage("Game Over");
            return;
        }
        if(gameBoard.getCell(row, col) !== null){
            displayController.displayMessage("cell taken");
            return;
        }

        gameBoard.setCell(row, col, currentPlayer.symbol);
        displayController.render();

        if(!gameWinner()) {
            switchPlayer();
            displayController.displayMessage(`${currentPlayer.name}'s play`)
        }
    }

    const gameRestart = () => {
        gameBoard.resetBoard();
        currentPlayer = player1;
        isGameOver = false;
        displayController.render();
        displayController.displayMessage("Player 1's turn")
    }
    return {play, gameRestart};

})()

const displayController = (() => {
    const boardElement = document.getElementById("board");

    const render = () => {
        boardElement.innerHTML = "";

        const board = gameBoard.getBoard();

        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellElement = document.createElement("div");
                cellElement.classList.add("cell");
                cellElement.textContent = cell.getValue() || "";

                cellElement.addEventListener("click", () => {
                    gamePlay.play(rowIndex, colIndex);
                });

                boardElement.appendChild(cellElement);
            })
        })
    }

    const displayMessage = (msg) => {
        document.getElementById("msg").textContent = msg;
    }

    return {render, displayMessage}

})()

document.getElementById("clear").addEventListener("click", () => {
    gamePlay.gameRestart();
})

displayController.render();
displayController.displayMessage("Player 1 turn");






