import { Row } from '../app';
import styles from './table.module.scss';

export interface TableProps {
  rows: Row[]
}

export function Table({ rows }: TableProps) {

  return (
    <div className={styles['container']}>
      <table id="randomDigits" className={styles.table}>
        <tbody>
          {rows.map(({ id: rowId, cells }) => (
            <tr key={rowId}>
              {cells.map(({ id: cellId, amount }) => (
                <td key={cellId}>{amount}</td>
              ))}

              <td key={'sum' + rowId}>{cells.reduce((sum, { amount }) => sum + amount, 0)}</td>
            </tr>
            
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
