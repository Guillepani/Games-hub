export const getRandomPosition = (size, occupiedCells) => {
  let position

  do {
    position = {
      x: Math.floor(Math.random() * size),
      y: Math.floor(Math.random() * size)
    }
  } while (
    occupiedCells.some((cell) => cell.x === position.x && cell.y === position.y)
  )

  return position
}
