import React from 'react';
import { Badge, SpaceBetween, TextContent } from '~components';
import Theme from '~components/theming/component/index';

export default function BadgePermutations() {
  return (
    <div style={{ margin: '40px' }}>
      <SpaceBetween direction='vertical' size='m'>
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
        <MaterialUIChip color="default" variant="outlined">Chip Component</MaterialUIChip>
        <MaterialUIChip color="primary" variant="outlined">Chip Component</MaterialUIChip>
        <MaterialUIChip color="secondary" variant="outlined">Chip Component</MaterialUIChip>
        <MaterialUIChip color="error" variant="outlined">Chip Component</MaterialUIChip>
        <MaterialUIChip color="info" variant="outlined">Chip Component</MaterialUIChip>
        <MaterialUIChip color="success" variant="outlined">Chip Component</MaterialUIChip>
        <MaterialUIChip color="warning" variant="outlined">Chip Component</MaterialUIChip>
        
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
        <SyntesisChip color="default" variant="outlined">Chip text</SyntesisChip>
        <SyntesisChip color="primary" variant="outlined">Chip text</SyntesisChip>
        <SyntesisChip color="secondary" variant="outlined">Chip text</SyntesisChip>
        <SyntesisChip color="error" variant="outlined">Chip text</SyntesisChip>
        <SyntesisChip color="info" variant="outlined">Chip text</SyntesisChip>
        <SyntesisChip color="success" variant="outlined">Chip text</SyntesisChip>
        <SyntesisChip color="warning" variant="outlined">Chip text</SyntesisChip>
      </SpaceBetween>
    </div>
  );
}

function AmplifyBadge(props:any) {
  const backgroundColors = {
    default: '#eff0f0',
    error: '#fce9e9',
    info: '#e6eefe',
    success: '#ebfaed',
    warning: '#fcf2e9',
  }

  const colors = {
    default: '#0d1926',
    error: '#660000',
    info: '#002266',
    success: '#365e3d',
    warning: '#660000',
  }

  return (
    <Theme 
      backgroundColor={backgroundColors[props.variation as keyof typeof backgroundColors]}
      borderRadius="32px"
      borderWidth="0px"
      color={colors[props.variation as keyof typeof colors]}
      fontFamily='InterVariable, "Inter var", Inter, -apple-system, "system-ui", "Helvetica Neue", "Segoe UI", Oxygen, Ubuntu, Cantarell, "Open Sans", sans-serif'
      fontWeight="600"
      lineHeight="14px"
      paddingBlock="8px"
      paddingInline="12px"
    >
      <Badge>{props.children}</Badge>
    </Theme>
  );
}

function MaterialUIChip(props:any) {
  const backgroundColors = {
    default: 'rgba(0, 0, 0, 0.08)',
    primary: 'rgb(25, 118, 210)',
    secondary: 'rgb(156, 39, 176)',
    error: 'rgb(211, 47, 47)',
    info: 'rgb(2, 136, 209)',
    success: 'rgb(46, 125, 50)',
    warning: 'rgb(237, 108, 2)'
  };

  const colors = {
    default: 'rgba(0, 0, 0, 0.87)',
    primary: '#ffffff',
    secondary: '#ffffff',
    error: '#ffffff',
    info: '#ffffff',
    success: '#ffffff',
    warning: '#ffffff'
  }

  const outlinedColors = {
    default: 'rgba(0, 0, 0, 0.87)',
    primary: 'rgb(25, 118, 210)',
    secondary: 'rgb(156, 39, 176)',
    error: 'rgb(211, 47, 47)',
    info: 'rgb(2, 136, 209)',
    success: 'rgb(46, 125, 50)',
    warning: 'rgb(237, 108, 2)'
  }

  return (
    <Theme 
      backgroundColor={props.variant === 'outlined' ? '#ffffff' : backgroundColors[props.color as keyof typeof backgroundColors]}
      borderColor={props.variant === 'outlined' ? outlinedColors[props.color as keyof typeof colors] : 'transparent' }
      borderRadius="16px"
      borderWidth="1px"
      color={props.variant === 'outlined' ? outlinedColors[props.color as keyof typeof outlinedColors] : colors[props.color as keyof typeof colors]}
      fontFamily='Roboto, Helvetica, Arial, sans-serif'
      fontWeight="400"
      paddingBlock="6px"
      paddingInline="12px"
    >
      <Badge>{props.children}</Badge>
    </Theme>
  );
}

function AuraBadge(props:any) {
  return (
    <Theme 
      backgroundImage='linear-gradient(120deg, #f8c7ff 20.08%, #d2ccff 75.81%)'
      borderRadius="4px"
      color="#161d26"
      fontSize="16px"
      fontFamily='"Amazon Ember Display", "Helvetica Neue", Helvetica, Arial, sans-serif'
      fontWeight="500"
      paddingBlock='4px'
    >
      <Badge>{props.text}</Badge>
    </Theme>
  );
}

function SyntesisChip(props:any) {
  const outlined = props.variant === 'outlined';

  const colors = {
    default: 'rgb(51, 56, 67)',
    primary: 'rgb(143, 255, 206)',
    secondary: 'rgb(225, 227, 229)',
    error: 'rgb(255, 143, 143)',
    info: 'rgb(117, 207, 255)',
    success: 'rgb(98, 255, 87)',
    warning: 'rgb(254, 235, 62)'
  };

  return (
    <Theme 
      backgroundColor={outlined ? '#ffffff' : colors[props.color as keyof typeof colors]}
      borderColor={outlined ? colors[props.color as keyof typeof colors] : 'transparent' }
      borderRadius="4px"
      borderWidth="1px"
      color={outlined ? colors[props.color as keyof typeof colors] : props.color === 'default' ? '#fff' : 'rgb(19, 29, 38)'}
      paddingBlock='5px'
      paddingInline="10px"
    >
      <Badge>{props.children}</Badge>
    </Theme>
  );
}