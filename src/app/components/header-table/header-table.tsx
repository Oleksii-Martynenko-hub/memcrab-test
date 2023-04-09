import { memo, useCallback, useContext } from 'react';

import { ColumnsContext } from 'src/app/app';
import Button from 'src/app/components/common/button/button';

import styles from './header-table.module.scss';

export interface HeaderTableProps {
  addRow: () => void
}

export function HeaderTable({ addRow, ...props }: HeaderTableProps) {
  const { columnsAmount } = useContext(ColumnsContext)

  const addRowOnClick = useCallback(() => {
    addRow()
  }, [])

  return (
    <thead className={styles.tableHead} {...props}>
        <tr>
          <th key='row-title-head' className={styles.rowHead}>
            <div className={`${styles.cellWrapWithBorder} ${styles.rowTitleWrap}`}>
              <Button onClick={addRowOnClick}>
                + add row
              </Button>
              </div>
          </th>

          {(columnsAmount ? [...Array(columnsAmount).keys()] : []).map((i) => (
            
            <th key={i}>
              <div className={styles.cellWrapWithBorder}>
                Column { i + 1 }
              </div>
            </th>
          ))}

          <th key='sum-head' className={styles.sumColHead}>
            <div className={`${styles.cellWrapWithBorder} ${styles.sumTitleWrap}`}>Sum values</div>
          </th>
        </tr>
      </thead>
  );
}

export default memo(HeaderTable);
