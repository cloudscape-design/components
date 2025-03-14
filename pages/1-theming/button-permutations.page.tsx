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
          <SuccessButton variant="primary">Success</SuccessButton>
          <SuccessButton>Success</SuccessButton>
          {/*
          <AmplifyButton colorTheme="success" variation="primary">
            Success
          </AmplifyButton>

          <AmplifyButton colorTheme="error" variation="primary">
            Error
          </AmplifyButton>

          <AmplifyButton colorTheme="info" variation="primary">
            Info
          </AmplifyButton>

          <AmplifyButton colorTheme="warning" variation="primary">
            Warning
          </AmplifyButton>

          <AmplifyButton colorTheme="success">
            Success
          </AmplifyButton>

          <AmplifyButton colorTheme="error">
            Error
          </AmplifyButton>

          <AmplifyButton colorTheme="info">
            Info
          </AmplifyButton>

          <AmplifyButton colorTheme="warning">
            Warning
          </AmplifyButton>
          */}
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

function SuccessButton(props:any) {
  const green60 = 'hsl(130, 43%, 46%)';
  const green80 = 'hsl(130, 33%, 37%)';
  const green90 = 'hsl(130, 27%, 29%)';
  const green100 = 'hsl(130, 22%, 23%)';

  const isPrimary = props.variant === 'primary';

  const primary = {
    backgroundColor: {
      active: green100,
      default: green80,
      hover: green90,
    }, 
    borderColor: 'transparent',
    color: '#fff',
  };

  const normal = {
    backgroundColor: 'transparent', 
    borderColor: {
      default: green60,
      hover: green90,
    },
    color: green90,
  };

  return (
    <Theme 
      //backgroundColor={isPrimary }
      //borderColor={borderColors}
      borderRadius="4px"
      borderWidth="1px"
      //color={colors}
      fontFamily='InterVariable, "Inter var", Inter, -apple-system, "system-ui", "Helvetica Neue", "Segoe UI", Oxygen, Ubuntu, Cantarell, "Open Sans", sans-serif'
      fontSize='16px'
      lineHeight='24px'
      paddingBlock='8px'
      paddingInline='16px'
    >
      <Button onClick={props.onClick} variant={props.variant}>
        {props.children}
      </Button>
    </Theme>
  );
}

/*
function AmplifyButton(props:any) {
  const colorThemes = {
    success: {
      default: 'rgb(63, 125, 74)',
      hover: 'rgb(54, 94, 61)'
    },
    error: {
      default: 'rgb(149, 4, 4)',
      hover: 'rgb(102, 0, 0)',
    },
    info: {
      default: 'rgb(4, 52, 149)',
      hover: 'rgb(0, 34, 102)',
    },
    warning: {
      default: 'rgb(149, 77, 4)',
      hover: 'rgb(102, 51, 0)',
    }
  }

  const isPrimary = props.variation === 'primary';

  return (
    <Theme 
      backgroundColor={isPrimary ? colorThemes[props.colorTheme as keyof typeof colorThemes] : 'transparent'}
      borderColor={colorThemes[props.colorTheme as keyof typeof colorThemes]}
      color={isPrimary ? '#fff' : colorThemes[props.colorTheme as keyof typeof colorThemes]}
      borderRadius="4px"
      borderWidth="1px"
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
*/

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