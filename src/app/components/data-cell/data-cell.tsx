import { memo, HTMLAttributes } from 'react';

import { Row, Cell } from 'src/app/app';

import styles from './data-cell.module.scss';

/* eslint-disable-next-line */
export interface DataCellProps extends HTMLAttributes<HTMLTableCellElement> {
  cellId: string;
  rowId: string;
  amount: number;
  percentOfSum: number | null;
  isShowPercentOfSum: boolean;
  isNearestToHovered: boolean;
  isHovered: boolean;
  setHoveredCell: React.Dispatch<React.SetStateAction<Cell | null>>;
  setRows: (value: React.SetStateAction<Row[]>) => void;
}

export function DataCell({
  cellId,
  rowId,
  amount,
  percentOfSum,
  isShowPercentOfSum,
  isNearestToHovered,
  isHovered,
  setHoveredCell,
  setRows,
  ...props
}: DataCellProps) {
  const incrementCellValueOnClick = () => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id === rowId) {
          const updatedCells = row.cells.map((cell) => {
            if (cell.id === cellId)
              setHoveredCell({ ...cell, amount: cell.amount + 1 });
            return cell.id === cellId
              ? { ...cell, amount: cell.amount + 1 }
              : cell;
          });

          return { ...row, cells: updatedCells };
        }

        return row;
      })
    );
  };

  const setHoveredCellOnMouseOver = (cell: Cell) => () => {
    setHoveredCell(cell);
  };

  const removeHoveredCellOnMouseLeave = () => {
    setHoveredCell(null);
  };

  return (
    <td
      key={cellId}
      className={`
        ${styles.dataCell}
        ${styles.increment}
        ${isShowPercentOfSum && styles.percentGradient}
        ${isNearestToHovered && styles.nearest}
      `}
      style={
        {
          '--percent': `${(percentOfSum || 0).toFixed(2)}%`,
        } as React.CSSProperties
      }
      onClick={incrementCellValueOnClick}
      onMouseOver={setHoveredCellOnMouseOver({ id: cellId, amount })}
      onMouseLeave={removeHoveredCellOnMouseLeave}
      {...props}
    >
      {isHovered
        ? `${amount} +1`
        : isShowPercentOfSum
        ? `${(percentOfSum || 0).toFixed(2)}%`
        : amount}
    </td>
  );
}

export default memo(DataCell);
