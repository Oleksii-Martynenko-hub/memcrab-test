import { useCallback, useContext } from 'react';

import { ColumnsContext, NearestContext, RowsContext } from '../app';
import InputNumber from '../input-number/input-number';

import styles from './header.module.scss';

/* eslint-disable-next-line */
export interface HeaderProps {}

export function Header(props: HeaderProps) {
  const { rowsAmount, setRowsAmount } = useContext(RowsContext)
  const { columnsAmount, setColumnsAmount } = useContext(ColumnsContext)
  const { nearestAmount, setNearestAmount } = useContext(NearestContext)

  const rowColValidation = (v: number) => v <= 100
  
  const amountNearestValidation = useCallback((v: number) => {
    if (rowsAmount !== null && columnsAmount !== null) {
      return v < rowsAmount * columnsAmount
    }

    return v === 0
  }, [rowsAmount, columnsAmount])

  return (
    <header className={styles.header}>
      <div className={styles.headerContentWrapper}>
        <InputNumber value={rowsAmount} onChange={setRowsAmount} validate={rowColValidation} />
        <InputNumber value={columnsAmount} onChange={setColumnsAmount} validate={rowColValidation} />
        <InputNumber value={nearestAmount} onChange={setNearestAmount} validate={amountNearestValidation} />

      </div>
    </header>
  );
}

export default Header;
