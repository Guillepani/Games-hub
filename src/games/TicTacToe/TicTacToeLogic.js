import { getStoredValue, setStoredValue } from '../../utils/storage'

const STORAGE_KEY = 'gamesHubTicTacToeScore'

export const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

export const createTTTState = () => ({
  board: Array(9).fill(''),
  gameOver: false,
  machineThinking: false,
  score: getStoredValue(STORAGE_KEY, { wins: 0, losses: 0, draws: 0 })
})

export const saveScore = (score) => {
  setStoredValue(STORAGE_KEY, score)
}

export const resetScore = (state) => {
  state.score = { wins: 0, losses: 0, draws: 0 }
  saveScore(state.score)
}

export const checkWinner = (board, symbol) =>
  winningCombinations.some((combo) =>
    combo.every((index) => board[index] === symbol)
  )

export const checkDraw = (board) => board.every((cell) => cell !== '')

export const getWinningCombo = (board, symbol) =>
  winningCombinations.find((combo) =>
    combo.every((index) => board[index] === symbol)
  ) ?? null

export const findCriticalMove = (board, symbol) => {
  for (const combo of winningCombinations) {
    const values = combo.map((index) => board[index])
    const symbolCount = values.filter((v) => v === symbol).length
    const emptyCount = values.filter((v) => v === '').length

    if (symbolCount === 2 && emptyCount === 1) {
      return combo[values.indexOf('')]
    }
  }
  return null
}

export const getMachineMove = (board) => {
  let moveIndex = findCriticalMove(board, 'O') ?? findCriticalMove(board, 'X')

  if (moveIndex === null && board[4] === '') {
    moveIndex = 4
  }

  if (moveIndex === null) {
    const emptyCells = board
      .map((val, index) => (val === '' ? index : null))
      .filter((val) => val !== null)

    if (emptyCells.length === 0) return null
    moveIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)]
  }

  return moveIndex
}

export const applyMove = (state, index, symbol) => {
  state.board[index] = symbol
}

export const finishGame = (state, outcome) => {
  state.gameOver = true
  state.machineThinking = false

  if (outcome === 'win') state.score.wins++
  if (outcome === 'loss') state.score.losses++
  if (outcome === 'draw') state.score.draws++

  saveScore(state.score)
}

export const resetBoard = (state) => {
  state.board = Array(9).fill('')
  state.gameOver = false
  state.machineThinking = false
}
