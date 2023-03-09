import { NumericFormat, NumericFormatProps, NumberFormatValues, OnValueChange } from 'react-number-format';
import styles from './input-number.module.scss';

export interface InputNumberProps extends Omit<NumericFormatProps, 'value' | 'onChange'> {
  value: number | null;
  onChange: (value: number) => void;
  validate: (value: number) => boolean;
}

export function InputNumber(props: InputNumberProps) {
  const { value, onChange, validate } = props;

  const onValueChange: OnValueChange = (v) => {
    if (v.floatValue !== undefined) {
      onChange(v.floatValue);
    }
  }
  
  const isAllowed = (v: NumberFormatValues) => {
    return v.floatValue !== undefined ? validate(v.floatValue) : false;
  }

  return (
    <NumericFormat 
      className={styles.input}
      value={value}
      onValueChange={onValueChange}
      allowNegative={false} 
      decimalScale={0} 
      isAllowed={value ? isAllowed : undefined}
    />
  );
}

export default InputNumber;
