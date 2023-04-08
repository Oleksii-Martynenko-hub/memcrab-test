import { createContext, Dispatch, SetStateAction, useMemo, useState } from 'react';

import Main from 'src/app/containers/main/main';

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
  
  return (
    <RowsAmountContext.Provider value={rowsAmountValue}>
      <ColumnsContext.Provider value={columnsAmountValue}>
        <NearestContext.Provider value={nearestAmountValue}>
          <RowsContext.Provider value={rowsValue}>
            <HoveredSumRowContext.Provider value={hoveredSumRowValue}>
              <Main />
            </HoveredSumRowContext.Provider>
          </RowsContext.Provider>
        </NearestContext.Provider>
      </ColumnsContext.Provider>
    </RowsAmountContext.Provider>

  );
}

export default App;
