import './Header.css'

export const Header = () => {
  const header = document.createElement('header')
  header.classList.add('header')

  const title = document.createElement('h1')
  title.textContent = 'Games Hub'

  header.append(title)

  return header
}
