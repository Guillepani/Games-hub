import './Button.css'

export const Button = (text) => {
  const button = document.createElement('button')
  button.textContent = text
  button.classList.add('btn')

  return button
}
