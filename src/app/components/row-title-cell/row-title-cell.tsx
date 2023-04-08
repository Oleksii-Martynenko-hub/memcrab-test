import { memo, useContext } from 'react';

import { RowsAmountContext, RowsContext } from 'src/app/app';

import styles from './row-title-cell.module.scss';

export interface RowTitleCellProps {
  rowId: string;
}

export function RowTitleCell({ rowId, ...props }: RowTitleCellProps) {
  const { setRows } = useContext(RowsContext)
  const { setRowsAmount } = useContext(RowsAmountContext)

  const removeRowOnClick = (rowId: string) => () => {
    setRows(prev => prev.filter(row => row.id !== rowId))

    setRowsAmount(prev => (prev || 0) - 1)
  }

  return (
    <td key={'title' + rowId} className={styles.rowTitle} {...props}>
      Row { +rowId + 1 }
      <button className={styles.removeRowBtn} onClick={removeRowOnClick(rowId)}>
        <span>-</span>
      </button>
    </td>
  );
}

export default memo(RowTitleCell);
