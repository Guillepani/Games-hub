import {
  getStoredValue,
  setStoredValue,
  removeStoredValue
} from '../../utils/storage'

const STORAGE_KEY = 'gamesHubTowerBuilderBestScore'

export const BLOCK_HEIGHT = 34
export const SPEED = 2.6
export const INITIAL_WIDTH = 220

export const createTowerState = () => ({
  score: 0,
  bestScore: getStoredValue(STORAGE_KEY, 0),
  currentWidth: INITIAL_WIDTH,
  currentLeft: 0,
  currentDirection: 1,
  animationId: null,
  gameOver: false,
  started: false,
  stack: []
})

export const saveBestScore = (state) => {
  if (state.score > state.bestScore) {
    state.bestScore = state.score
    setStoredValue(STORAGE_KEY, state.bestScore)
    return true
  }
  return false
}

export const resetBestScore = (state) => {
  state.bestScore = 0
  removeStoredValue(STORAGE_KEY)
}

export const resetTowerState = (state) => {
  state.score = 0
  state.currentWidth = INITIAL_WIDTH
  state.currentLeft = 0
  state.currentDirection = 1
  state.animationId = null
  state.gameOver = false
  state.started = false
  state.stack.length = 0
}

export const moveBlock = (state, areaWidth) => {
  state.currentLeft += SPEED * state.currentDirection

  if (state.currentLeft <= 0) {
    state.currentLeft = 0
    state.currentDirection = 1
  }

  if (state.currentLeft + state.currentWidth >= areaWidth) {
    state.currentLeft = areaWidth - state.currentWidth
    state.currentDirection = -1
  }
}

export const placeBlock = (state) => {
  if (state.stack.length === 0) {
    state.stack.push({ width: state.currentWidth, left: state.currentLeft })
    state.score = 1
    return { status: 'first' }
  }

  const previous =
    state.stack[state.length - 1] ?? state.stack[state.stack.length - 1]
  const previousLeft = previous.left
  const previousRight = previous.left + previous.width
  const currentRight = state.currentLeft + state.currentWidth

  const overlapLeft = Math.max(previousLeft, state.currentLeft)
  const overlapRight = Math.min(previousRight, currentRight)
  const overlapWidth = overlapRight - overlapLeft

  if (overlapWidth <= 0) {
    state.gameOver = true
    return { status: 'gameover' }
  }

  state.currentWidth = overlapWidth
  state.currentLeft = overlapLeft
  state.stack.push({ width: state.currentWidth, left: state.currentLeft })
  state.score++

  if (state.currentWidth < 60) return { status: 'placed', precision: 'low' }
  if (state.currentWidth < 120) return { status: 'placed', precision: 'mid' }
  return { status: 'placed', precision: 'high' }
}

export const prepareNextBlock = (state) => {
  const base = state.stack[state.stack.length - 1]
  state.currentWidth = base.width
  state.currentLeft = 0
  state.currentDirection = 1
}
