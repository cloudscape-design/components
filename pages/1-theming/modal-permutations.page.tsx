// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Box, Button, Modal, SpaceBetween, TextContent } from '~components';
import Theme from '~components/theming/component';

export default function ModalPermutations() {
  const [cloudscapeModalVisible, setCloudscapeModalVisible] = React.useState(false);
  const [synthesisModalVisible, setSynthesisModalVisible] = React.useState(true);

  return (
    <div style={{ margin: '40px' }}>
      <SpaceBetween direction="vertical" size="m">
        <TextContent>
          <h3>Cloudscape Modal</h3>
        </TextContent>

        <Button onClick={() => setCloudscapeModalVisible(true)}>Open Modal</Button>
        
        <Modal
          onDismiss={() => setCloudscapeModalVisible(false)}
          visible={cloudscapeModalVisible}
          footer={
            <Box float="right">
              <SpaceBetween direction="horizontal" size="xs">
                <Button variant="link">Cancel</Button>
                <Button variant="primary">Ok</Button>
              </SpaceBetween>
            </Box>
          }
          header="Modal title"
        >
          Your description should go here
        </Modal>

        <hr />

        <TextContent>
          <h3>Synthesis Modal</h3>
        </TextContent>

        <Button onClick={() => setSynthesisModalVisible(true)}>Open Modal</Button>
        
        <SynthesisDialog
          footerActions={
            <Box float="right">
              <SpaceBetween direction="horizontal" size="xs">
                <Button variant="link">Cancel</Button>
                <Button variant="primary">Ok</Button>
              </SpaceBetween>
            </Box>
          }
          open={synthesisModalVisible}
          onClose={() => setSynthesisModalVisible(false)}
          titleText="Title"
        >
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo magnam eligendi magni accusamus quidem autem soluta quas minus a. Omnis, id reprehenderit quis voluptatibus ea ab illo dolores dolore nostrum.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo magnam eligendi magni accusamus quidem autem soluta quas minus a. Omnis, id reprehenderit quis voluptatibus ea ab illo dolores dolore nostrum.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo magnam eligendi magni accusamus quidem autem soluta quas minus a. Omnis, id reprehenderit quis voluptatibus ea ab illo dolores dolore nostrum.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo magnam eligendi magni accusamus quidem autem soluta quas minus a. Omnis, id reprehenderit quis voluptatibus ea ab illo dolores dolore nostrum.
          </p>
        </SynthesisDialog>
      </SpaceBetween>
    </div>
  );
}

function SynthesisDialog(props: any) {
  return (
    <Modal
      footer={
        <Theme.Reset all>
          {props.footerActions}
        </Theme.Reset>
      }
      header={props.titleText}
      onDismiss={props.onClose}
      visible={props.open}
      theme={{
        backdrop: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        },
        container: {
          backgroundColor: '#1b232d',
          borderColor: 'rgb(114, 116, 126)',
          borderRadius: '8px',
          color: '#fff',
          height: '200px',
        }
      }}
    >
      {props.children}
    </Modal>
  );
}