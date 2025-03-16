// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Badge, SpaceBetween, TextContent } from '~components';
import Theme from '~components/theming/component/index';

export default function BadgePermutations() {
  return (
    <div style={{ margin: '40px' }}>
      <SpaceBetween direction="vertical" size="m">
        <TextContent>
          <h3>Cloudscape Badges</h3>
        </TextContent>

        <Badge>Badge</Badge>
        <Badge color="blue">Badge</Badge>
        <Badge color="red">Badge</Badge>
        <Badge color="green">Badge</Badge>
        <Badge color="severity-critical">Badge</Badge>
        <Badge color="severity-high">Badge</Badge>
        <Badge color="severity-medium">Badge</Badge>
        <Badge color="severity-low">Badge</Badge>
        <Badge color="severity-neutral">Badge</Badge>

        <hr />

        <TextContent>
          <h3>Amplify Badges</h3>
        </TextContent>

        <AmplifyBadge variation="default">Badge</AmplifyBadge>
        <AmplifyBadge variation="info">Badge</AmplifyBadge>
        <AmplifyBadge variation="error">Badge</AmplifyBadge>
        <AmplifyBadge variation="warning">Badge</AmplifyBadge>
        <AmplifyBadge variation="success">Badge</AmplifyBadge>

        <hr />

        <TextContent>
          <h3>Material UI Chip</h3>
        </TextContent>

        <MaterialUIChip color="default">Chip Component</MaterialUIChip>
        <MaterialUIChip color="primary">Chip Component</MaterialUIChip>
        <MaterialUIChip color="secondary">Chip Component</MaterialUIChip>
        <MaterialUIChip color="error">Chip Component</MaterialUIChip>
        <MaterialUIChip color="info">Chip Component</MaterialUIChip>
        <MaterialUIChip color="success">Chip Component</MaterialUIChip>
        <MaterialUIChip color="warning">Chip Component</MaterialUIChip>
        <MaterialUIChip color="default" variant="outlined">
          Chip Component
        </MaterialUIChip>
        <MaterialUIChip color="primary" variant="outlined">
          Chip Component
        </MaterialUIChip>
        <MaterialUIChip color="secondary" variant="outlined">
          Chip Component
        </MaterialUIChip>
        <MaterialUIChip color="error" variant="outlined">
          Chip Component
        </MaterialUIChip>
        <MaterialUIChip color="info" variant="outlined">
          Chip Component
        </MaterialUIChip>
        <MaterialUIChip color="success" variant="outlined">
          Chip Component
        </MaterialUIChip>
        <MaterialUIChip color="warning" variant="outlined">
          Chip Component
        </MaterialUIChip>

        <hr />

        <TextContent>
          <h3>Aura Badges</h3>
        </TextContent>

        <AuraBadge text="Test Badge" variant="gradient" />

        <hr />

        <TextContent>
          <h3>Synthesis Chip</h3>
        </TextContent>

        <SyntesisChip color="default">Chip text</SyntesisChip>
        <SyntesisChip color="primary">Chip text</SyntesisChip>
        <SyntesisChip color="secondary">Chip text</SyntesisChip>
        <SyntesisChip color="error">Chip text</SyntesisChip>
        <SyntesisChip color="info">Chip text</SyntesisChip>
        <SyntesisChip color="success">Chip text</SyntesisChip>
        <SyntesisChip color="warning">Chip text</SyntesisChip>
        <SyntesisChip color="default" variant="outlined">
          Chip text
        </SyntesisChip>
        <SyntesisChip color="primary" variant="outlined">
          Chip text
        </SyntesisChip>
        <SyntesisChip color="secondary" variant="outlined">
          Chip text
        </SyntesisChip>
        <SyntesisChip color="error" variant="outlined">
          Chip text
        </SyntesisChip>
        <SyntesisChip color="info" variant="outlined">
          Chip text
        </SyntesisChip>
        <SyntesisChip color="success" variant="outlined">
          Chip text
        </SyntesisChip>
        <SyntesisChip color="warning" variant="outlined">
          Chip text
        </SyntesisChip>
      </SpaceBetween>
    </div>
  );
}

function AmplifyBadge(props: any) {
  const backgroundColors = {
    default: '#eff0f0',
    error: '#fce9e9',
    info: '#e6eefe',
    success: '#ebfaed',
    warning: '#fcf2e9',
  };

  const colors = {
    default: '#0d1926',
    error: '#660000',
    info: '#002266',
    success: '#365e3d',
    warning: '#660000',
  };

  const darkModeBackgroundColors = {
    default: '#5c6670',
    info: '#00194d',
    error: '#4d0000',
    warning: '#4d2600',
    success: '#2e4832',
  };

  const darkModeColors = {
    default: '#fff',
    error: '#f5bcbc',
    info: '#b8cef9',
    success: '#d6f5db',
    warning: '#f5d9bc',
  };

  return (
    <Theme
      backgroundColor={backgroundColors[props.variation as keyof typeof backgroundColors]}
      borderRadius="32px"
      borderWidth="0px"
      color={colors[props.variation as keyof typeof colors]}
      fontFamily='InterVariable, "Inter var", Inter, -apple-system, "system-ui", "Helvetica Neue", "Segoe UI", Oxygen, Ubuntu, Cantarell, "Open Sans", sans-serif'
      fontWeight="600"
      lineHeight="14px"
      onDarkMode={{
        backgroundColor: darkModeBackgroundColors[props.variation as keyof typeof darkModeBackgroundColors],
        color: darkModeColors[props.variation as keyof typeof darkModeColors],
      }}
      paddingBlock="8px"
      paddingInline="12px"
    >
      <Badge>{props.children}</Badge>
    </Theme>
  );
}

