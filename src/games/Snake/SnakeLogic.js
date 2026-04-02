import { getRandomPosition } from '../../utils/helpers'
import { getStoredValue, setStoredValue } from '../../utils/storage'

const GRID_SIZE = 20
const STORAGE_KEY = 'gamesHubSnakeBestScore'

export const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
}

export const createSnakeState = () => ({
  snake: [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ],
  direction: { x: 1, y: 0 },
  nextDirection: { x: 1, y: 0 },
  food: null,
  score: 0,
  bestScore: getStoredValue(STORAGE_KEY, 0),
  gameStarted: false,
  gameOver: false
})

export const initFood = (state) => {
  state.food = getRandomPosition(GRID_SIZE, state.snake)
}

export const setDirection = (state, newDirection) => {
  if (state.gameOver) return false

  const isOpposite =
    newDirection.x === -state.direction.x &&
    newDirection.y === -state.direction.y

  if (state.gameStarted && isOpposite) return false

  state.nextDirection = newDirection

  if (!state.gameStarted) {
    state.gameStarted = true
    return true
  }

  return false
}

export const moveSnake = (state) => {
  if (state.gameOver) return { status: 'gameover' }

  state.direction = state.nextDirection

  const newHead = {
    x: state.snake[0].x + state.direction.x,
    y: state.snake[0].y + state.direction.y
  }

  const hitsWall =
    newHead.x < 0 ||
    newHead.x >= GRID_SIZE ||
    newHead.y < 0 ||
    newHead.y >= GRID_SIZE

  const hitsBody = state.snake.some(
    (segment) => segment.x === newHead.x && segment.y === newHead.y
  )

  if (hitsWall || hitsBody) {
    state.gameOver = true
    return { status: 'gameover' }
  }

  state.snake.unshift(newHead)

  const hasEaten = newHead.x === state.food.x && newHead.y === state.food.y

  if (hasEaten) {
    state.score++
    state.food = getRandomPosition(GRID_SIZE, state.snake)

    if (state.score > state.bestScore) {
      state.bestScore = state.score
      setStoredValue(STORAGE_KEY, state.bestScore)
    }

    return { status: 'eaten' }
  }

  state.snake.pop()
  return { status: 'moved' }
}

export const resetBestScore = (state) => {
  state.bestScore = 0
  setStoredValue(STORAGE_KEY, 0)
}

export { GRID_SIZE }
