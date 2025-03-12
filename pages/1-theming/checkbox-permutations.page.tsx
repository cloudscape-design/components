// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Checkbox, SpaceBetween, TextContent } from '~components';
import Theme from '~components/theming/component/index';
import styles from './styles.scss';

export default function CheckboxPermutations() {
  return (
    <div style={{ margin: '40px' }}>
      <SpaceBetween direction="vertical" size="m">
        <TextContent>
          <h3>Cloudscape Checkboxes</h3>
        </TextContent>

        <Checkbox checked={true}>Expire</Checkbox>
        <Checkbox checked={true} readOnly>Expire</Checkbox>
        <Checkbox checked={true} disabled>Expire</Checkbox>
        <Checkbox checked={true} indeterminate>Expire</Checkbox>
        <Checkbox checked={true} indeterminate readOnly>Expire</Checkbox>
        <Checkbox checked={true} indeterminate disabled>Expire</Checkbox>
        <Checkbox checked={false}>Expire</Checkbox>
        <Checkbox checked={false} readOnly>Expire</Checkbox>
        <Checkbox checked={false} disabled>Expire</Checkbox>
        
        <hr />

        <TextContent>
          <h3>Amplify Checkboxes</h3>
        </TextContent>

        <AmplifyCheckboxField checked={true} label="Subscribe" />
        <AmplifyCheckboxField checked={true} isDisabled label="Subscribe" />
        <AmplifyCheckboxField checked={true} isIndeterminate label="Subscribe" />
        <AmplifyCheckboxField checked={true} isIndeterminate isDisabled label="Subscribe" />
        <AmplifyCheckboxField checked={false} label="Subscribe" />
        <AmplifyCheckboxField checked={false} isDisabled label="Subscribe" />

        <hr />

        <TextContent>
          <h3>Material UI Checkboxes</h3>
        </TextContent>

        <MaterialUICheckbox label="Label" defaultChecked />
        <MaterialUICheckbox label="Label" defaultChecked disabled />
        <MaterialUICheckbox label="Label" indeterminate />
        <MaterialUICheckbox label="Label" indeterminate disabled />
        <MaterialUICheckbox label="Label" />
        <MaterialUICheckbox label="Label" disabled />
        <MaterialUICheckbox label="Label" defaultChecked color="secondary" />
        <MaterialUICheckbox label="Label" defaultChecked color="success" />
        <MaterialUICheckbox label="Label" defaultChecked color="pink" />
        <MaterialUICheckbox label="Label" defaultChecked size="large" />
        <MaterialUICheckbox label="Label" defaultChecked size="xlarge" />

        <hr />

        <TextContent>
          <h3>Aura Checkboxes</h3>
        </TextContent>

        <AuraCheckbox label="Descriptive label" checked />
        <AuraCheckbox label="Descriptive label" checked disabled />
        <AuraCheckbox label="Descriptive label" />
        <AuraCheckbox label="Descriptive label" disabled />
      </SpaceBetween>
    </div>
  );
}

function AmplifyCheckboxField(props: any) {
  const backgroundColors = {
    checked: '#047d95',
    indeterminate: '#047d95',
    disabled: '#eff0f0',
  };

  const borderColors = {
    ...backgroundColors,
    default: '#89949f',
  };

  const colors = {
    checked: 'rgb(13, 26, 38)',
    default: 'rgb(13, 26, 38)',
    disabled: 'rgb(137, 148, 159)',
    indeterminate: 'rgb(13, 26, 38)',
  };

  return (
    <Theme
      backgroundColor={backgroundColors}
      borderColor={borderColors}
      color={colors}
      fontFamily='InterVariable, "Inter var", Inter, -apple-system, "system-ui", "Helvetica Neue", "Segoe UI", Oxygen, Ubuntu, Cantarell, "Open Sans", sans-serif'
      fontSize="16px"
      outline="#304050"
    >
      <Checkbox 
        checked={props.checked}
        disabled={props.isDisabled}
        indeterminate={props.isIndeterminate}
        onChange={props.onChange} 
        readOnly={props.readOnly}
      >
        {props.label}
      </Checkbox>
    </Theme>
  );
}

function MaterialUICheckbox(props: any) {
  let backgroundColors = {
    checked: '#1976d2',
    indeterminate: '#1976d2',
    disabled: '#bdbdbd',
    secondary: '#9c27b0',
    success: '#2e7d32',
    pink: '#d81b60'
  };

  backgroundColors.checked = props.color && backgroundColors[props.color as keyof typeof backgroundColors];

  const borderColors = {
    ...backgroundColors,
    default: '#666666',
  };

  const sizes = {
    large: '20px',
    xlarge: '24px',
  }

  return (
    <Theme
      backgroundColor={backgroundColors}
      borderColor={borderColors}
      color="rgb(26, 30, 35)"
      fontFamily="Roboto, Helvetica, Arial, sans-serif"
      fontSize="16px"
      gapInline="16px"
      height={props.size && sizes[props.size as keyof typeof sizes]}
      outline={backgroundColors.checked}
      width={props.size && sizes[props.size as keyof typeof sizes]}
    >
      <Checkbox 
        checked={props.defaultChecked}
        disabled={props.disabled}
        indeterminate={props.indeterminate}
        onChange={props.onChange} 
        readOnly={props.readOnly}
      >
        {props.label}
      </Checkbox>
    </Theme>
  );
}

function AuraCheckbox(props: any) {
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
        <Checkbox checked={props.checked} disabled={props.disabled}>
          {props.label}
        </Checkbox>
      </Theme>
    </div>
  );
}
