import './Header.css'

export const Header = () => {
  const header = document.createElement('header')
  header.classList.add('header')

  const title = document.createElement('h1')
  title.textContent = 'Games Hub'

  const subtitle = document.createElement('p')
  subtitle.textContent = 'Elige un juego y pon a prueba tus habilidades'

  header.append(title, subtitle)

  return header
}