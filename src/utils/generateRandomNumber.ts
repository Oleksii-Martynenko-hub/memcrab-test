export const generateRandomNumber = (to: number, from = 0) => {
  return Math.floor(Math.random() * (to - from + 1) + from)
}