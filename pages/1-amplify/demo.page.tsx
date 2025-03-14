import React from 'react';
import { SpaceBetween, TextContent } from '~components';
import Alert from './alert';
import Badge from './badge';
import CheckboxField from './checkbox-field';
import { fontFamily } from './typography';
import Theme from '~components/theming/component';

export default function AmplifyDemo() {
  return (
    <Theme fontFamily={fontFamily}>
      <div style={{ margin: '40px' }}>
        <SpaceBetween direction='vertical' size='m'>
          <TextContent>
            <h3>Alert</h3>
          </TextContent>

          <Alert heading="Alert heading" variation="default">
            This is the alert message
          </Alert>

          <Alert heading="Alert heading" variation="info">
            This is the alert message
          </Alert>

          <Alert heading="Alert heading" variation="error">
            This is the alert message
          </Alert>

          <Alert heading="Alert heading" variation="warning">
            This is the alert message
          </Alert>

          <Alert heading="Alert heading" variation="success">
            This is the alert message
          </Alert>

          <hr />

          <TextContent>
            <h3>Badge</h3>
          </TextContent>

          <Badge variation="default">Badge</Badge>
          <Badge variation="info">Badge</Badge>
          <Badge variation="error">Badge</Badge>
          <Badge variation="warning">Badge</Badge>
          <Badge variation="success">Badge</Badge>

          <hr />

          <TextContent>
            <h3>Checkbox Field</h3>
          </TextContent>

          <CheckboxField checked={true} label="Subscribe" />
          <CheckboxField checked={true} isDisabled label="Subscribe" />
          <CheckboxField checked={true} isIndeterminate label="Subscribe" />
          <CheckboxField checked={true} isIndeterminate isDisabled label="Subscribe" />
          <CheckboxField checked={false} label="Subscribe" />
          <CheckboxField checked={false} isDisabled label="Subscribe" />
        </SpaceBetween>
      </div>
    </Theme>
  );
}
