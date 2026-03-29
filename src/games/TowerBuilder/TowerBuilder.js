import './TowerBuilder.css'
import { Button } from '../../components/Button/Button'
import { renderPage } from '../../main'
import { Home } from '../../pages/Home/Home'

const STORAGE_KEY = 'gamesHubTowerBuilderBestScore'

export const TowerBuilder = () => {
  const section = document.createElement('section')
  section.classList.add('game-view', 'tower-builder', 'container')

  let score = 0
  let bestScore = Number(localStorage.getItem(STORAGE_KEY)) || 0

  let currentWidth = 220
  let currentLeft = 0
  let currentDirection = 1
  let animationId = null
  let gameOver = false
  let started = false

  const stack = []

  section.innerHTML = `
    <h2>Tower Builder</h2>
    <p>Detén cada bloque en el momento exacto para construir la torre más alta posible.</p>
  `

  const scoreboard = document.createElement('div')
  scoreboard.classList.add('tower-builder__scoreboard')
  scoreboard.innerHTML = `
    <div class="tower-builder__score-card">
      <span>Puntuación</span>
      <strong class="tower-builder__score">0</strong>
    </div>
    <div class="tower-builder__score-card">
      <span>Récord</span>
      <strong class="tower-builder__best">${bestScore}</strong>
    </div>
  `

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

  const message = document.createElement('p')
  message.classList.add('tower-builder__message')
  message.textContent = 'Pulsa “Colocar bloque” para empezar.'

  const controls = document.createElement('div')
  controls.classList.add('tower-builder__controls')

  const placeButton = Button('Colocar bloque')
  const restartButton = Button('Reiniciar partida')
  const resetScoreButton = Button('Resetear récord')
  const homeButton = Button('Volver al inicio')

  controls.append(placeButton, restartButton, resetScoreButton, homeButton)
  gameArea.append(sky, stackContainer, activeBlock)
  section.append(scoreboard, gameArea, message, controls)

  const scoreValue = scoreboard.querySelector('.tower-builder__score')
  const bestValue = scoreboard.querySelector('.tower-builder__best')

  const BLOCK_HEIGHT = 34
  const SPEED = 2.6

  const updateCamera = () => {
    const areaHeight = gameArea.clientHeight
    const towerHeight = stack.length * BLOCK_HEIGHT

    // margen inferior visible (donde se juega)
    const baseOffset = 120

    const offset = Math.max(0, towerHeight - (areaHeight - baseOffset))

    stackContainer.style.transform = `translateY(${offset}px)`
    activeBlock.style.transform = `translateY(${offset}px)`
  }

  const updateActiveBlock = () => {
    activeBlock.style.width = `${currentWidth}px`
    activeBlock.style.left = `${currentLeft}px`
    activeBlock.style.bottom = `${stack.length * BLOCK_HEIGHT + BLOCK_HEIGHT + 16}px`
    activeBlock.style.zIndex = '10'
    activeBlock.style.opacity = '1'
    updateCamera()
  }

  const updateScore = () => {
    scoreValue.textContent = score
    bestValue.textContent = bestScore
  }

  const saveBestScore = () => {
    if (score > bestScore) {
      bestScore = score
      localStorage.setItem(STORAGE_KEY, bestScore)
      bestValue.textContent = bestScore
    }
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
    stackContainer.innerHTML = ''
    stackContainer.style.transform = 'translateY(0)'
    activeBlock.style.transform = 'translateY(0)'
  }

  const stopAnimation = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
  }

  const endGame = () => {
    gameOver = true
    stopAnimation()
    saveBestScore()
    message.textContent = `Game over. Tu torre llegó a ${score} bloques.`
  }

  const startAnimation = () => {
    stopAnimation()

    const animate = () => {
      if (gameOver) return

      const areaWidth = gameArea.clientWidth

      currentLeft += SPEED * currentDirection

      if (currentLeft <= 0) {
        currentLeft = 0
        currentDirection = 1
      }

      if (currentLeft + currentWidth >= areaWidth) {
        currentLeft = areaWidth - currentWidth
        currentDirection = -1
      }

      updateActiveBlock()
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
  }

  const startFirstBlock = () => {
    currentWidth = 220
    currentLeft = 0
    currentDirection = 1
    started = true
    message.textContent = '¡Ahora sí! Para la pieza en el mejor momento.'
    updateActiveBlock()
    startAnimation()
  }

  const prepareNextBlock = (baseBlock) => {
    currentWidth = baseBlock.width
    currentLeft = 0
    currentDirection = 1
    updateActiveBlock()
  }

  const handlePlaceBlock = () => {
    if (gameOver) return

    if (!started) {
      startFirstBlock()
      return
    }

    stopAnimation()

    if (stack.length === 0) {
      stack.push({ width: currentWidth, left: currentLeft })
      createPlacedBlock(currentWidth, currentLeft, 0)
      score = 1
      updateScore()
      message.textContent = 'Buen comienzo. Sigue apilando.'
      prepareNextBlock(stack[stack.length - 1])
      startAnimation()
      return
    }

    const previousBlock = stack[stack.length - 1]
    const previousLeft = previousBlock.left
    const previousRight = previousBlock.left + previousBlock.width
    const currentRight = currentLeft + currentWidth

    const overlapLeft = Math.max(previousLeft, currentLeft)
    const overlapRight = Math.min(previousRight, currentRight)
    const overlapWidth = overlapRight - overlapLeft

    if (overlapWidth <= 0) {
      activeBlock.style.opacity = '0.35'
      endGame()
      return
    }

    currentWidth = overlapWidth
    currentLeft = overlapLeft

    stack.push({ width: currentWidth, left: currentLeft })
    createPlacedBlock(currentWidth, currentLeft, stack.length - 1)

    score++
    updateScore()

    if (currentWidth < 60) {
      message.textContent =
        'Va fina la cosa... cuidado, que ya casi no queda margen.'
    } else if (currentWidth < 120) {
      message.textContent = 'Muy bien. Cada vez exige más precisión.'
    } else {
      message.textContent = 'Buen corte. Sigue subiendo.'
    }

    prepareNextBlock(stack[stack.length - 1])
    startAnimation()
  }

  const resetGame = () => {
    stopAnimation()
    score = 0
    currentWidth = 220
    currentLeft = 0
    currentDirection = 1
    gameOver = false
    started = false
    stack.length = 0

    clearPlacedBlocks()
    activeBlock.style.opacity = '1'
    updateScore()
    updateActiveBlock()
    message.textContent = 'Pulsa “Colocar bloque” para empezar.'
  }

  const resetBestScore = () => {
    bestScore = 0
    localStorage.removeItem(STORAGE_KEY)
    updateScore()
  }

  placeButton.addEventListener('click', handlePlaceBlock)
  restartButton.addEventListener('click', resetGame)
  resetScoreButton.addEventListener('click', resetBestScore)
  homeButton.addEventListener('click', () => renderPage(Home()))

  updateScore()
  updateActiveBlock()

  return section
}
