import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { FixedSizeListProps, ListChildComponentProps } from 'react-window';
import { Cell, ColumnsContext, HoveredSumRowContext, NearestContext, Row, RowsAmountContext, RowsContext } from 'src/app/app';

import { DataCell, DataCellProps } from '../data-cell/data-cell';
import { RowTitleCell, RowTitleCellProps } from '../row-title-cell/row-title-cell';
import { SumCell, SumCellProps } from '../sum-cell/sum-cell';
import styles from './row-table.module.scss';

/* eslint-disable-next-line */
export interface RowTableProps extends ListChildComponentProps {
  
}

export function RowTable({ index, style }: RowTableProps) {

  const { rows, setRows } = useContext(RowsContext)
  const { setRowsAmount } = useContext(RowsAmountContext)
  const { nearestAmount } = useContext(NearestContext)
  const { hoveredSumRow, setHoveredSumRow } = useContext(HoveredSumRowContext)

  const [hoveredCell, setHoveredCell] = useState<Cell | null>(null)
  const [nearestCellIdsByAmount, setNearestCellsByAmount] = useState<string[]>([])

  const row = useMemo(() => {
    return rows[index] || { id: null, cells: []}
  }, [rows])

  useEffect(() => {
    if (hoveredCell && nearestAmount !== null) {
      const nearestValues = findNearestValuesToHoveredCell(hoveredCell, nearestAmount)
      setNearestCellsByAmount(nearestValues)
      return
    }
    setNearestCellsByAmount([])
  }, [hoveredCell])

  const findNearestValuesToHoveredCell = (cell: Cell, nearestAmount: number) => {
    return rows
      .reduce((acc: Cell[], {cells}) => acc.concat(cells), [])
      .filter(c => c.id !== cell.id)
      .map(c => Object.assign(c, { diff: Math.abs(cell.amount - c.amount) }))
      .sort((a, b) => a.diff - b.diff)
      .slice(0, nearestAmount)
      .map(c => c.id)
  }

  const sumRowValues = (cells: Cell[]) => {
    return cells.reduce((sum, { amount }) => sum + amount, 0)
  }; 

  const percentOfSum = (cells: Cell[], currentCellAmount: number) => {
    const sumOfCellAmount = cells.reduce((sum, { amount }) => sum + amount, 0)
    return currentCellAmount / sumOfCellAmount * 100
  }

  return (
    <tr key={row.id} style={style}>
      <RowTitleCell rowId={row.id} setRows={setRows} setRowsAmount={setRowsAmount} />

      {row.cells.map(({ id: cellId, amount }) => (
        <DataCell
          key={cellId}
          cellId={cellId}
          rowId={row.id}
          amount={amount}
          percentOfSum={hoveredSumRow === row.id ? percentOfSum(row.cells, amount) : null}
          isShowPercentOfSum={hoveredSumRow === row.id}
          isNearestToHovered={nearestCellIdsByAmount.includes(cellId)}
          isHovered={hoveredCell?.id === cellId}
          setHoveredCell={setHoveredCell}
          setRows={setRows}
        />
      ))}

      <SumCell rowId={row.id} sum={sumRowValues(row.cells)} setHoveredSumRow={setHoveredSumRow} />
    </tr>
  );
}

export default memo(RowTable);
