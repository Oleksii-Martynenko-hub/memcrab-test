import { memo, useContext, useEffect, useRef } from 'react';

import { generateCells } from 'src/utils/generateCells';

import { ColumnsContext, NearestContext, RowsAmountContext, RowsContext } from 'src/app/app';
import Table from 'src/app/components/table/table';
import Header from 'src/app/components/header/header';
import { useVirtualize } from 'src/app/components/hooks/useVirtualize';

import styles from './main.module.scss';

/* eslint-disable-next-line */
export interface MainProps {}

export function Main(props: MainProps) {
  const { rows, setRows } = useContext(RowsContext)
  const { rowsAmount } = useContext(RowsAmountContext)
  const { columnsAmount } = useContext(ColumnsContext)
  const { nearestAmount, setNearestAmount } = useContext(NearestContext)

  const containerRef = useRef<HTMLDivElement>(null)

  const virtualizeProps = useVirtualize( {
    element: containerRef.current,
    widthItem: 120,
    heightItem: 51,
    offsetY: 208,
    offsetX: 150 + 120,
  })


  useEffect(() => {
    const cellAmount = (rowsAmount || 0) * (columnsAmount || 0)

    if (nearestAmount !== null && nearestAmount >= cellAmount) {
      setNearestAmount(cellAmount < 1 ? 0 : cellAmount - 1)
    }

    generateDataRows(rowsAmount || 0, columnsAmount || 0)
    
  }, [rowsAmount, columnsAmount])

  const generateDataRows = (rowsAmount: number, columnsAmount: number) => {
    if (
      (rows.length && rows[0].cells.length) && 
      (rowsAmount === rows.length && columnsAmount === rows[0].cells.length)
    ) return

    const rowsData = []

    for (let r = 0; r < rowsAmount; r++) {
      const cells = generateCells(r.toString(), columnsAmount)

      rowsData.push({ id: r.toString(), cells })
    }

    setRows(rowsData)
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <Header />

      <Table {...virtualizeProps} />
    </div>
  );
}

export default memo(Main);
