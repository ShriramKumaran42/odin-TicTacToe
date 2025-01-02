function cell() {
    let value  = null;

    const getValue = () => value;
    const setValue = (newValue) => {
        if (value === null) value = newValue;
    };

    return {getValue, setValue};
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
        if(row >= 0 && row < rows && col >= 0 && col < cols) {
            return board[row][col].setValue(value);
        }
    }
    
    const getCell = (row, col) => {
        if(row >=0 && row < rows && col >= 0 && col < cols) {
            return board[row][col].getValue();
        }
        return null;
    }
    
    const displayBoard = () => {
        console.log( board.map(row => row.map(cell => cell.getValue() || "_").join(" | ")).join("\n") );
    }

    return {getBoard, setCell, getCell, displayBoard}
})();

function player(name, symbol) {
    const getName = () => name;
    const getSymbol = () => symbol;

    return {getName, getSymbol};
}

const gamePlay = (() => {
    const player1 = player("Player 1", "X");
    const player2 = player("Player 2", "O");
    let currentPlayer = player1;
    let isGameOver = false;

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
            if(line.every(cell => cell.getValue() === currentPlayer.getSymbol())){
                isGameOver = true;
                console.log(`${currentPlayer.getName()} is the winner`);
                return true;
            }
        }
        if(board.every(row => row.every(cell => cell.getValue() !== null))) {
            console.log("the match is draw");
            return true;
        }

        return false;
    }

    const play = (row, col) => {
        if(isGameOver){
            console.log("Game Over");
            return;
        }
        if(gameBoard.getCell(row, col) !== null){
            console.log("cell taken");
            return;
        }

        gameBoard.setCell(row, col, currentPlayer.getSymbol());
        gameBoard.displayBoard();

        if(!gameWinner()) {
            switchPlayer();
            console.log(`${currentPlayer.getName()}'s play`)
        }
    }

    const gameRestart = () => {
        isGameOver = false;
        currentPlayer = player1;
        gameBoard.getBoard().forEach(row => row.forEach(cell => cell.setValue(null)));
        gameBoard.displayBoard();
        console.log(`${currentPlayer.getName}'s turn`)
    }
    return {play, gameRestart};

})();






