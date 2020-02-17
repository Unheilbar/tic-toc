import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'


function Square(props) {
    return (
      <button className="square" onClick={props.onClick} style={{color:props.squareColor}}>
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
            squareColor={this.props.squareColor[i]}
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
                squares: Array(9).fill(null),
                squareColor: Array(9).fill('black'),
            }],
            xIsNext:true,
            stepNumber:0,
            lines:[
              [0, 1, 2],
              [3, 4, 5],
              [6, 7, 8],
              [0, 3, 6],
              [1, 4, 7],
              [2, 5, 8],
              [0, 4, 8],
              [2, 4, 6],
            ],
            
            listReverse:false
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

    listReverse() {
      if(!this.state.listReverse){
        this.setState({
          listReverse:true
        })
      } else {
        this.setState({
          listReverse:false
        })
      }
    }


    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber+1)
        const current = history[history.length-1]
        const squares = current.squares.slice()
        

        if(this.calculateWinner(squares)||squares[i])
        {
            console.log(squares)
            return
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const squareColor = this.highlightSquares(squares)

        this.setState({
            history:history.concat([{
                squares:squares,
                squareColor:squareColor

            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
            
        })
    }

    moveLocation(current, previous) {
      const res = []
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

    highlightSquares(squares) {
      const resColors = Array(9).fill('black')
      for (let i = 0; i < this.state.lines.length; i++) {
        const [a, b, c] = this.state.lines[i]
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            const [a, b, c] = this.state.lines[i]
            resColors[a]='red'
            resColors[b]='red'
            resColors[c]='red'
        }
      }
      
      return resColors
    }

    calculateWinner(squares) {
  
      for (let i = 0; i < this.state.lines.length; i++) {
        const [a, b, c] = this.state.lines[i]
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return squares[a]
        }
      }
      return null
    }


    render() {
        const history = this.state.history

        const current = history[this.state.stepNumber]
        const winner = this.calculateWinner(current.squares)
        let desc
        const moves = history.map((step, move) => {
          if (move && this.state.stepNumber) {
            desc = `Go to move #${move} ${this.moveLocation(history[move].squares, history[move-1].squares)}`
          } else {
            desc = 'Go to game start'
          }
          return (
                  <li key={move} >
                      {move !== (history.length-1) && <button onClick={() => this.jumpTo(move)}>{desc}</button>}
                      {move === (history.length-1) && <button onClick={() => this.jumpTo(move)}><strong>{desc}</strong></button>}
                  </li>
            )
        })

        if (this.state.listReverse) {
          moves.reverse()
        }

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if(this.state.stepNumber===9){
            status = 'DRAW'
        }else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
        }


        return (
            <div className="game">
            <div className="game-board">
                <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
                squareColor={current.squareColor}                
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol><li value={0} style={{listStyleType:'none'}}><button key={100} onClick={() => this.listReverse()}> Reverse this shit </button></li>{moves}</ol>
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


