import { useContext } from 'react';

import { roundTo } from 'src/utils/roundTo';
import { averageOfSum } from 'src/utils/average-of-sum';

import { ColumnsContext, RowsContext } from '../app';
import Button from '../button/button';

import styles from './footer-table.module.scss';

export interface FooterTableProps {
  addRow: () => void
}

export function FooterTable({ addRow, ...props }: FooterTableProps) {
  const { rows } = useContext(RowsContext)
  const { columnsAmount } = useContext(ColumnsContext)

  const averageColumnValues = (index: number) => {
    const cellsValues = rows.map(({ cells }) => cells[index] ? cells[index].amount : 0)

    return roundTo( averageOfSum(cellsValues), 2)
  };

  const addRowOnClick = () => {
    addRow()
  }

  return (
    <tr key='footer-table'  className={styles.averageRow} {...props}>
      <td key='row-title-cell' className={styles.tableHead}>
        <Button onClick={addRowOnClick}>
          + add row
        </Button>
      </td>

      {(columnsAmount ? [...Array(columnsAmount).keys()] : []).map((i) => (
        <td key={i} className={styles.averageCell}>{rows.length ? averageColumnValues(i) : 0}</td>
      ))}

      <td key='sum-empty-cell' className={`${styles.averageCell} ${styles.empty}`}>{!rows.length && !columnsAmount ? 'empty' : '-'}</td>
    </tr>
  );
}

export default FooterTable;
