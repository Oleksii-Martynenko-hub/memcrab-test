import { useContext, useEffect, useState } from 'react';

import { generateCells } from 'src/utils/generateCells';

import {
  Cell,
  ColumnsContext,
  NearestContext,
  RowsAmountContext,
  RowsContext
} from 'src/app/app';

import SumCell from 'src/app/components/sum-cell/sum-cell';
import DataCell from 'src/app/components/data-cell/data-cell';
import HeaderTable from 'src/app/components/header-table/header-table';
import FooterTable from 'src/app/components/footer-table/footer-table';
import RowTitleCell from 'src/app/components/row-title-cell/row-title-cell';

import styles from './table.module.scss';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableProps {}

export function Table(props: TableProps) {
  const { rows, setRows } = useContext(RowsContext)
  const { rowsAmount, setRowsAmount } = useContext(RowsAmountContext)
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
    const rowId = rows.length.toString()
    const generatedCells = generateCells(rowId, columnsAmount || 0)

    setRows(prev => [...prev, { id: rowId, cells: generatedCells }])

    setRowsAmount(prev => (prev || 0) + 1)
  }

  const findNearestValuesToHoveredCell = (cell: Cell, nearestAmount: number) => {
    return rows
      .reduce((acc: Cell[], {cells}) => acc.concat(cells), [])
      .filter(c => c.id !== cell.id)
      .map(c => Object.assign(c, { diff: Math.abs(cell.amount - c.amount) }))
      .sort((a, b) => a.diff - b.diff)
      .slice(0, nearestAmount)
      .map(c => c.id)
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
