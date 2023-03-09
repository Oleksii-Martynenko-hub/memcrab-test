import { useContext } from 'react';
import { Row, RowsContext } from '../app';
import styles from './table.module.scss';

export interface TableProps {
  rows: Row[]
}

export function Table({rows}: TableProps) {
  const { rowsAmount, setRowsAmount } = useContext(RowsContext)

  return (
    <div className={styles['container']}>
      <table id="randomDigits" className={styles.table}>
        <tbody>
          {rows.map(({ id, cells }) => (
            <tr key={id}>
              {cells.map(({ id: cellId, amount }) => (
                <td key={cellId}>{amount}

                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
