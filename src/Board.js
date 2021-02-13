import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 0.5 }) {  

  const [board, setBoard] = useState(createBoard()); 

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    // create array-of-arrays of true/false values
    let initialBoard = [];
    for (let i = 0; i < nrows; i++) {
      let currRow = [];
      for (let j = 0; j < ncols; j++) {
        currRow.push(Math.random() < chanceLightStartsOn);
      }
      initialBoard.push(currRow);
    }
    
    return initialBoard;
  }


  /** Further study: another version making sure the board is resolvable **/
  // function createBoard() {
  //   // create array-of-arrays of all false values which means solved
  //   let initialBoard = [];
  //   for (let i = 0; i < nrows; i++) {
  //     let currRow = [];
  //     for (let j = 0; j < ncols; j++) {
  //       currRow.push(false);
  //     }
  //     initialBoard.push(currRow);
  //   }

  //   // do some random flip operations to make it unsolved
  //   const timesToFlip = 5;

  //   for (let i = 0; i < timesToFlip; i++) {
  //     const y = Math.floor(Math.random() * nrows);
  //     const x = Math.floor(Math.random() * ncols);
  //     flipCellsAround(y, x, initialBoard);
  //   }

  //   return initialBoard;
  // }

  
  // check the board in state to determine whether the player has won.
  function hasWon() {   
    return board.every(row => row.every(cell => cell===false));
  }

  
  const flipCell = (y, x, boardCopy) => {
    // if this coord is actually on board, flip it
    if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
      boardCopy[y][x] = !boardCopy[y][x];
    }
  };


  // flip the cell at given coordinate and the cells around it
  const flipCellsAround = (y, x, lightBoard) => {
    flipCell(y, x, lightBoard);
    flipCell(y - 1, x, lightBoard);
    flipCell(y + 1, x, lightBoard);
    flipCell(y, x - 1, lightBoard);
    flipCell(y, x + 1, lightBoard); 
  };
 
  
  // Handle the click, flip the cells and update the state
  function handleFlip(coord) {
    // const boardCopy = board.map(row => [...row]);
    
    setBoard(() => {
      const [y, x] = coord.split("-").map(Number);     

      // Make a (deep) copy of the oldBoard         
      const boardCopy = board.map(row => [...row]);      
      flipCellsAround(y, x, boardCopy);
         
      //return the copy
      return boardCopy
    });
  }   

  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) return (
    <h2>You Won!</h2>
  );

  // make table board
  return (
    <div>
    <table className="Board">
      {board.map((row, y) => 
        <tr key={y}>
          {row.map((cell, x) => 
            <Cell
              key={`${y}-${x}`} 
              isLit={cell}
              flipCellsAroundMe={() => handleFlip(`${y}-${x}`)}
            />
          )}
        </tr>
      )}
    </table>
    </div>  
  )
  
}

export default Board;
