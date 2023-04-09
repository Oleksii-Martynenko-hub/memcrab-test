import { memo } from 'react';

import { Row } from 'src/app/app';

import styles from './row-title-cell.module.scss';

export interface RowTitleCellProps {
  rowId: string;
  setRows: React.Dispatch<React.SetStateAction<Row[]>>
  setRowsAmount: React.Dispatch<React.SetStateAction<number | null>>
}

export function RowTitleCell({ rowId, setRows, setRowsAmount, ...props }: RowTitleCellProps) {

  const removeRowOnClick = () => {
    setRows(prev => prev.filter(row => row.id !== rowId))

    setRowsAmount(prev => (prev || 0) - 1)
  }

  return (
    <td key={'title' + rowId} className={styles.rowTitle} {...props}>
      Row { +rowId + 1 }
      <button className={styles.removeRowBtn} onClick={removeRowOnClick}>
        <span>-</span>
      </button>
    </td>
  );
}

export default memo(RowTitleCell);
