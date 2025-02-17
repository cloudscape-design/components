import React from 'react';
import { Alert, SpaceBetween, TextContent } from '~components';
import Theme from '~components/theming/component/index';

export default function AlertCustomerThemes() {
  return (
    <div style={{ margin: '40px' }}>
      <SpaceBetween direction='vertical' size='m'>
        <TextContent>
          <h3>Fintech Alerts</h3>
        </TextContent>

        <FintechAlert header="Header message" type="success">
          Alert desription
        </FintechAlert>

        <FintechAlert header="Header message" type="warning">
          Alert desription
        </FintechAlert>

        <FintechAlert header="Header message" type="error">
          Alert desription
        </FintechAlert>

        <FintechAlert header="Header message" type="info">
          Alert desription
        </FintechAlert>

        <hr />

        <TextContent>
          <h3>Aura Alerts</h3>
        </TextContent>

        <AuraAlert 
          message="A short description that explains why this banner is visible. It should also adequately instruct the user if action is needed."
          title="Title: I'm a title"
          variant="success"
        />

        <AuraAlert 
          message="A short description that explains why this banner is visible. It should also adequately instruct the user if action is needed."
          title="Title: I'm a title"
          variant="warn"
        />

        <AuraAlert 
          message="A short description that explains why this banner is visible. It should also adequately instruct the user if action is needed."
          title="Title: I'm a title"
          variant="error"
        />

        <AuraAlert 
          message="A short description that explains why this banner is visible. It should also adequately instruct the user if action is needed."
          title="Title: I'm a title"
          variant="info"
        />
        <hr />

        <TextContent>
          <h3>Amplify Alerts</h3>
        </TextContent>

        <AmplifyAlert heading="Alert heading" variation="default">
          This is the alert message
        </AmplifyAlert>

        <AmplifyAlert heading="Alert heading" variation="info">
          This is the alert message
        </AmplifyAlert>

        <AmplifyAlert heading="Alert heading" variation="error">
          This is the alert message
        </AmplifyAlert>

        <AmplifyAlert heading="Alert heading" variation="warning">
          This is the alert message
        </AmplifyAlert>

        <AmplifyAlert heading="Alert heading" variation="success">
          This is the alert message
        </AmplifyAlert>
      </SpaceBetween>
    </div>
  );
}

function FintechAlert(props:any) {
  const backgroundColors = {
    error: '#FFF3F2',
    info: '#F5F7FF',
    success: '#F6FFEC',
    warning: '#FFFBE3',
  }

  const borderColors = {
    error: '#EA4C4C',
    info: '#0972D3',
    success: '#46900B',
    warning: '#A28700',
  }

  return (
    <Theme 
      backgroundColor={backgroundColors[props.type as keyof typeof backgroundColors]}
      borderColor={borderColors[props.type as keyof typeof borderColors]}
      borderRadius="small"
      borderWidth="small"
    >
      <Alert header={props.header} type={props.type}>
        {props.children}
      </Alert>
    </Theme>
  );
}

function AuraAlert(props:any) {
  return (
    <Theme 
      backgroundColor="#ffffff"
      borderColor="#161d26"
      borderRadius="small"
      borderWidth="small"
    >
      <Alert 
        header={props.title} 
        type={props.variant === 'warn' ? 'warning' : props.variant}
      >
        {props.message}
      </Alert>
    </Theme>
  );
}

function AmplifyAlert(props:any) {
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
    info: '#0d1926',
    success: '#365e3d',
    warning: '#660000',
  }

  return (
    <Theme 
      backgroundColor={backgroundColors[props.variation as keyof typeof backgroundColors]}
      borderRadius="none"
      borderWidth="none"
      color={colors[props.variation as keyof typeof colors]}
    >
      <Alert header={props.heading} type={props.variation === 'default' ? 'info' : props.variation}>
        {props.children}
      </Alert>
    </Theme>
  );
}