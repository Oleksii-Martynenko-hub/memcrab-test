import { memo, useCallback, useContext, useEffect, useState } from 'react';

import { generateCells } from 'src/utils/generateCells';

import {
  Cell,
  ColumnsContext,
  HoveredSumRowContext,
  NearestContext,
  RowsAmountContext,
  RowsContext,
} from 'src/app/app';

import SumCell from 'src/app/components/sum-cell/sum-cell';
import RowEmpty from 'src/app/components/row-empty/row-empty';
import DataCell from 'src/app/components/data-cell/data-cell';
import HeaderTable from 'src/app/components/header-table/header-table';
import FooterTable from 'src/app/components/footer-table/footer-table';
import RowTitleCell from 'src/app/components/row-title-cell/row-title-cell';
import { DataCellEmpty } from 'src/app/components/data-cell-empty/data-cell-empty';

import styles from './table.module.scss';
import { useVirtualize } from '../hooks/useVirtualize';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableProps {}

export function Table(props: TableProps) {
  const { rows, setRows } = useContext(RowsContext);
  const { rowsAmount, setRowsAmount } = useContext(RowsAmountContext);
  const { columnsAmount } = useContext(ColumnsContext);
  const { nearestAmount } = useContext(NearestContext);
  const { hoveredSumRow, setHoveredSumRow } = useContext(HoveredSumRowContext);

  const [hoveredCell, setHoveredCell] = useState<Cell | null>(null);
  const [nearestCellIdsByAmount, setNearestCellsByAmount] = useState<string[]>(
    []
  );

  const { topIndex, leftIndex, bottomIndex, rightIndex, isScrolling } =
  useVirtualize({
    widthItem: 120,
    heightItem: 51,
    offsetY: 208,
    offsetX: 150 + 120,
  });

  useEffect(() => {
    if (hoveredCell && nearestAmount !== null) {
      const nearestValues = findNearestValuesToHoveredCell(
        hoveredCell,
        nearestAmount
      );
      setNearestCellsByAmount(nearestValues);
      return;
    }
    setNearestCellsByAmount([]);
  }, [hoveredCell]);

  const addRow = useCallback(() => {
    setRows((prev) => {
      const rowId = prev.length.toString();
      const cellAmount = prev.length ? prev[0].cells.length : 0;
      const generatedCells = generateCells(rowId, cellAmount);
      return [...prev, { id: rowId, cells: generatedCells }];
    });

    setRowsAmount((prev) => (prev || 0) + 1);
  }, []);

  const findNearestValuesToHoveredCell = (
    cell: Cell,
    nearestAmount: number
  ) => {
    return rows
      .reduce((acc: Cell[], { cells }) => acc.concat(cells), [])
      .filter((c) => c.id !== cell.id)
      .map((c) => Object.assign(c, { diff: Math.abs(cell.amount - c.amount) }))
      .sort((a, b) => a.diff - b.diff)
      .slice(0, nearestAmount)
      .map((c) => c.id);
  };

  const sumRowValues = (cells: Cell[]) => {
    return cells.reduce((sum, { amount }) => sum + amount, 0);
  };

  const percentOfSum = (cells: Cell[], currentCellAmount: number) => {
    const sumOfCellAmount = cells.reduce((sum, { amount }) => sum + amount, 0);
    return (currentCellAmount / sumOfCellAmount) * 100;
  };

  return (
    <table
      id="randomDigits"
      className={`${styles.table} ${isScrolling && styles.scrolling}`}
    >
      <HeaderTable addRow={addRow} />

      <tbody>
        <RowEmpty
          isShown={topIndex > 0}
          height={topIndex * 51}
          colSpan={columnsAmount || 0}
        />

        {rows.map(({ id: rowId, cells }, i) =>
          i >= topIndex && i <= bottomIndex ? (
            <tr key={rowId}>
              <RowTitleCell
                rowId={rowId}
                setRows={setRows}
                setRowsAmount={setRowsAmount}
              />

              <DataCellEmpty isShow={leftIndex > 0} colSpan={leftIndex} />

              {cells.map(({ id: cellId, amount }, i) =>
                i >= leftIndex && i <= rightIndex ? (
                  <DataCell
                    key={cellId}
                    cellId={cellId}
                    rowId={rowId}
                    amount={amount}
                    percentOfSum={
                      hoveredSumRow === rowId
                        ? percentOfSum(cells, amount)
                        : null
                    }
                    isShowPercentOfSum={hoveredSumRow === rowId}
                    isNearestToHovered={nearestCellIdsByAmount.includes(cellId)}
                    isHovered={hoveredCell?.id === cellId}
                    setHoveredCell={setHoveredCell}
                    setRows={setRows}
                  />
                ) : null
              )}

              <DataCellEmpty
                isShow={rightIndex < cells.length - 1}
                colSpan={cells.length - rightIndex - 1}
              />

              <SumCell
                rowId={rowId}
                sum={sumRowValues(cells)}
                setHoveredSumRow={setHoveredSumRow}
              />
            </tr>
          ) : null
        )}

        <RowEmpty
          isShown={bottomIndex < (rowsAmount || 0) - 1}
          height={((rowsAmount || 0) - bottomIndex - 1) * 51}
          colSpan={columnsAmount || 0}
        />
      </tbody>

      <FooterTable addRow={addRow} />
    </table>
  );
}

export default memo(Table);
