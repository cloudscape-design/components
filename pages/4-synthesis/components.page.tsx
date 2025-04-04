import React from 'react';
import { SpaceBetween, TextContent } from '~components';
import Alert from './alert';
import Badge from './badge';
import styles from'./styles.scss';

export default function Synthesis() {
  return (
    <div className={styles.synthesis}>
      <SpaceBetween direction='vertical' size='m'>
        <TextContent>
          <h3>Alert</h3>
        </TextContent>

        <Alert severity="success" titleText="Alert title text">
          This is a success Alert.
        </Alert>
        
        <Alert severity="info" titleText="Alert title text">
          This is an info Alert.
        </Alert>

        <Alert severity="warning" titleText="Alert title text">
            This is a warning Alert.
        </Alert>

        <Alert severity="error" titleText="Alert title text">
          This is an error Alert.
        </Alert>

        <hr />

        <TextContent>
          <h3>Badge</h3>
        </TextContent>

        <Badge color="default">Chip text</Badge>
        <Badge color="primary">Chip text</Badge>
        <Badge color="secondary">Chip text</Badge>
        <Badge color="error">Chip text</Badge>
        <Badge color="info">Chip text</Badge>
        <Badge color="success">Chip text</Badge>
        <Badge color="warning">Chip text</Badge>

        <Badge color="default" variant="outlined">
          Chip text
        </Badge>

        <Badge color="primary" variant="outlined">
          Chip text
        </Badge>

        <Badge color="secondary" variant="outlined">
          Chip text
        </Badge>

        <Badge color="error" variant="outlined">
          Chip text
        </Badge>

        <Badge color="info" variant="outlined">
          Chip text
        </Badge>

        <Badge color="success" variant="outlined">
          Chip text
        </Badge>

        <Badge color="warning" variant="outlined">
          Chip text
        </Badge>
      </SpaceBetween>
    </div>
  );
}
