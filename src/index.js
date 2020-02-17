import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'


function Square(props) {
    return (
      <button className="square" onClick={props.onClick} >
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
  
    renderSquare(i) {
      return (
        <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />
      );
    }

    createBoard = () => {
      const board = []
      let count = 0
      for (let j = 0; j < 3; j++){
        let row = []
        for (let i = 0; i < 3; i++) {
          row.push(<div key={i} className='square'>{this.renderSquare(count)}</div>)
          count=count+1
        }
        board.push(<div className="board-row" key={(j+10).toString()}>{row}</div>)
      }
      return board
    }




    render()  {

      return (
        <div>{this.createBoard()}</div>
      )
    }
} 
class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            xIsNext:true,
            stepNumber:0
        }
    }

    jumpTo(step) {
        const history = this.state.history.slice(0, step+1)
        this.setState({
            history:history,
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber+1)
        const current = history[history.length-1]
        const squares = current.squares.slice()
        if(calculateWinner(squares)||squares[i])
        {
            return
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history:history.concat([{
                squares:squares
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        })
    }

    moveLocation(current, previous) {
      const res =[]
      for (let i = 0; i < current.length; i++) {
        if (current[i] === previous[i]) {
          res.push(null)
        } else {
          res.push(current[i])
        }
      }
      for (let i = 0; i<res.length; i++) {
        if (res[i]) {
          const raw = Math.ceil((i+1)/3)
          const col = (i+1)-(raw-1)*3
          return (`raw: ${raw} col: ${col}`)
        }
      }
    }

    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)
        let desc
        const moves = history.map((step, move) => {


          if (move && this.state.stepNumber) {
            desc = `Go to move #${move} ${this.moveLocation(history[move].squares, history[move-1].squares)}`
          } else {
            desc = 'Go to game start'
          }
          return (
                  <li key={move}>
                      {move !== (history.length-1) && <button onClick={() => this.jumpTo(move)}>{desc}</button>}
                      {move === (history.length-1) && <button onClick={() => this.jumpTo(move)}><strong>{desc}</strong></button>}
                  </li>
            )
        })

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
        }


        return (
            <div className="game">
            <div className="game-board">
                <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}                
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol ><li value={0} style={{listStyleType:'none'}}><button key={100}>Reverse this shit</button></li>{moves}</ol>
            </div>
            </div>
        );
    }
}
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }
  