import { createContext, useMemo, useState } from 'react';

export interface InputData {
  rows: number;
  columns: number;
  nearest: number;
}

export type Cell = {
  id: number,
  amount: number
}

export type Row = {
  id: number;
  cells: Cell[];
}

export const RowsContext = createContext<{
  rowsAmount: number | null
  setRowsAmount: React.Dispatch<React.SetStateAction<number | null>>
}>({
  rowsAmount: null,
  setRowsAmount: () => void 0,
})

export const ColumnsContext = createContext(0)

export const NearestContext = createContext(0)

export const HoveredCellContext = createContext(0)

export function App() {
  const [rowsAmount, setRowsAmount] = useState<number | null>(null)

  const rowsAmountValue = useMemo(
    () => ({
      rowsAmount,
      setRowsAmount,
    }),
    [rowsAmount],
  )
  
  return (
    <RowsContext.Provider value={rowsAmountValue}>
      

    </RowsContext.Provider>

  );
}

export default App;
