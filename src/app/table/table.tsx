import { useContext } from 'react';
import { ColumnsContext, Row } from '../app';
import styles from './table.module.scss';

export interface TableProps {
  rows: Row[]
  setRows: React.Dispatch<React.SetStateAction<Row[]>>
}

export function Table({ rows, setRows }: TableProps) {
  const { columnsAmount } = useContext(ColumnsContext)

  const average = (arr: number[]) => roundTo(arr.reduce( ( p, c ) => p + c, 0 ) / arr.length, 2);

  const roundTo = (n: number, to: number) => {    
    return +(Math.round(+(n + "e+" + to)) + "e-" + to);
}

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

          <tr key='average'>
            {[...Array(columnsAmount).keys()].map((i) => (
              <td key={i}>{average(rows.map(({ cells }) => cells[i] ? cells[i].amount : 0))}</td>
            ))}
            <td key='sum-empty-cell'></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Table;
