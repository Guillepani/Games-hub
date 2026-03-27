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

  const headerSubtitle = header.querySelector('p')
  if (headerSubtitle) {
    headerSubtitle.remove()
  }

  const introSection = document.createElement('section')
  introSection.classList.add('home-intro', 'container')

  const introBadge = document.createElement('span')
  introBadge.classList.add('home-intro-badge')
  introBadge.textContent = 'Experiencia arcade by Guillem Paniagua'

  const introTitle = document.createElement('h2')
  introTitle.textContent = 'Tres juegos, un solo hub'

  const introText = document.createElement('p')
  introText.textContent =
    'Desafía tus habilidades para jugar y superar tu mejor puntuación.'

  introSection.append(introBadge, introTitle, introText)

  const gamesSection = document.createElement('section')
  gamesSection.classList.add('games-section', 'container')

  const routes = {
    tictactoe: TicTacToe,
    snake: Snake,
    towerbuilder: TowerBuilder
  }

  for (const game of gamesData) {
    const card = GameCard(game)
    const button = card.querySelector('button')

    if (button && routes[game.id]) {
      button.addEventListener('click', () => {
        renderPage(routes[game.id]())
      })
    }

    gamesSection.append(card)
  }

  main.append(header, introSection, gamesSection)

  return main
}
