import { useCallback, useContext } from 'react';

import { ColumnsContext, NearestContext, RowsAmountContext } from '../app';
import InputNumber from '../input-number/input-number';

import styles from './header.module.scss';

/* eslint-disable-next-line */
export interface HeaderProps {}

export function Header(props: HeaderProps) {
  const { rowsAmount, setRowsAmount } = useContext(RowsAmountContext)
  const { columnsAmount, setColumnsAmount } = useContext(ColumnsContext)
  const { nearestAmount, setNearestAmount } = useContext(NearestContext)

  const rowColValidation = (value: number) => value <= 100

  const setRowsAmountOnChange = (value: number | undefined) => {
    setRowsAmount(value || null)
  }

  const setColumnsAmountOnChange = (value: number | undefined) => {
    setColumnsAmount(value || null)
  }
  
  const amountNearestValidationOnChange = (value: number | undefined) => {
    if (value === undefined) {
      setNearestAmount(null)
      return
    }

    if (value >= (Number(rowsAmount) * Number(columnsAmount))) {
      setNearestAmount(prev => prev)
      return
    }

    setNearestAmount(value)
  }

  const amountNearestValidation = useCallback((v: number) => {
    if (rowsAmount !== null && columnsAmount !== null) {
      return v < rowsAmount * columnsAmount
    }

    return v === 0
  }, [rowsAmount, columnsAmount])

  return (
    <header className={styles.header}>
      <div className={styles.headerContentWrapper}>
        <InputNumber 
          value={rowsAmount} 
          onChange={setRowsAmountOnChange} 
          validate={rowColValidation} 
          placeholder="Rows"
          tooltip='Rows amount needs for the table generation. You can create or remove rows in the table.'
        />
        <InputNumber 
          value={columnsAmount} 
          onChange={setColumnsAmountOnChange} 
          validate={rowColValidation} 
          placeholder="Columns"
          tooltip='Columns amount needs for the table generation.'
        />
        <InputNumber 
          value={nearestAmount} 
          onChange={amountNearestValidationOnChange}
          validate={amountNearestValidation}
          disabled={rowsAmount === null || columnsAmount === null}
          placeholder="Nearest values"
          tooltip='Quantity cells to highlight with amount nearest to the value in the hovered cell. It can`t be more than the product of multiplication of Rows and Columns.'
        />

      </div>
    </header>
  );
}

export default Header;
