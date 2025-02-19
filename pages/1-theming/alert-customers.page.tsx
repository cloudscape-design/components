import React from 'react';
import { Alert, SpaceBetween, TextContent } from '~components';
import Theme from '~components/theming/component/index';

export default function AlertCustomerThemes() {
  return (
    <div style={{ margin: '40px' }}>
      <SpaceBetween direction='vertical' size='m'>
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

        <hr />

        <TextContent>
          <h3>Material UI Alerts</h3>
        </TextContent>

        <MaterialUIAlert severity="success">
          This is a success Alert.
        </MaterialUIAlert>
        
        <MaterialUIAlert severity="info">
          This is an info Alert.
        </MaterialUIAlert>

        <MaterialUIAlert severity="warning">
            This is a warning Alert.
        </MaterialUIAlert>

        <MaterialUIAlert severity="error">
          This is an error Alert.
        </MaterialUIAlert>

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
      </SpaceBetween>
    </div>
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

  const darkModeBackgroundColors = {
    default: '#5c6670',
    error: '#4d0000',
    info: '#00194d',
    success: '#2e4832',
    warning: '#4d2600',
  }

  const darkModeColors = {
    default: '#ffffff',
    error: '#f5bcbc',
    info: '#b8cef9',
    success: '#d6f5db',
    warning: '#f5d9bc',
  }

  return (
    <Theme 
      backgroundColor={backgroundColors[props.variation as keyof typeof backgroundColors]}
      borderRadius="none"
      borderWidth="none"
      color={colors[props.variation as keyof typeof colors]}
      fontFamily='InterVariable, "Inter var", Inter, -apple-system, "system-ui", "Helvetica Neue", "Segoe UI", Oxygen, Ubuntu, Cantarell, "Open Sans", sans-serif'
      onDarkMode={{
        backgroundColor: darkModeBackgroundColors[props.variation as keyof typeof darkModeBackgroundColors],
        color: darkModeColors[props.variation as keyof typeof darkModeColors],
      }}
    >
      <Alert header={props.heading} type={props.variation === 'default' ? 'info' : props.variation}>
        {props.children}
      </Alert>
    </Theme>
  );
}

function MaterialUIAlert(props:any) {
  const backgroundColors = {
    error: 'rgb(253, 237, 237)',
    info: 'rgb(229, 246, 253)',
    success: 'rgb(237, 247, 237)',
    warning: 'rgb(255, 244, 229)',
  }

  const colors = {
    error: 'rgb(95, 33, 32)',
    info: 'rgb(1, 67, 97)',
    success: 'rgb(30, 70, 32)',
    warning: 'rgb(102, 60, 0)',
  }

  const darkModeBackgroundColors = {
    error: 'rgb(22, 11, 11)',
    info: 'rgb(7, 19, 24)',
    success: 'rgb(12, 19, 13)',
    warning: 'rgb(25, 18, 7)',
  }

  const darkModeColors = {
    error: 'rgb(244, 199, 199)',
    info: 'rgb(184, 231, 251)',
    success: 'rgb(204, 232, 205)',
    warning: 'rgb(255, 226, 183)',
  }

  return (
    <Theme 
      backgroundColor={backgroundColors[props.severity as keyof typeof backgroundColors]}
      borderRadius="4px"
      borderWidth="none"
      color={colors[props.severity as keyof typeof colors]}
      fontFamily='Roboto, Helvetica, Arial, sans-serif'
      onDarkMode={{
        backgroundColor: darkModeBackgroundColors[props.severity as keyof typeof darkModeBackgroundColors],
        color: darkModeColors[props.severity as keyof typeof darkModeColors],
      }}
    >
      <Alert header={props.heading} type={props.severity}>
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
      fontFamily='"Amazon Ember Display", "Helvetica Neue", Helvetica, Arial, sans-serif'
      onDarkMode={{
        backgroundColor: 'rgb(6, 8, 10)',
        borderColor: '#ffffff'
      }}
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
