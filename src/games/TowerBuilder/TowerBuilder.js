import './TowerBuilder.css'
import { Button } from '../../components/Button/Button'
import { renderPage } from '../../main'
import { Home } from '../../pages/Home/Home'

export const TowerBuilder = () => {
  const section = document.createElement('section')
  section.classList.add('game-view', 'container')

  const title = document.createElement('h2')
  title.textContent = 'Tower Builder'

  const text = document.createElement('p')
  text.textContent = 'Aquí irá el juego de Tower Builder.'

  const backButton = Button('Volver al inicio')
  backButton.addEventListener('click', () => {
    renderPage(Home())
  })

  section.append(title, text, backButton)

  return section
}
