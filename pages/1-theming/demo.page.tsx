import React from 'react';
import { Alert, SpaceBetween, TextContent } from '~components';
import Theme from '~components/theming/component/index';

export default function AlertThemePermutations() {
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

        <Theme borderWidth="0px" borderRadius="0px">
          <Alert>
            Review the documentation to learn about potential compatibility issues with specific database versions.
          </Alert>
        </Theme>

        <Theme borderWidth="1px" borderRadius="8px">
          <Alert>
            Review the documentation to learn about potential compatibility issues with specific database versions.
          </Alert>
        </Theme>

        <Theme borderWidth="2px" borderRadius="16px">
          <Alert>
            Review the documentation to learn about potential compatibility issues with specific database versions.
          </Alert>
        </Theme>

        <Theme borderWidth="3px" borderRadius="24px">
          <Alert>
            Review the documentation to learn about potential compatibility issues with specific database versions.
          </Alert>
        </Theme>

        <hr />

        <TextContent>
          <h3>Nested Themes</h3>
        </TextContent>


        <Theme borderWidth="1px" borderRadius="0px">
          <Alert>
            Review the documentation to learn about potential compatibility issues with specific database versions.
          </Alert>
          
          <br/> 

          <Theme borderRadius="24px">
            <Alert>
              Review the documentation to learn about potential compatibility issues with specific database versions.
            </Alert>
          </Theme>
        </Theme>
      </SpaceBetween>
    </div>
  );
}