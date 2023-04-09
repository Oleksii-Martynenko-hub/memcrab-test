import { memo, useCallback, useContext } from 'react';

import { roundTo } from 'src/utils/roundTo';
import { averageOfSum } from 'src/utils/average-of-sum';

import { ColumnsContext, RowsContext } from 'src/app/app';
import Button from 'src/app/components/common/button/button';
import AverageCell from 'src/app/components/average-cell/average-cell';

import styles from './footer-table.module.scss';

export interface FooterTableProps {
  addRow: () => void
}

export function FooterTable({ addRow, ...props }: FooterTableProps) {
  const { rows } = useContext(RowsContext)
  const { columnsAmount } = useContext(ColumnsContext)

  const averageColumnValues = (index: number) => {
    const cellsValues = rows.map(({ cells }) => cells[index] ? cells[index].amount : 0)

    return roundTo(averageOfSum(cellsValues), 2)
  };

  const addRowOnClick = useCallback(() => {
    addRow()
  }, [])

  return (
    <tr key='footer-table'  className={styles.averageRow} {...props}>
      <td key='row-title-cell' className={`${styles.averageCell} ${styles.rowTitle}`}>
        <div className={styles.cellWrapWithBorder}>
          <Button onClick={addRowOnClick}>
            + add row
          </Button>
        </div>
      </td>

      {(columnsAmount ? [...Array(columnsAmount).keys()] : []).map((i) => (
        <AverageCell
          key={i}
          averageValue={rows.length ? averageColumnValues(i) : 0}
        />
      ))}

      <AverageCell key='sum-empty-cell' isEmpty>{!rows.length && !columnsAmount ? 'empty' : '-'}</AverageCell>
    </tr>
  );
}

export default memo(FooterTable);
