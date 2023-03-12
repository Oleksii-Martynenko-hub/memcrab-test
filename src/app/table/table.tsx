import React, { useContext, useEffect, useState } from 'react';

import { generateCells } from 'src/utils/generateCells';

import {
  Cell,
  ColumnsContext,
  NearestContext,
  RowsAmountContext,
  RowsContext
} from '../app';

import styles from './table.module.scss';
import HeaderTable from '../header-table/header-table';
import FooterTable from '../footer-table/footer-table';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableProps {}

export function Table(props: TableProps) {
  const { rows, setRows } = useContext(RowsContext)
  const { setRowsAmount } = useContext(RowsAmountContext)
  const { columnsAmount } = useContext(ColumnsContext)
  const { nearestAmount } = useContext(NearestContext)

  const [hoveredCell, setHoveredCell] = useState<Cell | null>(null)
  const [hoveredSumRow, setHoveredSumRow] = useState<string | null>(null)
  const [nearestCellIdsByAmount, setNearestCellsByAmount] = useState<string[]>([])

  useEffect(() => {
    if (hoveredCell && nearestAmount !== null) {
      const nearestValues = findNearestValuesToHoveredCell(hoveredCell, nearestAmount)
      setNearestCellsByAmount(nearestValues)
      return
    }
    setNearestCellsByAmount([])
  }, [hoveredCell])
  

  const sumRowValues = (cells: Cell[]) => {
    return cells.reduce((sum, { amount }) => sum + amount, 0)
  };  

  const incrementCellValueOnClick = (rowId: string, cellId: string) => () => {
    setRows(prev => prev.map(row => {
      if (row.id === rowId) {
        const updatedCells = row.cells.map(cell => {
          if (cell.id === cellId) setHoveredCell({ ...cell, amount: cell.amount + 1 })
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

    setRowsAmount(prev => (prev || 0) - 1)
  }

  const addRow = () => {
    const rowId = rows.length ? (+rows[rows.length - 1].id + 1).toString().padStart(3, "0") : "000"
    const generatedCells = generateCells(rowId, columnsAmount || 0)

    setRows(prev => [...prev, { id: rowId, cells: generatedCells }])

    setRowsAmount(prev => (prev || 0) + 1)
  }

  const findNearestValuesToHoveredCell = (cell: Cell, nearestAmount: number) => {
    const nearestCells: (Cell & {indexOfCommonArr: number })[] = []

    const commonCells = rows
      .reduce((acc: Cell[], { cells }) => {
        return [...acc, ...cells]
      }, [])
      .sort((a, b) => a.amount - b.amount)

    const indexOfCell = commonCells.map(c => c.id).indexOf(cell.id)

    const getNearestCellsByIndex = (
      amount: number,
      indexOfStart: number,
      differenceIncrement = 0,
      isIncrementIndex = true
    ) => {
      if (nearestCells.length < nearestAmount) {
        for (let x = 0; x < amount; x++) {
          const needlyIndex = isIncrementIndex ? indexOfStart + 1 + x : indexOfStart - (1 + x)
          if (commonCells[needlyIndex] && Math.abs(commonCells[needlyIndex].amount - cell.amount) === differenceIncrement) {
            nearestCells.push({ ...commonCells[needlyIndex], indexOfCommonArr: needlyIndex })
            continue
          }
          break
        }

        nearestCells.sort((a, b) => a.indexOfCommonArr - b.indexOfCommonArr)

        const updateIndexOfStart = nearestCells.length 
          ? isIncrementIndex 
            ? indexOfCell + 1 === nearestCells[0].indexOfCommonArr ? indexOfCell : nearestCells[0].indexOfCommonArr
            : indexOfCell - 1 === nearestCells[nearestCells.length - 1].indexOfCommonArr ? indexOfCell : nearestCells[nearestCells.length - 1].indexOfCommonArr
          : isIncrementIndex 
            ? indexOfCell
            : indexOfCell

        getNearestCellsByIndex(
          nearestAmount - nearestCells.length,
          updateIndexOfStart,
          isIncrementIndex ? differenceIncrement : differenceIncrement + 1,
          !isIncrementIndex,
        )
      }
    }

    getNearestCellsByIndex(nearestAmount, indexOfCell)
    
    return nearestCells.map(c => c.id)
  }

  const setHoveredCellOnMouseOver = (cell: Cell) => () => {
    setHoveredCell(cell)
  }

  const removeHoveredCellOnMouseLeave = () => {
    setHoveredCell(null)
  }

  const setHoveredSumRowOnMouseOver = (rowId: string) => () => {
    setHoveredSumRow(rowId)
  }

  const removeHoveredSumRowOnMouseLeave = () => {
    setHoveredSumRow(null)
  }

  return (
    <table id="randomDigits" className={styles.table}>
      <HeaderTable addRow={addRow} />

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
                className={`${styles.increment} ${hoveredSumRow === rowId && styles.percentGradient} ${nearestCellIdsByAmount.includes(cellId) && styles.nearest}`} 
                style={{ "--percent": `${(amount / sumRowValues(cells) * 100).toFixed(2)}%` } as React.CSSProperties}
                onClick={incrementCellValueOnClick(rowId, cellId)}
                onMouseOver={setHoveredCellOnMouseOver({ id: cellId, amount })}
                onMouseLeave={removeHoveredCellOnMouseLeave}
              >
                {hoveredCell?.id === cellId 
                  ? `${amount} +1` 
                  : hoveredSumRow === rowId 
                    ? `${(amount / sumRowValues(cells) * 100).toFixed(2)}%` 
                    : amount
                }
              </td>
            ))}

            <td 
              key={'sum' + rowId} 
              className={styles.sumCell}
              onMouseOver={setHoveredSumRowOnMouseOver(rowId)}
              onMouseLeave={removeHoveredSumRowOnMouseLeave}
            >
              {sumRowValues(cells)}
            </td>
          </tr>
        ))}

        <FooterTable addRow={addRow} />
      </tbody>
    </table>
  );
}

export default Table;
