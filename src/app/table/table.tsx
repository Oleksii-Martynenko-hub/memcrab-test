import { useContext} from 'react';

import { Cell, ColumnsContext, Row } from '../app';

import styles from './table.module.scss';

export interface TableProps {
  rows: Row[]
  setRows: React.Dispatch<React.SetStateAction<Row[]>>
}

export function Table({ rows, setRows }: TableProps) {
  const { columnsAmount } = useContext(ColumnsContext)

  const average = (arr: number[]) => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
  
  const roundTo = (n: number, to: number) => {    
    return +(Math.round(+(n + "e+" + to)) + "e-" + to);
  }

  const sumRowValues = (cells: Cell[]) => {
    return cells.reduce((sum, { amount }) => sum + amount, 0)
  };

  const averageColumnValues = (index: number) => {
    return roundTo(average(rows.map(({ cells }) => cells[index] ? cells[index].amount : 0)), 2)
  };

  const incrementCellValueOnClick = (rowId: string, cellId: string) => () => {
    setRows(prev => prev.map(row => {
      if (row.id === rowId) {
        const updatedCells = row.cells.map(cell => {
          return cell.id === cellId ? { ...cell, amount: cell.amount + 1 } : cell
        })
        
        return {
          ...row,
          cells: updatedCells
        }
      }

      return row
    }))
  }

  return (
    <table id="randomDigits" className={styles.table}>
      <tbody>
        {rows.map(({ id: rowId, cells }) => (
          <tr key={rowId}>
            {cells.map(({ id: cellId, amount }) => (
              <td key={cellId} onClick={incrementCellValueOnClick(rowId, cellId)}>{amount}</td>
            ))}

            <td key={'sum' + rowId}>{sumRowValues(cells)}</td>
          </tr>
        ))}

        <tr key='average'>
          {[...Array(columnsAmount).keys()].map((i) => (
            <td key={i}>{averageColumnValues(i)}</td>
          ))}
          <td key='sum-empty-cell'></td>
        </tr>
      </tbody>
    </table>
  );
}

export default Table;
