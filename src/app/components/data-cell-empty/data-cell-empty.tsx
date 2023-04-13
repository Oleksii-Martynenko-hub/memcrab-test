import {
  memo,
  HTMLAttributes,
} from 'react';

export interface DataCellEmptyProps extends HTMLAttributes<HTMLTableCellElement> {
  isShow: boolean;
  colSpan: number;
}

export function DataCellEmpty({ isShow, colSpan }: DataCellEmptyProps) {
  return isShow ? <td colSpan={colSpan} /> : null
}

export default memo(DataCellEmpty);
