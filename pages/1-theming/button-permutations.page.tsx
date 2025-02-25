import React from 'react';
import { Button, SpaceBetween, TextContent } from '~components';
import Theme from '~components/theming/component/index';

export default function ButtonPermutations() {
  return (
    <div style={{ margin: '40px' }}>
      <SpaceBetween direction='vertical' size='m'>
        <TextContent>
          <h3>Amplify Buttons</h3>
        </TextContent>
        
        <SpaceBetween direction='horizontal' size='m'>
          <AmplifyButton
            variation="primary"
            loadingText=""
            colorTheme="default"
            onClick={() => alert('hello')}
          >
            Click me!
          </AmplifyButton>

          <AmplifyButton
            variation="primary"
            colorTheme="error"
            loadingText=""
            onClick={() => alert('hello')}
          >
            Click me!
          </AmplifyButton>

          <AmplifyButton
            variation="primary"
            colorTheme="info"
            loadingText=""
            onClick={() => alert('hello')}
          >
            Click me!
          </AmplifyButton>

          <AmplifyButton
            variation="primary"
            colorTheme="success"
            loadingText=""
            onClick={() => alert('hello')}
          >
            Click me!
          </AmplifyButton>

          <AmplifyButton
            loadingText=""
            colorTheme="default"
            onClick={() => alert('hello')}
          >
            Click me!
          </AmplifyButton>

          <AmplifyButton
            colorTheme="error"
            loadingText=""
            onClick={() => alert('hello')}
          >
            Click me!
          </AmplifyButton>

          <AmplifyButton
            colorTheme="info"
            loadingText=""
            onClick={() => alert('hello')}
          >
            Click me!
          </AmplifyButton>

          <AmplifyButton
            colorTheme="success"
            loadingText=""
            onClick={() => alert('hello')}
          >
            Click me!
          </AmplifyButton>
        </SpaceBetween>

        <hr />

        <TextContent>
          <h3>Material UI Buttons</h3>
        </TextContent>

        <hr />

        <TextContent>
          <h3>Aura Buttons</h3>
        </TextContent>

        <hr />

        <TextContent>
          <h3>Synthesis Buttons</h3>
        </TextContent>
      </SpaceBetween>
    </div>
  );
}

function AmplifyButton(props:any) {
  const backgroundColors = {
    default: 'rgb(4, 125, 149)',
    error: 'rgb(149, 4, 4)',
    info: 'rgb(4, 52, 149)',
    success: 'rgb(63, 125, 74)',
    warning: 'rgb(149, 77, 4)',
  }

  const colors = {
    default: 'rgb(4, 125, 149)',
    error: 'rgb(149, 4, 4)',
    info: 'rgb(4, 52, 149)',
    success: 'rgb(63, 125, 74)',
    warning: 'rgb(149, 77, 4)',
  }

  const isPrimary = props.variation === 'primary';

  return (
    <Theme 
      backgroundColor={isPrimary ? backgroundColors[props.colorTheme as keyof typeof backgroundColors] : '#fff'}
      borderRadius="4px"
      borderWidth="small"
      borderColor={isPrimary ? 'transparent' : backgroundColors[props.colorTheme as keyof typeof backgroundColors]}
      color={isPrimary ? "#fff" : colors[props.colorTheme as keyof typeof colors]}
      fontFamily='InterVariable, "Inter var", Inter, -apple-system, "system-ui", "Helvetica Neue", "Segoe UI", Oxygen, Ubuntu, Cantarell, "Open Sans", sans-serif'
      fontSize='16px'
      lineHeight='24px'
      paddingBlock='8px'
      paddingInline='16px'
    >
      <Button onClick={props.onClick} variant={props.variation}>
        {props.children}
      </Button>
    </Theme>
  );
}

function MaterialUIButton(props:any) {
  return (
    <></>
  );
}

function AuraAlert(props:any) {
  return (
    <></>
  );
}

function SynthesisAlert(props:any) {
  return (
    <></>
  );
}