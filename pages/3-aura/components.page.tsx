import React from 'react';
import { SpaceBetween, TextContent } from '~components';
import Alert from './alert';
import Badge from './badge';
import Checkbox from './checkbox';
import styles from'./styles.scss';

export default function Aura() {
  return (
    <div className={styles.aura}>
      <SpaceBetween direction='vertical' size='m'>
        <TextContent>
          <h3>Alert</h3>
        </TextContent>

        <Alert 
          message="A short description that explains why this banner is visible. It should also adequately instruct the user if action is needed."
          title="Title: I'm a title"
          variant="success"
        />

        <Alert 
          message="A short description that explains why this banner is visible. It should also adequately instruct the user if action is needed."
          title="Title: I'm a title"
          variant="warn"
        />

        <Alert 
          message="A short description that explains why this banner is visible. It should also adequately instruct the user if action is needed."
          title="Title: I'm a title"
          variant="error"
        />

        <Alert 
          message="A short description that explains why this banner is visible. It should also adequately instruct the user if action is needed."
          title="Title: I'm a title"
          variant="info"
        />

        <hr />

        <TextContent>
          <h3>Badge</h3>
        </TextContent>

        <Badge text="Test Badge" variant="gradient" />
        
        <hr />

        <TextContent>
          <h3>Checkbox</h3>
        </TextContent>

        <Checkbox label="Descriptive label" checked />
        <Checkbox label="Descriptive label" checked disabled />
        <Checkbox label="Descriptive label" />
        <Checkbox label="Descriptive label" disabled />
      </SpaceBetween>
    </div>
  );
}