function MaterialUIChip(props: any) {
  const backgroundColors = {
    default: 'rgba(0, 0, 0, 0.08)',
    primary: 'rgb(25, 118, 210)',
    secondary: 'rgb(156, 39, 176)',
    error: 'rgb(211, 47, 47)',
    info: 'rgb(2, 136, 209)',
    success: 'rgb(46, 125, 50)',
    warning: 'rgb(237, 108, 2)',
  };

  const colors = {
    default: 'rgba(0, 0, 0, 0.87)',
    primary: '#ffffff',
    secondary: '#ffffff',
    error: '#ffffff',
    info: '#ffffff',
    success: '#ffffff',
    warning: '#ffffff',
  };

  const outlinedColors = {
    default: 'rgba(0, 0, 0, 0.87)',
    primary: 'rgb(25, 118, 210)',
    secondary: 'rgb(156, 39, 176)',
    error: 'rgb(211, 47, 47)',
    info: 'rgb(2, 136, 209)',
    success: 'rgb(46, 125, 50)',
    warning: 'rgb(237, 108, 2)',
  };

  const darkModeBackgroundColors = {
    default: 'rgba(255, 255, 255, 0.16)',
    primary: 'rgb(144, 202, 249)',
    secondary: 'rgb(206, 147, 216)',
    error: 'rgb(244, 67, 54)',
    info: 'rgb(41, 182, 246)',
    success: 'rgb(102, 187, 106)',
    warning: 'rgb(255, 167, 38)',
  };

  const darkModeOutlinedColors = {
    default: 'rgb(97, 97, 97)',
    primary: 'rgba(144, 202, 249, 0.7)',
    secondary: 'rgba(206, 147, 216, 0.7)',
    error: 'rgba(244, 67, 54, 0.7)',
    info: 'rgba(41, 182, 246, 0.7)',
    success: 'rgba(102, 187, 106, 0.7)',
    warning: 'rgba(255, 167, 38, 0.7)',
  };

  const darkModeColors = {
    default: '#fff',
    primary: 'rgba(144, 202, 249, 0.7)',
    secondary: 'rgba(206, 147, 216, 0.7)',
    error: 'rgba(244, 67, 54, 0.7)',
    info: 'rgba(41, 182, 246, 0.7)',
    success: 'rgba(102, 187, 106, 0.7)',
    warning: 'rgba(255, 167, 38, 0.7)',
  };

  return (
    <Theme
      backgroundColor={
        props.variant === 'outlined' ? '#ffffff' : backgroundColors[props.color as keyof typeof backgroundColors]
      }
      borderColor={props.variant === 'outlined' ? outlinedColors[props.color as keyof typeof colors] : 'transparent'}
      borderRadius="16px"
      borderWidth="1px"
      color={
        props.variant === 'outlined'
          ? outlinedColors[props.color as keyof typeof outlinedColors]
          : colors[props.color as keyof typeof colors]
      }
      fontFamily="Roboto, Helvetica, Arial, sans-serif"
      fontWeight="400"
      onDarkMode={{
        backgroundColor:
          props.variant === 'outlined'
            ? 'rgb(15, 18, 20)'
            : darkModeBackgroundColors[props.color as keyof typeof darkModeBackgroundColors],
        borderColor:
          props.variant === 'outlined'
            ? darkModeOutlinedColors[props.color as keyof typeof darkModeOutlinedColors]
            : 'transparent',
        color:
          props.variant === 'outlined'
            ? darkModeColors[props.color as keyof typeof darkModeColors]
            : 'rgba(0, 0, 0, 0.87)',
      }}
      paddingBlock="6px"
      paddingInline="12px"
    >
      <Badge>{props.children}</Badge>
    </Theme>
  );
}

function AuraBadge(props: any) {
  return (
    <Theme
      backgroundImage="linear-gradient(120deg, #f8c7ff 20.08%, #d2ccff 75.81%)"
      borderRadius="4px"
      color="#161d26"
      fontSize="16px"
      fontFamily='"Amazon Ember Display", "Helvetica Neue", Helvetica, Arial, sans-serif'
      fontWeight="500"
      onDarkMode={{
        backgroundImage: "linear-gradient(120deg, #78008a 24.25%, #b2008f 69.56%)", 
        color: "#fff",
      }}
      paddingBlock="4px"
    >
      <Badge>{props.text}</Badge>
    </Theme>
  );
}

function SyntesisChip(props: any) {
  const outlined = props.variant === 'outlined';

  const colors = {
    default: 'rgb(51, 56, 67)',
    primary: 'rgb(143, 255, 206)',
    secondary: 'rgb(225, 227, 229)',
    error: 'rgb(255, 143, 143)',
    info: 'rgb(117, 207, 255)',
    success: 'rgb(98, 255, 87)',
    warning: 'rgb(254, 235, 62)',
  };

  return (
    <Theme
      backgroundColor={outlined ? 'rgb(27, 35, 45)' : colors[props.color as keyof typeof colors]}
      borderColor={outlined ? colors[props.color as keyof typeof colors] : 'transparent'}
      borderRadius="4px"
      borderWidth="1px"
      color={
        props.color === 'default' ? '#fff' : outlined ? colors[props.color as keyof typeof colors] : 'rgb(19, 29, 38)'
      }
      paddingBlock="5px"
      paddingInline="10px"
    >
      <Badge>{props.children}</Badge>
    </Theme>
  );
}
