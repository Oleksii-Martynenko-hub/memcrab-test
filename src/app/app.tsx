import { createContext, useEffect, useMemo, useState } from 'react';

import { generateCells } from 'src/utils/generateCells';
import Header from './header/header';
import Table from './table/table';

import styles from './app.module.scss';

export interface InputData {
  rows: number;
  columns: number;
  nearest: number;
}

export type Cell = {
  id: string,
  amount: number
}

export type Row = {
  id: string;
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
    const cellAmount = (rowsAmount || 0) * (columnsAmount || 0)

    if (nearestAmount !== null && nearestAmount >= cellAmount) {
      setNearestAmount(cellAmount < 1 ? 0 : cellAmount - 1)
    }

    generateDataRows(rowsAmount || 0, columnsAmount || 0)
    
  }, [rowsAmount, columnsAmount])

  const generateDataRows = (rowsAmount: number, columnsAmount: number) => {
    if (
      (rows.length && rows[0].cells.length) && 
      (rowsAmount === rows.length && columnsAmount === rows[0].cells.length)
    ) return

    const rowsData = []

    for (let r = 0; r < rowsAmount; r++) {
      const cells = generateCells(r.toString().padStart(3, '0'), columnsAmount)

      rowsData.push({ id: r.toString().padStart(3, '0'), cells })
    }

    setRows(rowsData)
  }
  
  return (
    <RowsContext.Provider value={rowsAmountValue}>
      <ColumnsContext.Provider value={columnsAmountValue}>
        <NearestContext.Provider value={nearestAmountValue}>
          <div className={styles.container}>
            <Header />

            <Table rows={rows} setRows={setRows} />
          
          </div>
        </NearestContext.Provider>
      </ColumnsContext.Provider>
    </RowsContext.Provider>

  );
}

export default App;
