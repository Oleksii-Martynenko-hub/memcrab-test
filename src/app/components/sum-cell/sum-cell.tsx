import { memo } from 'react';

import styles from './sum-cell.module.scss';

export interface SumCellProps {
  rowId: string;
  sum: number;
  setHoveredSumRow: React.Dispatch<React.SetStateAction<string | null>>
}

export function SumCell({ rowId, sum, setHoveredSumRow, ...props }: SumCellProps) {

  const setHoveredSumRowOnMouseOver = () => {
    setHoveredSumRow(rowId)
  }

  const removeHoveredSumRowOnMouseLeave = () => {
    setHoveredSumRow(null)
  }

  return (
    <td 
      key={'sum' + rowId} 
      className={styles.sumCell}
      onMouseOver={setHoveredSumRowOnMouseOver}
      onMouseLeave={removeHoveredSumRowOnMouseLeave}
      {...props}
    >
      {sum}
    </td>
  );
}

export default memo(SumCell);
