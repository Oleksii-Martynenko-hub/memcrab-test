import { useContext } from 'react';

import { ColumnsContext } from '../app';
import Button from '../button/button';

import styles from './header-table.module.scss';

export interface HeaderTableProps {
  addRow: () => void
}

export function HeaderTable({ addRow, ...props }: HeaderTableProps) {
  const { columnsAmount } = useContext(ColumnsContext)

  const addRowOnClick = () => {
    addRow()
  }

  return (
    <thead className={styles.tableHead} {...props}>
        <tr>
          <th key='row-title-head' className={styles.rowHead}>
            <Button onClick={addRowOnClick}>
              + add row
            </Button>
          </th>

          {(columnsAmount ? [...Array(columnsAmount).keys()] : []).map((i) => (
            <th key={i}>Column { i + 1 }</th>
          ))}

          <th key='sum-head' className={styles.sumColHead}>
            <div className={styles.titleWrap}>Sum values</div>
          </th>
        </tr>
      </thead>
  );
}

export default HeaderTable;
