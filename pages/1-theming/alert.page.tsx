import React from 'react';
import { Alert, SpaceBetween, TextContent } from '~components';
import Theme from '~components/theming/component/index';

export default function AlertTheme() {
  return (
    <div style={{ margin: '40px' }}>
      <SpaceBetween direction='vertical' size='m'>
        <TextContent>
          <h3>Default Alert</h3>
        </TextContent>

        <Alert header="Known issues/limitations">
          Review the documentation to learn about potential compatibility issues with specific database versions.
        </Alert>

        <hr />

        <TextContent>
          <h3>Permutations</h3>
        </TextContent>

        <Theme borderWidth="none" borderRadius="none">
          <Alert>
            Review the documentation to learn about potential compatibility issues with specific database versions.
          </Alert>
        </Theme>

        <Theme borderWidth="small" borderRadius="small">
          <Alert>
            Review the documentation to learn about potential compatibility issues with specific database versions.
          </Alert>
        </Theme>

        <Theme borderWidth="medium" borderRadius="medium">
          <Alert>
            Review the documentation to learn about potential compatibility issues with specific database versions.
          </Alert>
        </Theme>

        <Theme borderWidth="large" borderRadius="large">
          <Alert>
            Review the documentation to learn about potential compatibility issues with specific database versions.
          </Alert>
        </Theme>

        <hr />

        <TextContent>
          <h3>Nested Themes</h3>
        </TextContent>


        <Theme borderWidth="small" borderRadius="none">
          <Alert>
            Review the documentation to learn about potential compatibility issues with specific database versions.
          </Alert>
          
          <br/> 

          <Theme borderRadius="large">
            <Alert>
              Review the documentation to learn about potential compatibility issues with specific database versions.
            </Alert>
          </Theme>
        </Theme>

        <hr />

        <TextContent>
          <h3>Custom Component</h3>
        </TextContent>

        <MyCustomAlert>
          Review the documentation to learn about potential compatibility issues with specific database versions.
        </MyCustomAlert>
      </SpaceBetween>
    </div>
  );
}

// custom variants, states, subtrees, exceptions and specific values

function MyCustomAlert({children}:any) {
  return (
    <Theme backgroundColor="pink">
      {/*
      <Theme.Hover />
      <Theme.Focus />
      <Theme.Active />
      <Theme.Disabled />
      */}

      <Alert>
        {children}
      </Alert>
    </Theme>
  );
}

/*
function MyCustomAlert({children}:any) {
  return (
    <>
      <Alert className="my-custom-alert">
        {children}
      </Alert>

      <style>
        {`
          .my-custom-alert {
            background-color: pink;
          } 
        `
        }
      </style>
    </>
  );
}
  */