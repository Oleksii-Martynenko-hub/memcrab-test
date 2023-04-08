import { memo, useContext } from 'react';

import { Cell, HoveredSumRowContext } from 'src/app/app';

import styles from './sum-cell.module.scss';

export interface SumCellProps {
  rowId: string;
  cells: Cell[];
}

export function SumCell({ rowId, cells, ...props }: SumCellProps) {
  const { setHoveredSumRow } = useContext(HoveredSumRowContext)

  const sumRowValues = (cells: Cell[]) => {
    return cells.reduce((sum, { amount }) => sum + amount, 0)
  }; 

  const setHoveredSumRowOnMouseOver = (rowId: string) => () => {
    setHoveredSumRow(rowId)
  }

  const removeHoveredSumRowOnMouseLeave = () => {
    setHoveredSumRow(null)
  }

  return (
    <td 
      key={'sum' + rowId} 
      className={styles.sumCell}
      onMouseOver={setHoveredSumRowOnMouseOver(rowId)}
      onMouseLeave={removeHoveredSumRowOnMouseLeave}
      {...props}
    >
      {sumRowValues(cells)}
    </td>
  );
}

export default memo(SumCell);
