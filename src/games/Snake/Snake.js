import './Snake.css'
import { renderPage } from '../../main'
import { Home } from '../../pages/Home/Home'
import { Button } from '../../components/Button/Button'
import {
  DIRECTIONS,
  GRID_SIZE,
  createSnakeState,
  initFood,
  setDirection,
  moveSnake,
  resetBestScore
} from './SnakeLogic'

const GAME_SPEED = 260

export const Snake = () => {
  const section = document.createElement('section')
  section.classList.add('game-view', 'snake-view', 'container')

  let state = createSnakeState()
  let gameInterval = null
  let touchStartX = 0
  let touchStartY = 0

  // HEADER
  const title = document.createElement('h2')
  title.classList.add('game-title', 'text-center')
  title.textContent = 'Snake'

  const description = document.createElement('p')
  description.classList.add('game-description', 'text-center')
  description.textContent = 'Come, crece y aguanta todo lo que puedas.'

  // SCOREBOARD
  const scoreboard = document.createElement('div')
  scoreboard.classList.add('snake-scoreboard', 'card')

  const scoreText = document.createElement('p')
  scoreText.classList.add('snake-score')

  const bestScoreText = document.createElement('p')
  bestScoreText.classList.add('snake-best-score')

  scoreboard.append(scoreText, bestScoreText)

  // STATUS
  const statusMessage = document.createElement('p')
  statusMessage.classList.add('snake-status', 'text-center')

  // BOARD
  const boardWrapper = document.createElement('div')
  boardWrapper.classList.add('snake-board-wrapper')

  const board = document.createElement('div')
  board.classList.add('snake-board')
  board.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`
  board.style.gridTemplateRows = `repeat(${GRID_SIZE}, 1fr)`

  const cells = []
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement('div')
    cell.classList.add('snake-cell')
    cells.push(cell)
    board.append(cell)
  }

  boardWrapper.append(board)

  // CONTROLS INFO
  const controlsInfo = document.createElement('p')
  controlsInfo.classList.add('snake-controls-info', 'text-center')
  controlsInfo.textContent =
    'En el PC usa las flechas del teclado. En móviles, desliza en la dirección que quieras mover la serpiente.'

  // BUTTONS
  const buttonsContainer = document.createElement('div')
  buttonsContainer.classList.add('snake-buttons')

  const restartButton = Button('Reiniciar partida')
  const resetBestButton = Button('Resetear récord')
  const backButton = Button('Volver al inicio')

  buttonsContainer.append(restartButton, resetBestButton, backButton)

  section.append(
    title,
    description,
    scoreboard,
    statusMessage,
    boardWrapper,
    controlsInfo,
    buttonsContainer
  )

  // RENDER
  const updateScoreboard = () => {
    scoreText.textContent = `Puntuación: ${state.score}`
    bestScoreText.textContent = `Mejor puntuación: ${state.bestScore}`
  }

  const drawBoard = () => {
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const cell = cells[y * GRID_SIZE + x]
        cell.classList.remove('snake-head', 'snake-body', 'snake-food')

        if (state.snake[0]?.x === x && state.snake[0]?.y === y) {
          cell.classList.add('snake-head')
        } else if (
          state.snake.some((s, i) => i !== 0 && s.x === x && s.y === y)
        ) {
          cell.classList.add('snake-body')
        } else if (state.food?.x === x && state.food?.y === y) {
          cell.classList.add('snake-food')
        }
      }
    }
  }

  // GAME LOOP
  const stopGame = () => {
    if (gameInterval) {
      clearInterval(gameInterval)
      gameInterval = null
    }
  }

  const tick = () => {
    const result = moveSnake(state)

    if (result.status === 'gameover') {
      statusMessage.textContent = 'Game over. Pulsa Reiniciar partida.'
      stopGame()
    } else if (result.status === 'eaten') {
      statusMessage.textContent = '¡Bien! Sigue así.'
    }

    updateScoreboard()
    drawBoard()
  }

  const startGame = () => {
    stopGame()
    gameInterval = setInterval(tick, GAME_SPEED)
  }

  const handleDirection = (newDirection) => {
    const justStarted = setDirection(state, newDirection)
    if (justStarted) {
      statusMessage.textContent = 'Partida en marcha...'
      startGame()
    }
  }

  // EVENTOS
  const handleKeyDown = (event) => {
    if (!DIRECTIONS[event.key]) return
    event.preventDefault()
    handleDirection(DIRECTIONS[event.key])
  }

  const handleTouchStart = (event) => {
    const touch = event.changedTouches[0]
    touchStartX = touch.clientX
    touchStartY = touch.clientY
  }

  const handleTouchEnd = (event) => {
    const touch = event.changedTouches[0]
    const diffX = touch.clientX - touchStartX
    const diffY = touch.clientY - touchStartY
    const absX = Math.abs(diffX)
    const absY = Math.abs(diffY)
    const minSwipe = 24

    if (absX < minSwipe && absY < minSwipe) return

    if (absX > absY) {
      handleDirection(diffX > 0 ? DIRECTIONS.ArrowRight : DIRECTIONS.ArrowLeft)
    } else {
      handleDirection(diffY > 0 ? DIRECTIONS.ArrowDown : DIRECTIONS.ArrowUp)
    }
  }

  const resetGame = () => {
    stopGame()
    state = createSnakeState()
    initFood(state)
    statusMessage.textContent = 'Empieza cuando quieras.'
    updateScoreboard()
    drawBoard()
  }

  const cleanup = () => {
    stopGame()
    document.removeEventListener('keydown', handleKeyDown)
    board.removeEventListener('touchstart', handleTouchStart)
    board.removeEventListener('touchend', handleTouchEnd)
  }

  restartButton.addEventListener('click', resetGame)
  resetBestButton.addEventListener('click', () => {
    resetBestScore(state)
    updateScoreboard()
  })
  backButton.addEventListener('click', () => {
    cleanup()
    renderPage(Home())
  })

  document.addEventListener('keydown', handleKeyDown)
  board.addEventListener('touchstart', handleTouchStart, { passive: true })
  board.addEventListener('touchend', handleTouchEnd, { passive: true })

  // INIT
  initFood(state)
  statusMessage.textContent = 'Empieza cuando quieras.'
  updateScoreboard()
  drawBoard()

  return section
}
