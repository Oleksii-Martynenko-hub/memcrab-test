import { useContext, useState} from 'react';

import { averageOfSum } from 'src/utils/average-of-sum';
import { roundTo } from 'src/utils/roundTo';

import { Cell, ColumnsContext, Row } from '../app';

import styles from './table.module.scss';

export interface TableProps {
  rows: Row[]
  setRows: React.Dispatch<React.SetStateAction<Row[]>>
}

export function Table({ rows, setRows }: TableProps) {
  const { columnsAmount } = useContext(ColumnsContext)

  const [hoveredCell, setHoveredCell] = useState<Cell | null>(null)

  const sumRowValues = (cells: Cell[]) => {
    return cells.reduce((sum, { amount }) => sum + amount, 0)
  };

  const averageColumnValues = (index: number) => {
    const cellsValues = rows.map(({ cells }) => cells[index] ? cells[index].amount : 0)

    return roundTo( averageOfSum(cellsValues), 2)
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

  const removeRowOnClick = (rowId: string) => () => {
    setRows(prev => prev.filter(row => row.id !== rowId))
  }

  const setHoveredCellOnMouseOver = (cell: Cell) => () => {
    setHoveredCell(cell)
  }

  const removeHoveredCellOnMouseLeave = () => setHoveredCell(null)

  return (
    <table id="randomDigits" className={styles.table}>
      <thead>
        <tr>
          <th key='row-title-head' className={styles.rowHead}></th>

          {[...Array(columnsAmount).keys()].map((i) => (
            <th key={i}>Column { i + 1 }</th>
          ))}

          <th key='sum-head'>Sum values</th>
        </tr>
      </thead>

      <tbody>
        {rows.map(({ id: rowId, cells }) => (
          <tr key={rowId}>
            <td key={'title' + rowId} className={styles.rowTitle}>
              Row { +rowId + 1 }
              <button className={styles.removeRowBtn} onClick={removeRowOnClick(rowId)}>
                <span>-</span>
              </button>
            </td>

            {cells.map(({ id: cellId, amount }) => (
              <td 
                key={cellId} 
                className={styles.increment} 
                onClick={incrementCellValueOnClick(rowId, cellId)}
                onMouseOver={setHoveredCellOnMouseOver({ id: cellId, amount })}
                onMouseLeave={removeHoveredCellOnMouseLeave}
              >
                {hoveredCell?.id === cellId ? `${amount} +1` : amount}
              </td>
            ))}

            <td key={'sum' + rowId}>{sumRowValues(cells)}</td>
          </tr>
        ))}

        <tr key='average'>
          <td key='row-title-cell'></td>

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
