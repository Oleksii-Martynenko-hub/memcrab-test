import { generateRandomNumber } from "./generateRandomNumber";

export const generateCells = (rowId: string, amount: number) => {
  const cells = []

  for (let c = 0; c < amount; c++) {
    const num = generateRandomNumber(999);
    cells.push({ id: rowId + c.toString().padStart(2, '0'), amount: num })
  }

  return cells
}