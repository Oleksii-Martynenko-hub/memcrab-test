import { createContext, Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

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

type KeyType = string | number | symbol
type ContextValueType<T, V extends KeyType, A extends KeyType> = Record<V, T> & Record<A, Dispatch<SetStateAction<T>>>
export type RowsAmountContextType = ContextValueType<number | null, 'rowsAmount', 'setRowsAmount'>
export const RowsAmountContext = createContext<RowsAmountContextType>({} as RowsAmountContextType)

export type ColumnsContextType = ContextValueType<number | null, 'columnsAmount', 'setColumnsAmount'>
export const ColumnsContext = createContext<ColumnsContextType>({} as ColumnsContextType)

export type NearestContextType = ContextValueType<number | null, 'nearestAmount', 'setNearestAmount'>
export const NearestContext = createContext<NearestContextType>({} as NearestContextType)

export type RowsContextType = ContextValueType<Row[], 'rows', 'setRows'>
export const RowsContext = createContext<RowsContextType>({} as RowsContextType)

export type HoveredSumRowContextType = ContextValueType<string | null, 'hoveredSumRow', 'setHoveredSumRow'>
export const HoveredSumRowContext = createContext<HoveredSumRowContextType>({} as HoveredSumRowContextType)

export function App() {
  const [rows, setRows] = useState<Row[]>([])
  const [rowsAmount, setRowsAmount] = useState<number | null>(null)
  const [columnsAmount, setColumnsAmount] = useState<number | null>(null)
  const [nearestAmount, setNearestAmount] = useState<number | null>(null)
  const [hoveredSumRow, setHoveredSumRow] = useState<string | null>(null) //
  
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

  const rowsValue = useMemo(
    () => ({
      rows,
      setRows,
    }),
    [rows],
  )

  const hoveredSumRowValue = useMemo(
    () => ({
      hoveredSumRow,
      setHoveredSumRow,
    }),
    [hoveredSumRow],
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
    <RowsAmountContext.Provider value={rowsAmountValue}>
      <ColumnsContext.Provider value={columnsAmountValue}>
        <NearestContext.Provider value={nearestAmountValue}>
          <RowsContext.Provider value={rowsValue}>
            <HoveredSumRowContext.Provider value={hoveredSumRowValue}>
              <div className={styles.container}>
                <Header />

                <Table />
              
              </div>
            </HoveredSumRowContext.Provider>
          </RowsContext.Provider>
        </NearestContext.Provider>
      </ColumnsContext.Provider>
    </RowsAmountContext.Provider>

  );
}

export default App;
