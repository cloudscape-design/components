// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, Drawer } from '~components';
import { registerLeftDrawer } from '~components/internal/plugins/widget';
import { mount, unmount } from '~mount';

import AssistantChat from './field-registry-assistant-chat';

const pageParams = () => new URLSearchParams(window.location.hash.split('?')[1]);

function AssistantFrame() {
  return (
    <iframe
      id="field-registry-assistant-frame"
      title="Form assistant"
      src={`#/light/field-registry/frame-assistant?visualRefresh=${pageParams().get('visualRefresh') ?? 'false'}`}
      style={{ border: 0, inlineSize: '100%', blockSize: 720 }}
    />
  );
}

registerLeftDrawer({
  id: 'field-registry-assistant',
  defaultActive: true,
  resizable: true,
  defaultSize: 420,
  ariaLabels: {
    closeButton: 'Close form assistant',
    content: 'Form assistant',
    triggerButton: 'Form assistant',
    resizeHandle: 'Resize form assistant',
  },
  mountContent: container =>
    mount(
      <Drawer header={<Box variant="h3">Form assistant</Box>}>
        {pageParams().get('assistantInFrame') === 'true' ? <AssistantFrame /> : <AssistantChat />}
      </Drawer>,
      container
    ),
  unmountContent: container => unmount(container),
});
