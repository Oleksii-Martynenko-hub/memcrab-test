import { generateRandomNumber } from "./generateRandomNumber";

export const generateCells = (rowId: string, amount: number) => {
  const cells = []

  for (let c = 0; c < amount; c++) {
    const amount = generateRandomNumber(999);
    cells.push({ id: rowId + c.toString(), amount })
  }

  return cells
}