import { useContext, useEffect, useState } from 'react';

import { generateCells } from 'src/utils/generateCells';

import {
  Cell,
  ColumnsContext,
  NearestContext,
  RowsAmountContext,
  RowsContext
} from '../app';
import SumCell from '../sum-cell/sum-cell';
import DataCell from '../data-cell/data-cell';
import HeaderTable from '../header-table/header-table';
import FooterTable from '../footer-table/footer-table';
import RowTitleCell from '../row-title-cell/row-title-cell';

import styles from './table.module.scss';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableProps {}

export function Table(props: TableProps) {
  const { rows, setRows } = useContext(RowsContext)
  const { setRowsAmount } = useContext(RowsAmountContext)
  const { columnsAmount } = useContext(ColumnsContext)
  const { nearestAmount } = useContext(NearestContext)

  const [hoveredCell, setHoveredCell] = useState<Cell | null>(null)
  const [nearestCellIdsByAmount, setNearestCellsByAmount] = useState<string[]>([])

  useEffect(() => {
    if (hoveredCell && nearestAmount !== null) {
      const nearestValues = findNearestValuesToHoveredCell(hoveredCell, nearestAmount)
      setNearestCellsByAmount(nearestValues)
      return
    }
    setNearestCellsByAmount([])
  }, [hoveredCell])
  

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

  return (
    <table id="randomDigits" className={styles.table}>
      <HeaderTable addRow={addRow} />

      <tbody>
        {rows.map(({ id: rowId, cells }) => (
          <tr key={rowId}>
            <RowTitleCell rowId={rowId} />

            {cells.map(({ id: cellId, amount }) => (
              <DataCell
                key={cellId}
                cellId={cellId}
                rowId={rowId}
                amount={amount}
                cells={cells}
                isNearestToHovered={nearestCellIdsByAmount.includes(cellId)}
                isHovered={hoveredCell?.id === cellId }
                setHoveredCell={setHoveredCell}
              />
            ))}

            <SumCell rowId={rowId} cells={cells} />
          </tr>
        ))}

        <FooterTable addRow={addRow} />
      </tbody>
    </table>
  );
}

export default Table;
