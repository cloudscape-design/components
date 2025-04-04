import React from 'react';
import { SpaceBetween, TextContent } from '~components';
import Alert from './alert';
import styles from'./styles.scss';

export default function Katal() {
  return (
    <div className={styles.katal}>
      <SpaceBetween direction='vertical' size='m'>
        <TextContent>
          <h3>Alert</h3>
        </TextContent>

        <Alert 
          description="Used to give users context."
          header="Informational Alert"
          variant="info"
        />

        <Alert 
          description="Used to give users context."
          header="Informational Alert"
          variant="success"
        />

        <Alert 
          description="Used to give users context."
          header="Informational Alert"
          variant="danger"
        />

        <Alert 
          description="Used to give users context."
          header="Informational Alert"
          variant="warning"
        />
      </SpaceBetween>
    </div>
  );
}
