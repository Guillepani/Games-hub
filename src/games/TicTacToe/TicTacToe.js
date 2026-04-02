import './TicTacToe.css'
import { Button } from '../../components/Button/Button'
import { renderPage } from '../../main'
import { Home } from '../../pages/Home/Home'
import {
  createTTTState,
  resetBoard,
  resetScore,
  checkWinner,
  checkDraw,
  getWinningCombo,
  getMachineMove,
  applyMove,
  finishGame
} from './TicTacToeLogic'

export const TicTacToe = () => {
  let state = createTTTState()

  const section = document.createElement('section')
  section.classList.add('game-view', 'container')

  // HEADER
  const title = document.createElement('h2')
  title.textContent = 'Tres en raya'

  const text = document.createElement('p')
  text.textContent =
    'Juega contra la máquina y consigue tres en línea antes que ella.'

  // SCOREBOARD
  const scoreBoard = document.createElement('section')
  scoreBoard.classList.add('tic-tac-toe-score', 'card')
  scoreBoard.setAttribute('aria-label', 'Marcador del tres en raya')

  const scoreTitle = document.createElement('h3')
  scoreTitle.textContent = 'Marcador'

  const scoreList = document.createElement('div')
  scoreList.classList.add('tic-tac-toe-score__list')

  const winsBox = document.createElement('div')
  winsBox.classList.add('tic-tac-toe-score__item')
  const winsLabel = document.createElement('span')
  winsLabel.textContent = 'Victorias'
  const winsValue = document.createElement('strong')
  winsBox.append(winsLabel, winsValue)

  const lossesBox = document.createElement('div')
  lossesBox.classList.add('tic-tac-toe-score__item')
  const lossesLabel = document.createElement('span')
  lossesLabel.textContent = 'Derrotas'
  const lossesValue = document.createElement('strong')
  lossesBox.append(lossesLabel, lossesValue)

  const drawsBox = document.createElement('div')
  drawsBox.classList.add('tic-tac-toe-score__item')
  const drawsLabel = document.createElement('span')
  drawsLabel.textContent = 'Empates'
  const drawsValue = document.createElement('strong')
  drawsBox.append(drawsLabel, drawsValue)

  scoreList.append(winsBox, lossesBox, drawsBox)
  scoreBoard.append(scoreTitle, scoreList)

  // RESULTADO
  const result = document.createElement('p')
  result.classList.add('game-result')
  result.textContent = 'Tu ficha es X. La máquina juega con O.'

  // BOARD
  const board = document.createElement('div')
  board.classList.add('tic-tac-toe-board')

  // CONTROLES
  const controls = document.createElement('div')
  controls.classList.add('tic-tac-toe-controls')

  // RENDER
  const updateScoreUI = () => {
    winsValue.textContent = state.score.wins
    lossesValue.textContent = state.score.losses
    drawsValue.textContent = state.score.draws
  }

  const updateCellsUI = () => {
    cellButtons.forEach((cell, index) => {
      cell.textContent = state.board[index]
      cell.classList.remove('cell-x', 'cell-o', 'cell-winning')
      if (state.board[index] === 'X') cell.classList.add('cell-x')
      if (state.board[index] === 'O') cell.classList.add('cell-o')
    })
  }

  const highlightWinner = (symbol) => {
    const combo = getWinningCombo(state.board, symbol)
    if (combo) {
      combo.forEach((index) => cellButtons[index].classList.add('cell-winning'))
    }
  }

  const disableBoard = () => board.classList.add('game-disabled')
  const enableBoard = () => board.classList.remove('game-disabled')

  // CELL BUTTONS
  const cellButtons = []

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('button')
    cell.classList.add('tic-tac-toe-cell')
    cell.dataset.index = i
    cell.setAttribute('aria-label', `Casilla ${i + 1}`)

    cell.addEventListener('click', () => {
      if (state.gameOver || state.machineThinking || state.board[i] !== '')
        return

      applyMove(state, i, 'X')
      updateCellsUI()

      if (checkWinner(state.board, 'X')) {
        highlightWinner('X')
        finishGame(state, 'win')
        result.textContent = 'Has ganado'
        updateScoreUI()
        disableBoard()
        return
      }

      if (checkDraw(state.board)) {
        finishGame(state, 'draw')
        result.textContent = 'Empate'
        updateScoreUI()
        disableBoard()
        return
      }

      state.machineThinking = true
      result.textContent = 'La máquina está pensando...'
      disableBoard()

      setTimeout(() => {
        const moveIndex = getMachineMove(state.board)
        if (moveIndex === null) return

        applyMove(state, moveIndex, 'O')
        updateCellsUI()

        if (checkWinner(state.board, 'O')) {
          highlightWinner('O')
          finishGame(state, 'loss')
          result.textContent = 'Ha ganado la máquina'
          updateScoreUI()
          return
        }

        if (checkDraw(state.board)) {
          finishGame(state, 'draw')
          result.textContent = 'Empate'
          updateScoreUI()
          disableBoard()
          return
        }

        state.machineThinking = false
        result.textContent = 'Tu turno'
        enableBoard()
      }, 550)
    })

    cellButtons.push(cell)
    board.append(cell)
  }

  const handleResetBoard = () => {
    resetBoard(state)
    updateCellsUI()
    result.textContent = 'Tu ficha es X. La máquina juega con O.'
    enableBoard()
  }

  const handleResetScore = () => {
    resetScore(state)
    updateScoreUI()
  }

  const cleanup = () => {}

  const resetButton = Button('Reiniciar partida')
  const resetScoreButton = Button('Resetear marcador')
  const backButton = Button('Volver al inicio')

  resetButton.addEventListener('click', handleResetBoard)
  resetScoreButton.addEventListener('click', handleResetScore)
  backButton.addEventListener('click', () => {
    cleanup()
    renderPage(Home())
  })

  controls.append(resetButton, resetScoreButton, backButton)
  section.append(title, text, scoreBoard, result, board, controls)

  updateScoreUI()

  return section
}
