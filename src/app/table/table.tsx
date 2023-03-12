import React, { useContext, useState } from 'react';

import { averageOfSum } from 'src/utils/average-of-sum';
import { generateCells } from 'src/utils/generateCells';
import { roundTo } from 'src/utils/roundTo';

import { Cell, ColumnsContext, NearestContext, Row } from '../app';

import styles from './table.module.scss';

export interface TableProps {
  rows: Row[]
  setRows: React.Dispatch<React.SetStateAction<Row[]>>
}

export function Table({ rows, setRows }: TableProps) {
  const { columnsAmount } = useContext(ColumnsContext)
  const { nearestAmount } = useContext(NearestContext)

  const [hoveredCell, setHoveredCell] = useState<Cell | null>(null)
  const [hoveredSumRow, setHoveredSumRow] = useState<string | null>(null)
  const [nearestCellIdsByAmount, setNearestCellsByAmount] = useState<string[]>([])

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

  const addRowOnClick = () => {
    const rowId = (+rows[rows.length - 1].id + 1).toString()
    const generatedCells = generateCells(rowId, columnsAmount || 0)

    setRows(prev => [...prev, { id: rowId, cells: generatedCells }])
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

    if (nearestAmount !== null) {
      const nearestValues = findNearestValuesToHoveredCell(cell, nearestAmount)
        
      setNearestCellsByAmount(nearestValues)
    } 
  }

  const removeHoveredCellOnMouseLeave = () => {
    setHoveredCell(null)
    setNearestCellsByAmount([])
  }

  const setHoveredSumRowOnMouseOver = (rowId: string) => () => {
    setHoveredSumRow(rowId)
  }

  const removeHoveredSumRowOnMouseLeave = () => {
    setHoveredSumRow(null)
  }

  return (
    <table id="randomDigits" className={styles.table}>
      <thead>
        <tr>
          <th key='row-title-head' className={styles.rowHead}>
              <button className={styles.addRowBtn} onClick={addRowOnClick}>
                + add row
              </button>
          </th>

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

        <tr key='average'>
          <td key='row-title-cell'>
              <button className={styles.addRowBtn} onClick={addRowOnClick}>
                + add row
              </button>
          </td>

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
