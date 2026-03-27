import './Snake.css'
import { renderPage } from '../../main'
import { Home } from '../../pages/Home/Home'

const GRID_SIZE = 20
const GAME_SPEED = 260
const STORAGE_KEY = 'gamesHubSnakeBestScore'

const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
}

const getBestScore = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? Number(saved) : 0
}

const saveBestScore = (score) => {
  localStorage.setItem(STORAGE_KEY, String(score))
}

const getRandomPosition = (snake) => {
  let position

  do {
    position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }
  } while (
    snake.some(
      (segment) => segment.x === position.x && segment.y === position.y
    )
  )

  return position
}

const createGameButton = (text, className = '') => {
  const button = document.createElement('button')
  button.classList.add('btn')

  if (className) {
    button.classList.add(className)
  }

  button.textContent = text
  button.type = 'button'

  return button
}

export const Snake = () => {
  const section = document.createElement('section')
  section.classList.add('game-view', 'snake-view', 'container')

  let snake = []
  let direction = { x: 1, y: 0 }
  let nextDirection = { x: 1, y: 0 }
  let food = null
  let score = 0
  let bestScore = getBestScore()
  let gameInterval = null
  let gameStarted = false
  let gameOver = false

  let touchStartX = 0
  let touchStartY = 0

  const title = document.createElement('h2')
  title.classList.add('game-title', 'text-center')
  title.textContent = 'Snake'

  const description = document.createElement('p')
  description.classList.add('game-description', 'text-center')
  description.textContent = 'Come, crece y aguanta todo lo que puedas.'

  const scoreboard = document.createElement('div')
  scoreboard.classList.add('snake-scoreboard', 'card')

  const scoreText = document.createElement('p')
  scoreText.classList.add('snake-score')

  const bestScoreText = document.createElement('p')
  bestScoreText.classList.add('snake-best-score')

  const statusMessage = document.createElement('p')
  statusMessage.classList.add('snake-status', 'text-center')

  const boardWrapper = document.createElement('div')
  boardWrapper.classList.add('snake-board-wrapper')

  const board = document.createElement('div')
  board.classList.add('snake-board')
  board.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`
  board.style.gridTemplateRows = `repeat(${GRID_SIZE}, 1fr)`

  const controlsInfo = document.createElement('p')
  controlsInfo.classList.add('snake-controls-info', 'text-center')
  controlsInfo.textContent =
    'En el PC usa las flechas del teclado. En móviles, desliza en la dirección que quieras mover la serpiente.'

  const buttonsContainer = document.createElement('div')
  buttonsContainer.classList.add('snake-buttons')

  const restartButton = createGameButton('Reiniciar partida')
  const resetBestButton = createGameButton('Resetear récord')
  const backButton = createGameButton('Volver al inicio')

  const updateScoreboard = () => {
    scoreText.textContent = `Puntuación: ${score}`
    bestScoreText.textContent = `Mejor puntuación: ${bestScore}`
  }

  const drawBoard = () => {
    board.innerHTML = ''

    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const cell = document.createElement('div')
        cell.classList.add('snake-cell')

        const isHead = snake[0]?.x === x && snake[0]?.y === y
        const isBody = snake.some(
          (segment, index) => index !== 0 && segment.x === x && segment.y === y
        )
        const isFood = food?.x === x && food?.y === y

        if (isHead) cell.classList.add('snake-head')
        if (isBody) cell.classList.add('snake-body')
        if (isFood) cell.classList.add('snake-food')

        board.append(cell)
      }
    }
  }

  const stopGame = () => {
    if (gameInterval) {
      clearInterval(gameInterval)
      gameInterval = null
    }
  }

  const setupInitialState = () => {
    snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ]

    direction = { x: 1, y: 0 }
    nextDirection = { x: 1, y: 0 }
    food = getRandomPosition(snake)
    score = 0
    gameStarted = false
    gameOver = false

    statusMessage.textContent = 'Empieza cuando quieras.'
    updateScoreboard()
    drawBoard()
  }

  const endGame = () => {
    gameOver = true
    stopGame()
    statusMessage.textContent = 'Game over. Pulsa Reiniciar partida.'
  }

  const moveSnake = () => {
    if (gameOver) return

    direction = nextDirection

    const newHead = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y
    }

    const hitsWall =
      newHead.x < 0 ||
      newHead.x >= GRID_SIZE ||
      newHead.y < 0 ||
      newHead.y >= GRID_SIZE

    const hitsBody = snake.some(
      (segment) => segment.x === newHead.x && segment.y === newHead.y
    )

    if (hitsWall || hitsBody) {
      endGame()
      return
    }

    snake.unshift(newHead)

    const hasEaten = newHead.x === food.x && newHead.y === food.y

    if (hasEaten) {
      score += 1
      food = getRandomPosition(snake)
      statusMessage.textContent = '¡Bien! Sigue así.'

      if (score > bestScore) {
        bestScore = score
        saveBestScore(bestScore)
      }
    } else {
      snake.pop()
    }

    updateScoreboard()
    drawBoard()
  }

  const startGame = () => {
    stopGame()
    gameInterval = setInterval(moveSnake, GAME_SPEED)
  }

  const setDirection = (newDirection) => {
    if (gameOver) return

    const isOppositeDirection =
      newDirection.x === -direction.x && newDirection.y === -direction.y

    if (gameStarted && isOppositeDirection) return

    nextDirection = newDirection

    if (!gameStarted) {
      gameStarted = true
      statusMessage.textContent = 'Partida en marcha...'
      startGame()
    }
  }

  const handleKeyDown = (event) => {
    if (!DIRECTIONS[event.key]) return

    event.preventDefault()
    setDirection(DIRECTIONS[event.key])
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
    const minSwipeDistance = 24

    if (absX < minSwipeDistance && absY < minSwipeDistance) return

    if (absX > absY) {
      if (diffX > 0) {
        setDirection(DIRECTIONS.ArrowRight)
      } else {
        setDirection(DIRECTIONS.ArrowLeft)
      }
    } else {
      if (diffY > 0) {
        setDirection(DIRECTIONS.ArrowDown)
      } else {
        setDirection(DIRECTIONS.ArrowUp)
      }
    }
  }

  const resetGame = () => {
    stopGame()
    setupInitialState()
  }

  const resetBestScore = () => {
    bestScore = 0
    saveBestScore(bestScore)
    updateScoreboard()
  }

  const cleanup = () => {
    stopGame()
    document.removeEventListener('keydown', handleKeyDown)
    board.removeEventListener('touchstart', handleTouchStart)
    board.removeEventListener('touchend', handleTouchEnd)
  }

  restartButton.addEventListener('click', resetGame)
  resetBestButton.addEventListener('click', resetBestScore)
  backButton.addEventListener('click', () => {
    cleanup()
    renderPage(Home())
  })

  document.addEventListener('keydown', handleKeyDown)
  board.addEventListener('touchstart', handleTouchStart, { passive: true })
  board.addEventListener('touchend', handleTouchEnd, { passive: true })

  scoreboard.append(scoreText, bestScoreText)
  boardWrapper.append(board)
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

  setupInitialState()

  return section
}
