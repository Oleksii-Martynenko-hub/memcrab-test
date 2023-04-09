import { HTMLAttributes, memo } from 'react';

import styles from './button.module.scss';

/* eslint-disable-next-line */
export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {}

export function Button({ ...props }: ButtonProps) {
  return (
    <button className={styles.addRowBtn} {...props} />
  );
}

export default memo(Button);
