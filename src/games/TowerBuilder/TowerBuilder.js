import './TowerBuilder.css'
import { Button } from '../../components/Button/Button'
import { renderPage } from '../../main'
import { Home } from '../../pages/Home/Home'
import {
  createTowerState,
  resetTowerState,
  saveBestScore,
  resetBestScore,
  moveBlock,
  placeBlock,
  prepareNextBlock,
  BLOCK_HEIGHT,
  INITIAL_WIDTH
} from './TowerBuilderLogic'

export const TowerBuilder = () => {
  const section = document.createElement('section')
  section.classList.add('game-view', 'tower-builder', 'container')

  let state = createTowerState()
  let animationId = null

  // HEADER
  const title = document.createElement('h2')
  title.textContent = 'Tower Builder'

  const description = document.createElement('p')
  description.textContent =
    'Detén cada bloque en el momento exacto para construir la torre más alta posible.'

  // SCOREBOARD
  const scoreboard = document.createElement('div')
  scoreboard.classList.add('tower-builder__scoreboard')

  const scoreCard = document.createElement('div')
  scoreCard.classList.add('tower-builder__score-card')
  const scoreLabel = document.createElement('span')
  scoreLabel.textContent = 'Puntuación'
  const scoreValue = document.createElement('strong')
  scoreValue.classList.add('tower-builder__score')
  scoreValue.textContent = '0'
  scoreCard.append(scoreLabel, scoreValue)

  const bestCard = document.createElement('div')
  bestCard.classList.add('tower-builder__score-card')
  const bestLabel = document.createElement('span')
  bestLabel.textContent = 'Récord'
  const bestValue = document.createElement('strong')
  bestValue.classList.add('tower-builder__best')
  bestValue.textContent = state.bestScore
  bestCard.append(bestLabel, bestValue)

  scoreboard.append(scoreCard, bestCard)

  // GAME AREA
  const gameArea = document.createElement('div')
  gameArea.classList.add('tower-builder__area')

  const sky = document.createElement('div')
  sky.classList.add('tower-builder__sky')

  const stackContainer = document.createElement('div')
  stackContainer.classList.add('tower-builder__stack')
  stackContainer.style.transition = 'transform 0.2s ease-out'

  const activeBlock = document.createElement('div')
  activeBlock.classList.add(
    'tower-builder__block',
    'tower-builder__block--active'
  )
  activeBlock.style.transition = 'transform 0.2s ease-out'

  gameArea.append(sky, stackContainer, activeBlock)

  // MENSAJE
  const message = document.createElement('p')
  message.classList.add('tower-builder__message')
  message.textContent = 'Pulsa "Colocar bloque" para empezar.'

  // CONTROLES
  const controls = document.createElement('div')
  controls.classList.add('tower-builder__controls')

  const placeButton = Button('Colocar bloque')
  const restartButton = Button('Reiniciar partida')
  const resetScoreButton = Button('Resetear récord')
  const homeButton = Button('Volver al inicio')

  controls.append(placeButton, restartButton, resetScoreButton, homeButton)
  section.append(title, description, scoreboard, gameArea, message, controls)

  // RENDER
  const updateScore = () => {
    scoreValue.textContent = state.score
    bestValue.textContent = state.bestScore
  }

  const updateCamera = () => {
    const areaHeight = gameArea.clientHeight
    const towerHeight = state.stack.length * BLOCK_HEIGHT
    const baseOffset = 120
    const offset = Math.max(0, towerHeight - (areaHeight - baseOffset))
    stackContainer.style.transform = `translateY(${offset}px)`
    activeBlock.style.transform = `translateY(${offset}px)`
  }

  const updateActiveBlock = () => {
    activeBlock.style.width = `${state.currentWidth}px`
    activeBlock.style.left = `${state.currentLeft}px`
    activeBlock.style.bottom = `${state.stack.length * BLOCK_HEIGHT + BLOCK_HEIGHT + 16}px`
    activeBlock.style.zIndex = '10'
    activeBlock.style.opacity = '1'
    updateCamera()
  }

  const createPlacedBlock = (width, left, level) => {
    const block = document.createElement('div')
    block.classList.add('tower-builder__block', 'tower-builder__block--placed')
    block.style.width = `${width}px`
    block.style.left = `${left}px`
    block.style.bottom = `${level * BLOCK_HEIGHT + 16}px`
    stackContainer.append(block)
    updateCamera()
  }

  const clearPlacedBlocks = () => {
    while (stackContainer.firstChild) {
      stackContainer.removeChild(stackContainer.firstChild)
    }
    stackContainer.style.transform = 'translateY(0)'
    activeBlock.style.transform = 'translateY(0)'
  }

  // ANIMACIÓN
  const stopAnimation = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
  }

  const startAnimation = () => {
    stopAnimation()

    const animate = () => {
      if (state.gameOver) return
      moveBlock(state, gameArea.clientWidth)
      updateActiveBlock()
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
  }

  // ACCIONES
  const handlePlaceBlock = () => {
    if (state.gameOver) return

    if (!state.started) {
      state.started = true
      state.currentWidth = INITIAL_WIDTH
      state.currentLeft = 0
      state.currentDirection = 1
      message.textContent = '¡Ahora sí! Para la pieza en el mejor momento.'
      updateActiveBlock()
      startAnimation()
      return
    }

    stopAnimation()

    const result = placeBlock(state)

    if (result.status === 'gameover') {
      activeBlock.style.opacity = '0.35'
      saveBestScore(state)
      updateScore()
      message.textContent = `Game over. Tu torre llegó a ${state.score} bloques.`
      return
    }

    if (result.status === 'first') {
      createPlacedBlock(state.currentWidth, state.currentLeft, 0)
      updateScore()
      message.textContent = 'Buen comienzo. Sigue apilando.'
      prepareNextBlock(state)
      startAnimation()
      return
    }

    createPlacedBlock(
      state.currentWidth,
      state.currentLeft,
      state.stack.length - 1
    )
    updateScore()

    if (result.precision === 'low') {
      message.textContent =
        'Va fina la cosa... cuidado, que ya casi no queda margen.'
    } else if (result.precision === 'mid') {
      message.textContent = 'Muy bien. Cada vez exige más precisión.'
    } else {
      message.textContent = 'Buen corte. Sigue subiendo.'
    }

    prepareNextBlock(state)
    startAnimation()
  }

  const handleRestart = () => {
    stopAnimation()
    resetTowerState(state)
    clearPlacedBlocks()
    activeBlock.style.opacity = '1'
    updateScore()
    updateActiveBlock()
    message.textContent = 'Pulsa "Colocar bloque" para empezar.'
  }

  const handleResetBest = () => {
    resetBestScore(state)
    updateScore()
  }

  const cleanup = () => {
    stopAnimation()
  }

  placeButton.addEventListener('click', handlePlaceBlock)
  restartButton.addEventListener('click', handleRestart)
  resetScoreButton.addEventListener('click', handleResetBest)
  homeButton.addEventListener('click', () => {
    cleanup()
    renderPage(Home())
  })

  updateScore()
  updateActiveBlock()

  return section
}
