import './style.css'
import { Home } from './pages/Home/Home'

const app = document.querySelector('#app')

export const renderPage = (page) => {
  app.innerHTML = ''
  app.append(page)
}

renderPage(Home())
