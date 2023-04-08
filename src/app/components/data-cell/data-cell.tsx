import {
  useContext,
  HTMLAttributes,
} from 'react';

import {
  Cell,
  RowsContext,
  HoveredSumRowContext,
} from 'src/app/app';

import styles from './data-cell.module.scss';

/* eslint-disable-next-line */
export interface DataCellProps extends HTMLAttributes<HTMLTableCellElement> {
  cellId: string;
  rowId: string;
  amount: number;
  cells: Cell[];
  isHovered: boolean;
  isNearestToHovered: boolean;
  setHoveredCell: React.Dispatch<React.SetStateAction<Cell | null>>;
}

export function DataCell({
  cellId,
  rowId,
  amount,
  cells,
  isHovered,
  isNearestToHovered,
  setHoveredCell,
  ...props
}: DataCellProps) {
  const { setRows } = useContext(RowsContext)
  const { hoveredSumRow } = useContext(HoveredSumRowContext)

  const incrementCellValueOnClick = (rowId: string, cellId: string) => () => {
    setRows(prev => prev.map(row => {
      if (row.id === rowId) {
        const updatedCells = row.cells.map(cell => {
          if (cell.id === cellId) setHoveredCell({ ...cell, amount: cell.amount + 1 })
          return cell.id === cellId ? { ...cell, amount: cell.amount + 1 } : cell
        })
        
        return { ...row, cells: updatedCells }
      }

      return row
    }))
  }

  const setHoveredCellOnMouseOver = (cell: Cell) => () => {
    setHoveredCell(cell)
  }

  const removeHoveredCellOnMouseLeave = () => {
    setHoveredCell(null)
  }

  const percentOfSum = () => {
    const sumOfCellAmount = cells.reduce((sum, { amount }) => sum + amount, 0)
    return (amount / sumOfCellAmount * 100).toFixed(2)
  }

  return (
    <td 
      key={cellId} 
      className={`
        ${styles.dataCell}
        ${styles.increment}
        ${hoveredSumRow === rowId && styles.percentGradient}
        ${isNearestToHovered && styles.nearest}
      `} 
      style={{ "--percent": `${percentOfSum()}%` } as React.CSSProperties}
      onClick={incrementCellValueOnClick(rowId, cellId)}
      onMouseOver={setHoveredCellOnMouseOver({ id: cellId, amount })}
      onMouseLeave={removeHoveredCellOnMouseLeave}
      {...props}
    >
      {isHovered
        ? `${amount} +1` 
        : hoveredSumRow === rowId 
          ? `${percentOfSum()}%` 
          : amount
      }
    </td>
  );
}

export default DataCell;
