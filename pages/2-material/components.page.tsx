import React from 'react';
import { SpaceBetween, TextContent } from '~components';
import Alert from './alert';
import Badge from './badge';
import Checkbox from './checkbox';
import styles from'./styles.scss';

export default function MaterialUI() {
  return (
    <div className={styles.material}>
      <SpaceBetween direction='vertical' size='m'>
        <TextContent>
          <h3>Alert</h3>
        </TextContent>

        <Alert severity="success">
          This is a success Alert.
        </Alert>
        
        <Alert severity="info">
          This is an info Alert.
        </Alert>

        <Alert severity="warning">
            This is a warning Alert.
        </Alert>

        <Alert severity="error">
          This is an error Alert.
        </Alert>

        <hr />

        <TextContent>
          <h3>Badge</h3>
        </TextContent>

        <Badge color="default">Chip Component</Badge>
        <Badge color="primary">Chip Component</Badge>
        <Badge color="secondary">Chip Component</Badge>
        <Badge color="error">Chip Component</Badge>
        <Badge color="info">Chip Component</Badge>
        <Badge color="success">Chip Component</Badge>
        <Badge color="warning">Chip Component</Badge>

        <Badge color="default" variant="outlined">
          Chip Component
        </Badge>

        <Badge color="primary" variant="outlined">
          Chip Component
        </Badge>

        <Badge color="secondary" variant="outlined">
          Chip Component
        </Badge>

        <Badge color="error" variant="outlined">
          Chip Component
        </Badge>

        <Badge color="info" variant="outlined">
          Chip Component
        </Badge>

        <Badge color="success" variant="outlined">
          Chip Component
        </Badge>

        <Badge color="warning" variant="outlined">
          Chip Component
        </Badge>

        <hr />

        <TextContent>
          <h3>Checkbox</h3>
        </TextContent>

        <Checkbox label="Label" defaultChecked />
        <Checkbox label="Label" defaultChecked disabled />
        <Checkbox label="Label" indeterminate />
        <Checkbox label="Label" indeterminate disabled />
        <Checkbox label="Label" />
        <Checkbox label="Label" disabled />
        <Checkbox label="Label" defaultChecked color="secondary" />
        <Checkbox label="Label" defaultChecked color="success" />
        <Checkbox label="Label" defaultChecked color="pink" />
        <Checkbox label="Label" defaultChecked size="large" />
        <Checkbox label="Label" defaultChecked size="xlarge" />
      </SpaceBetween>
    </div>
  );
}
