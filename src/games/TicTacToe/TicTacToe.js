import './TicTacToe.css'
import { Button } from '../../components/Button/Button'
import { renderPage } from '../../main'
import { Home } from '../../pages/Home/Home'

export const TicTacToe = () => {
  const STORAGE_KEY = 'gamesHubTicTacToeScore'

  const getStoredScore = () => {
    const defaultScore = {
      wins: 0,
      losses: 0,
      draws: 0
    }

    const savedScore = localStorage.getItem(STORAGE_KEY)

    if (!savedScore) return defaultScore

    try {
      const parsedScore = JSON.parse(savedScore)

      return {
        wins: parsedScore.wins ?? 0,
        losses: parsedScore.losses ?? 0,
        draws: parsedScore.draws ?? 0
      }
    } catch {
      return defaultScore
    }
  }

  const saveScore = (score) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(score))
  }

  const score = getStoredScore()

  const section = document.createElement('section')
  section.classList.add('game-view', 'container')

  const title = document.createElement('h2')
  title.textContent = 'Tres en raya'

  const text = document.createElement('p')
  text.textContent =
    'Juega contra la máquina y consigue tres en línea antes que ella.'

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
  winsValue.textContent = score.wins

  winsBox.append(winsLabel, winsValue)

  const lossesBox = document.createElement('div')
  lossesBox.classList.add('tic-tac-toe-score__item')

  const lossesLabel = document.createElement('span')
  lossesLabel.textContent = 'Derrotas'

  const lossesValue = document.createElement('strong')
  lossesValue.textContent = score.losses

  lossesBox.append(lossesLabel, lossesValue)

  const drawsBox = document.createElement('div')
  drawsBox.classList.add('tic-tac-toe-score__item')

  const drawsLabel = document.createElement('span')
  drawsLabel.textContent = 'Empates'

  const drawsValue = document.createElement('strong')
  drawsValue.textContent = score.draws

  drawsBox.append(drawsLabel, drawsValue)

  scoreList.append(winsBox, lossesBox, drawsBox)
  scoreBoard.append(scoreTitle, scoreList)

  const result = document.createElement('p')
  result.classList.add('game-result')
  result.textContent = 'Tu ficha es X. La máquina juega con O.'

  const board = document.createElement('div')
  board.classList.add('tic-tac-toe-board')

  const controls = document.createElement('div')
  controls.classList.add('tic-tac-toe-controls')

  const cells = []
  let gameOver = false
  let machineThinking = false

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  const updateScoreUI = () => {
    winsValue.textContent = score.wins
    lossesValue.textContent = score.losses
    drawsValue.textContent = score.draws
  }

  const updateStoredScore = () => {
    saveScore(score)
    updateScoreUI()
  }

  const clearWinningCells = () => {
    cells.forEach((cell) => cell.classList.remove('cell-winning'))
  }

  const checkWinner = (symbol) => {
    return winningCombinations.some((combo) => {
      return combo.every((index) => cells[index].textContent === symbol)
    })
  }

  const checkDraw = () => {
    return cells.every((cell) => cell.textContent !== '')
  }

  const getEmptyCells = () => {
    return cells.filter((cell) => cell.textContent === '')
  }

  const findCriticalMove = (symbol) => {
    for (const combo of winningCombinations) {
      const values = combo.map((index) => cells[index].textContent)
      const symbolCount = values.filter((value) => value === symbol).length
      const emptyCount = values.filter((value) => value === '').length

      if (symbolCount === 2 && emptyCount === 1) {
        const emptyIndex = values.indexOf('')
        return combo[emptyIndex]
      }
    }

    return null
  }

  const highlightWinningCombo = (symbol) => {
    for (const combo of winningCombinations) {
      const isWinningCombo = combo.every(
        (index) => cells[index].textContent === symbol
      )

      if (isWinningCombo) {
        combo.forEach((index) => cells[index].classList.add('cell-winning'))
        break
      }
    }
  }

  const disableBoard = () => {
    board.classList.add('game-disabled')
  }

  const enableBoard = () => {
    board.classList.remove('game-disabled')
  }

  const finishGame = (message, outcome) => {
    result.textContent = message
    gameOver = true
    machineThinking = false
    disableBoard()

    if (outcome === 'win') score.wins++
    if (outcome === 'loss') score.losses++
    if (outcome === 'draw') score.draws++

    if (outcome) {
      updateStoredScore()
    }
  }

  const resetBoard = () => {
    cells.forEach((cell) => {
      cell.textContent = ''
      cell.classList.remove('cell-x', 'cell-o', 'cell-winning')
    })

    gameOver = false
    machineThinking = false
    result.textContent = 'Tu ficha es X. La máquina juega con O.'
    clearWinningCells()
    enableBoard()
  }

  const resetScore = () => {
    score.wins = 0
    score.losses = 0
    score.draws = 0
    updateStoredScore()
  }

  const machineMove = () => {
    if (gameOver) return

    let moveIndex = findCriticalMove('O')

    if (moveIndex === null) {
      moveIndex = findCriticalMove('X')
    }

    if (moveIndex === null && cells[4].textContent === '') {
      moveIndex = 4
    }

    if (moveIndex === null) {
      const emptyCells = getEmptyCells()

      if (emptyCells.length === 0) return

      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)]

      moveIndex = Number(randomCell.dataset.index)
    }

    cells[moveIndex].textContent = 'O'
    cells[moveIndex].classList.add('cell-o')

    if (checkWinner('O')) {
      highlightWinningCombo('O')
      finishGame('Ha ganado la máquina', 'loss')
      return
    }

    if (checkDraw()) {
      finishGame('Empate', 'draw')
      return
    }

    machineThinking = false
    result.textContent = 'Tu turno'
  }

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('button')
    cell.classList.add('tic-tac-toe-cell')
    cell.dataset.index = i
    cell.setAttribute('aria-label', `Casilla ${i + 1}`)

    cell.addEventListener('click', () => {
      if (gameOver) return
      if (machineThinking) return
      if (cell.textContent !== '') return

      cell.textContent = 'X'
      cell.classList.add('cell-x')

      if (checkWinner('X')) {
        highlightWinningCombo('X')
        finishGame('Has ganado', 'win')
        return
      }

      if (checkDraw()) {
        finishGame('Empate', 'draw')
        return
      }

      machineThinking = true
      result.textContent = 'La máquina está pensando...'

      setTimeout(() => {
        machineMove()
      }, 550)
    })

    cells.push(cell)
    board.append(cell)
  }

  const resetButton = Button('Reiniciar partida')
  resetButton.addEventListener('click', resetBoard)

  const resetScoreButton = Button('Resetear marcador')
  resetScoreButton.addEventListener('click', resetScore)

  const backButton = Button('Volver al inicio')
  backButton.addEventListener('click', () => {
    renderPage(Home())
  })

  controls.append(resetButton, resetScoreButton, backButton)

  section.append(title, text, scoreBoard, result, board, controls)

  return section
}
