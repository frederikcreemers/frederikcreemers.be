---
title: "Programming by Wishful Thinking"
date: 2017-10-06T15:35:38+02:00
draft: false
---
You've probably heard the advice to break your work up into manageable chunks, or to break a complex problem down into simpler parts. This is a handy technique to use while programming as well

You write a function to solve a particular problem, and you write it as if any complex functionality you wish for, has already been written. Afterwards,, you go fill in these functions, and apply the same technique.

## An Example

Let's say you're writing a Tic-Tac-Toe game, and you need to write a function called `getWinner`. It takes the board as a 2D array. Each cell in the array contains the string "X", "O" or "." ("." is an empty cell). It returns "X" or "O" if the respective player has a row of 3, and `null` otherwise. Here's what the process for checking that looks like

  - Check the horizontal rows. If there's no winner, ...
  - Check the vertical rows. If there's no winner, ...
  - Return whether there's a winner on the diagonals.

So here's how you'd write that function in JavaScript:

```js

function getWinner(board) {
    return getHorizontalWinner(board) ||
           getVerticalWinner(board) ||
           getDiagonalWinner(board);
}
```

We just wish that `getHorizontalWinner` and its friends existed, so our problem would be as simple as this. However, wishing upon a star doesn't get you very far, so we still have to implement each of these functions, but at least they're smaller problems to solve.

Let's dig in and write `getHorizontalWinner` first

```js
function getHorizontalWinner(board) {
  for(var i=0; i<3; i++) {
    var winner = getLineWinner(board[i])
    if(winner !== null) {
      return winner;
    }
  }
  return null;
}
```

Again, we just write our code as if we already have `getLineWinner`, which takes an array of 3 board cells, and returns the player who made a winning line there, if any, otherwise null.

`getVerticalWinner` will look very similar:

```js
function getVerticalWinner(board) {
  for(var i=0; i<3; i++) {
    var winner = getLineWinner([board[0][i], board[1][i], board[2][i]])
    if(winner !== null) {
      return winner;
    }
  }
  return null;
}
```

You could, if you want, add a `getColumn` function that abstracts away getting an array for a given column of the board, but in this case, I don't think it's necessary. 

Now for `getDiagonalWinner`:

```js
function getDiagonalWinner(board) {
  return getLineWinner([board[0][0], board[1][1], board[2, 2]]) ||
         getLineWinner([board[0][2], board[1][1], board[2, 0]]);
}
```

Pretty simple, right? Now the only thing we have left to write is `getLineWinner`:

```js
function getLineWinner(line) {
  if (line[0] !== "." && line[0] === line[1] && line[1] === line[2]) {
    return line[0]
  }
  return null
}
```

And we're done! You could replace the check for `line[0] !== "."` with a function like `isEmpty`, which would then do the check. This function would be pretty handy when implementing the rest of the game as well, for example to check whether it is valid for a player to put a symbol in a specific cell. But for this example, I'm leaving it as-is.

The most important thing to note here, is that you abstract away details by calling functions you wish existed. This way, you're naturally splitting your code into reasonably-sized functions, dealing with different levels of abstraction.

I hope this has been helpful to you.