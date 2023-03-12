import { NumericFormat, NumericFormatProps, NumberFormatValues, OnValueChange } from 'react-number-format';
import styles from './input-number.module.scss';

export interface InputNumberProps extends Omit<NumericFormatProps, 'value' | 'onChange'> {
  value: number | null;
  onChange: (value: number | undefined) => void;
  validate: (value: number) => boolean;
}

export function InputNumber({ value, onChange, validate, ...props}: InputNumberProps) {

  const onValueChange: OnValueChange = (v) => {
    onChange(v.floatValue)
  }
  
  const isAllowed = (v: NumberFormatValues) => {
    return v.floatValue !== undefined ? validate(v.floatValue) : true;
  }

  return (
    <NumericFormat 
      className={styles.input}
      value={value}
      onValueChange={onValueChange}
      allowNegative={false} 
      decimalScale={0} 
      isAllowed={isAllowed}
      { ...props}
    />
  );
}

export default InputNumber;
