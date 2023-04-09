import { HTMLAttributes, memo } from 'react';

import styles from './average-cell.module.scss';

/* eslint-disable-next-line */
export interface AverageCellProps extends HTMLAttributes<HTMLTableCellElement> {
  averageValue?: number;
  isEmpty?: boolean;
}

export function AverageCell({
  averageValue,
  isEmpty = false,
  children,
  ...props
}: AverageCellProps) {
  return (
    <td
      className={`${styles.averageCell}
      ${isEmpty && styles.empty}`}
      {...props}
    >
      {children || averageValue}
    </td>
  );
}

export default memo(AverageCell);
