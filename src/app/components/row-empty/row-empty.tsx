import { memo } from 'react';

export interface RowEmptyProps {
  isShown: boolean;
  height: number;
  colSpan: number;
}

export function RowEmpty({ isShown, height, colSpan }: RowEmptyProps) {
  return isShown ? (
    <tr style={{ height }}>
      <td colSpan={colSpan} />
    </tr>
  ) : null;
}

export default memo(RowEmpty);
