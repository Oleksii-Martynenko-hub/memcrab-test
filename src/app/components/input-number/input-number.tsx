import { memo } from 'react';
import {
  NumericFormat,
  NumericFormatProps,
  NumberFormatValues,
  OnValueChange
} from 'react-number-format';

import styles from './input-number.module.scss';

export interface InputNumberProps extends Omit<NumericFormatProps, 'value' | 'onChange'> {
  value: number | null;
  onChange: (value: number | undefined) => void;
  validate: (value: number) => boolean;
  tooltip?: string
}
// TODO: try to use memo with react-number-format or replace by custom input with simple validation and обмеженнями
// to prevent unnecessary re-rendering
export function InputNumber({ value, onChange, validate, tooltip, ...props}: InputNumberProps) {

  const onValueChange: OnValueChange = (v) => {
    onChange(v.floatValue)
  }
  
  const isAllowed = (v: NumberFormatValues) => {
    return v.floatValue !== undefined ? validate(v.floatValue) : true;
  }

  return (
    <div className={styles.inputWrapper}>
      <NumericFormat 
        className={styles.input}
        value={value}
        onValueChange={onValueChange}
        allowNegative={false} 
        decimalScale={0} 
        isAllowed={isAllowed}
        { ...props}
      />
      {tooltip && <div className={styles.tooltip}>
        ?
        <p className={styles.tooltipText}>{tooltip}</p>
      </div>}
    </div>
  );
}

export default memo(InputNumber);
