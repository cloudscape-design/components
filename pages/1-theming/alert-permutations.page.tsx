import React from 'react';
import { Alert, Button, SpaceBetween, TextContent } from '~components';
import Theme from '~components/theming/component/index';

export default function AlertPermutations() {
  return (
    <div style={{ margin: '40px' }}>
      <SpaceBetween direction='vertical' size='m'>
        <TextContent>
          <h3>Cloudscape Alerts</h3>
        </TextContent>

        <Alert header="Header message" type="success">
          Alert desription
        </Alert>

        <Alert header="Header message" type="warning">
          Alert desription
        </Alert>

        <Alert header="Header message" type="error">
          Alert desription
        </Alert>

        <Alert header="Header message" type="info">
          Alert desription
        </Alert>

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
          <h3>Synthesis Alerts</h3>
        </TextContent>

        <SynthesisAlert severity="success" titleText="Alert title text">
          This is a success Alert.
        </SynthesisAlert>
        
        <SynthesisAlert severity="info" titleText="Alert title text">
          This is an info Alert.
        </SynthesisAlert>

        <SynthesisAlert severity="warning" titleText="Alert title text">
            This is a warning Alert.
        </SynthesisAlert>

        <SynthesisAlert severity="error" titleText="Alert title text">
          This is an error Alert.
        </SynthesisAlert>

        <hr />

        <TextContent>
          <h3>Katal Alerts</h3>
        </TextContent>

        <KatalAlert 
          description="Used to give users context."
          header="Informational Alert"
          variant="info"
        />

        <KatalAlert 
          description="Used to give users context."
          header="Informational Alert"
          variant="success"
        />

        <KatalAlert 
          description="Used to give users context."
          header="Informational Alert"
          variant="danger"
        />

        <KatalAlert 
          description="Used to give users context."
          header="Informational Alert"
          variant="warning"
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

        <FintechAlert 
          action={
            <Theme.Reset all>
              <Button>Button text</Button>
            </Theme.Reset>
          }
          dismissible
          header="Header message" 
          type="info"
        >
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
      borderRadius="0px"
      borderWidth="0px"
      color={colors[props.variation as keyof typeof colors]}
      fill={colors[props.variation as keyof typeof colors]}
      fontFamily='InterVariable, "Inter var", Inter, -apple-system, "system-ui", "Helvetica Neue", "Segoe UI", Oxygen, Ubuntu, Cantarell, "Open Sans", sans-serif'
      onDarkMode={{
        backgroundColor: darkModeBackgroundColors[props.variation as keyof typeof darkModeBackgroundColors],
        color: darkModeColors[props.variation as keyof typeof darkModeColors],
        fill: darkModeColors[props.variation as keyof typeof darkModeColors],
      }}
    >
      <Alert 
        action={props.action}
        header={props.heading} 
        type={props.variation === 'default' ? 'info' : props.variation}
      >
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

  const fills = {
    error: 'rgb(211, 47, 47)',
    info: 'rgb(2, 136, 209)',
    success: 'rgb(46, 125, 50)',
    warning: 'rgb(237, 108, 2)',
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

  const darkModeFills = {
    error: 'rgb(244, 67, 54)',
    info: 'rgb(41, 182, 246)',
    success: 'rgb(102, 187, 106)',
    warning: 'rgb(255, 167, 38)',
  }

  return (
    <Theme 
      backgroundColor={backgroundColors[props.severity as keyof typeof backgroundColors]}
      borderRadius="4px"
      borderWidth="0px"
      color={colors[props.severity as keyof typeof colors]}
      fill={fills[props.severity as keyof typeof fills]}
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
  const fills = {
    error: 'rgb(209, 70, 0)',
    info: 'rgb(0, 108, 224)',
    success: 'rgb(0, 138, 46)',
    warn: 'rgb(209, 70, 0)',
  };

  const darkModeFills = {
    error: '#ff6161',
    info: '#42b4ff',
    success: '#00e500',
    warn: '#ff9900',
  };

  return (
    <Theme 
      backgroundColor="#ffffff"
      borderColor="#161d26"
      borderRadius="8px"
      borderWidth="1px"
      fontFamily='"Amazon Ember Display", "Helvetica Neue", Helvetica, Arial, sans-serif'
      fill={fills[props.variant as keyof typeof fills]}
      onDarkMode={{
        backgroundColor: "#161d26",
        borderColor: "#fff",
        fill: darkModeFills[props.variant as keyof typeof darkModeFills],
      }}
    >
      <Alert header={props.title} type={props.variant === 'warn' ? 'warning' : props.variant}>
        {props.message}
      </Alert>
    </Theme>
  );
}

function SynthesisAlert(props:any) {
  const backgroundColors = {
    error: 'rgb(255, 143, 143)',
    info: 'rgb(117, 207, 255)',
    success: 'rgb(98, 255, 87)',
    warning: 'rgb(254, 235, 62)',
  }

  return (
    <Theme 
      backgroundColor={backgroundColors[props.severity as keyof typeof backgroundColors]}
      borderRadius="8px"
      borderWidth="0px"
      color="rgba(0, 0, 0, 0.87)"
      fill="rgba(0, 0, 0, 0.87)"
    >
      <Alert header={props.titleText} type={props.severity}>
        {props.children}
      </Alert>
    </Theme>
  );
}

function KatalAlert(props:any) {
  const backgroundColors = {
    danger: '#ffe5df',
    info: '#ebf7ff',
    success: '#f2f6e1',
    warning: '#fdf4d8',
  }

  const fills = {
    danger: '#cf2900',
    info: '#0a6fc2',
    success: '#387000',
    warning: '#ebac00',
  };

  const darkModeBackgroundColors = {
    danger: '#801a00',
    info: '#063b73',
    success: '#1f3d00',
    warning: '#a36a00',
  };

  const darkModeFills = {
    danger: '#ff6038',
    info: '#fff',
    success: '#7ea949',
    warning: '#fdd34a',
  };

  return (
    <Theme 
      backgroundColor={backgroundColors[props.variant as keyof typeof backgroundColors]}
      borderRadius="0px"
      borderWidth="0px"
      color="rgb(35, 47, 62)"
      fill={fills[props.variant as keyof typeof fills]}
      paddingBlock='12px'
      paddingInline="20px"
      gapBlock='4px'
      gapInline="14px"
      onDarkMode={{
        backgroundColor: darkModeBackgroundColors[props.variant as keyof typeof darkModeBackgroundColors],
        color: "#fff",
        fill: darkModeFills[props.variant as keyof typeof darkModeFills],
      }}
    >
      <div style={{ borderLeft: `4px solid ${fills[props.variant as keyof typeof fills]}`}}>
        <Alert header={props.header} type={props.variant === 'danger' ? 'error' : props.variant}>
          {props.description}
        </Alert>
      </div>
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

  const fills = {
    error: '#DC5B50',
    info: '#5278D9',
    success: '#558E23',
    warning: '#B2A044',
  };

  return (
    <Theme 
      backgroundColor={backgroundColors[props.type as keyof typeof backgroundColors]}
      borderColor={borderColors[props.type as keyof typeof borderColors]}
      borderRadius="8px"
      borderWidth="1px"
      fill={fills[props.type as keyof typeof fills]}
      onDarkMode={{
        backgroundColor: borderColors[props.type as keyof typeof borderColors],
        borderColor: "transparent",
        color: "#fff",
        fill: "#fff",
      }}
    >
      <Alert 
        action={props.action}
        dismissible={props.dismissible}
        header={props.header} 
        type={props.type}
      >
        {props.children}
      </Alert>
    </Theme>
  );
}
