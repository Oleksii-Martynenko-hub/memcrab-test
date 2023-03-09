import { createContext, useEffect, useMemo, useState } from 'react';

import Header from './header/header';

import styles from './app.module.scss';
import Table from './table/table';

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
  const [rows, setRows] = useState<Row[]>([])
  const [rowsAmount, setRowsAmount] = useState<number | null>(6)
  const [columnsAmount, setColumnsAmount] = useState<number | null>(6)
  const [nearestAmount, setNearestAmount] = useState<number | null>(3)
  
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

      if ((nearestAmount || 0) >= cellAmount) {
        setNearestAmount(cellAmount - 1)
      }

      generatedDataRows(rowsAmount, columnsAmount)
    }
  }, [rowsAmount, columnsAmount])

  const generatedDataRows = (rowsAmount: number, columnsAmount: number) => {
    const rowsData = []

    for (let r = 0; r < rowsAmount; r++) {
      const cells = []

      for (let c = 0; c < columnsAmount; c++) {
        const amount = Math.floor(Math.random()*(999+1));
        cells.push({ id: c, amount })
      }

      rowsData.push({ id: r, cells })
    }

    setRows(rowsData)
  }
  
  return (
    <RowsContext.Provider value={rowsAmountValue}>
      <ColumnsContext.Provider value={columnsAmountValue}>
        <NearestContext.Provider value={nearestAmountValue}>
          <div className={styles.container}>
            <Header />

            <Table rows={rows} />
          
          </div>
        </NearestContext.Provider>
      </ColumnsContext.Provider>
    </RowsContext.Provider>

  );
}

export default App;
