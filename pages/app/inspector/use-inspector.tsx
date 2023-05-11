// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { InspectorPanel } from './inspector-panel';

let originalBodyPadding = '';
let panel: null | HTMLElement = null;

function createTokensPanel(onClose: () => void) {
  originalBodyPadding = document.body.style.paddingRight;
  document.body.style.paddingRight = '400px';

  panel = document.createElement('div');
  panel.style.position = 'fixed';
  panel.style.boxSizing = 'border-box';
  panel.style.zIndex = '10000';
  panel.style.top = '0px';
  panel.style.bottom = '0px';
  panel.style.right = '0px';
  panel.style.width = '400px';
  panel.style.background = 'white';
  document.body.append(panel);

  render(<InspectorPanel onClose={onClose} />, panel);
}

function destroyTokensPanel() {
  document.body.style.paddingRight = originalBodyPadding;
  if (panel) {
    unmountComponentAtNode(panel);
    panel.remove();
  }
}

interface InspectorProps {
  open: boolean;
  onClose: () => void;
}

export function useInspector({ open, onClose }: InspectorProps) {
  useEffect(
    () => {
      if (!open) {
        return;
      }

      createTokensPanel(onClose);

      return () => {
        destroyTokensPanel();
      };
    },
    // Expecting onClose to be stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open]
  );
}
