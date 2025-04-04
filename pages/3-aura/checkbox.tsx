import React from 'react';
import Theme from '~components/theming/component/index';
import { Checkbox as CloudscapeCheckbox } from '~components';
import styles from './styles.scss';

export default function Checkbox(props: any) {
  const backgroundColors = {
    checked: '#161d26',
    indeterminate: '#047d95',
    disabled: props.checked ? '#ccccd1' : 'transparent',
  };

  const borderColors = {
    ...backgroundColors,
    default: '#ccccd1',
    disabled: '#ccccd1',
  };

  const colors = {
    checked: '#232b37',
    default: '#232b37',
    disabled:'#72747e',
  }

  const fills = {
    checked: '#fff',
    disabled:'#000',
  };

  return (
    <div 
      className={styles['aura-checkbox']} 
      data-checked={props.checked}
      data-disabled={props.disabled}
    >
      <Theme
        backgroundColor={backgroundColors}
        borderColor={borderColors}
        color={colors}
        fill={fills}
        fontFamily='"Amazon Ember Display", "Helvetica Neue", Helvetica, Arial, sans-serif'
        fontSize="16px"
      >
        <CloudscapeCheckbox checked={props.checked} disabled={props.disabled}>
          {props.label}
        </CloudscapeCheckbox>
      </Theme>
    </div>
  );
}