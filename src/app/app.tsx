import { createContext, useEffect, useMemo, useState } from 'react';

import Header from './header/header';

import styles from './app.module.scss';

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

export const ColumnsContext = createContext<{
  columnsAmount: number | null
  setColumnsAmount: React.Dispatch<React.SetStateAction<number | null>>
}>({
  columnsAmount: null,
  setColumnsAmount: () => void 0,
})

export const NearestContext = createContext<{
  nearestAmount: number | null
  setNearestAmount: React.Dispatch<React.SetStateAction<number | null>>
}>({
  nearestAmount: null,
  setNearestAmount: () => void 0,
})

export const HoveredCellContext = createContext(0)

export function App() {
  const [rowsAmount, setRowsAmount] = useState<number | null>(null)
  const [columnsAmount, setColumnsAmount] = useState<number | null>(null)
  const [nearestAmount, setNearestAmount] = useState<number | null>(null)
  
  const rowsAmountValue = useMemo(
    () => ({
      rowsAmount,
      setRowsAmount,
    }),
    [rowsAmount],
  )
  
  const columnsAmountValue = useMemo(
    () => ({
      columnsAmount,
      setColumnsAmount,
    }),
    [columnsAmount],
  )
    
  const nearestAmountValue = useMemo(
    () => ({
      nearestAmount,
      setNearestAmount,
    }),
    [nearestAmount],
  )

  useEffect(() => {
    if (rowsAmount !== null && columnsAmount !== null) {
      const cellAmount = rowsAmount * columnsAmount
      setNearestAmount((nearestAmount || 0) >= cellAmount ? cellAmount - 1 : nearestAmount)
    }
  }, [rowsAmount, columnsAmount])
  
  return (
    <RowsContext.Provider value={rowsAmountValue}>
      <ColumnsContext.Provider value={columnsAmountValue}>
        <NearestContext.Provider value={nearestAmountValue}>
          <div className={styles.container}>
            <Header />
          
          </div>
        </NearestContext.Provider>
      </ColumnsContext.Provider>
    </RowsContext.Provider>

  );
}

export default App;
