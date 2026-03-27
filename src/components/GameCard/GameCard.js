import './GameCard.css'
import { Button } from '../Button/Button'

export const GameCard = (game) => {
  const card = document.createElement('article')
  card.classList.add('game-card', 'card')

  const title = document.createElement('h2')
  title.textContent = game.title

  const description = document.createElement('p')
  description.textContent = game.description

  const button = Button(game.buttonText)
  button.dataset.id = game.id

  card.append(title, description, button)

  return card
}
