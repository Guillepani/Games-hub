import './Home.css'
import { Header } from '../../components/Header/Header'
import { GameCard } from '../../components/GameCard/GameCard'
import { gamesData } from '../../data/gamesData'
import { renderPage } from '../../main'
import { TicTacToe } from '../../games/TicTacToe/TicTacToe'
import { Snake } from '../../games/Snake/Snake'
import { TowerBuilder } from '../../games/TowerBuilder/TowerBuilder'

export const Home = () => {
  const main = document.createElement('main')
  main.classList.add('home')

  const header = Header()

  const introSection = document.createElement('section')
  introSection.classList.add('home-intro', 'container')

  const introTitle = document.createElement('h2')
  introTitle.textContent = 'Tres juegos, un solo hub'

  const introText = document.createElement('p')
  introText.textContent =
    'Disfruta de una colección de juegos interactivos desarrollados con JavaScript vanilla. Entra, juega y trata de superar tu mejor puntuación.'

  introSection.append(introTitle, introText)

  const gamesSection = document.createElement('section')
  gamesSection.classList.add('games-section', 'container')

  for (const game of gamesData) {
    const card = GameCard(game)
    const button = card.querySelector('button')

    if (game.id === 'tictactoe') {
      button.addEventListener('click', () => {
        renderPage(TicTacToe())
      })
    }

    if (game.id === 'snake') {
      button.addEventListener('click', () => {
        renderPage(Snake())
      })
    }

    if (game.id === 'towerbuilder') {
      button.addEventListener('click', () => {
        renderPage(TowerBuilder())
      })
    }

    gamesSection.append(card)
  }

  main.append(header, introSection, gamesSection)

  return main
}
