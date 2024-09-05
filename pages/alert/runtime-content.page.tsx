// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { Checkbox, Input, Spinner } from '~components';
import Alert, { AlertProps } from '~components/alert';
import Button from '~components/button';
import awsuiPlugins from '~components/internal/plugins';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

awsuiPlugins.alertContent.registerContentReplacer({
  id: 'awsui/alert-test-action',
  runReplacer(context, registerReplacement) {
    const appendedContent = document.createElement('div');

    const doReplace = () => {
      registerReplacement('header', 'original');
      registerReplacement('content', 'original');
      if (context.type === 'error' && context.contentRef.current?.textContent?.match('Access denied')) {
        render(<Spinner />, appendedContent);
        context.contentRef.current.appendChild(appendedContent);
        setTimeout(() => {
          unmountComponentAtNode(appendedContent);
          appendedContent.parentNode?.removeChild(appendedContent);

          registerReplacement('header', 'remove');
          registerReplacement('content', container => {
            render(<div>Access denied message!</div>, container);

            return () => {
              unmountComponentAtNode(container);
            };
          });
        }, 2000);
      }
    };

    doReplace();

    return {
      update() {
        console.log('update');
        doReplace();
      },
      unmount() {
        console.log('unmount');
        unmountComponentAtNode(appendedContent);
      },
    };
  },
});

/* eslint-disable react/jsx-key */
const permutations = createPermutations<AlertProps>([
  {
    header: [null, 'Alert'],
    children: ['Content', 'There was an error: Access denied because of XYZ'],
    type: ['success', 'error'],
    action: [null, <Button>Action</Button>],
  },
]);
/* eslint-enable react/jsx-key */

export default function () {
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [anotherState, setAnotherState] = useState('');
  return (
    <>
      <h1>Alert runtime actions</h1>
      <Checkbox onChange={e => setLoading(e.detail.checked)} checked={loading}>
        Loading
      </Checkbox>
      <Checkbox onChange={e => setHidden(e.detail.checked)} checked={hidden}>
        Hide
      </Checkbox>
      <Input value={anotherState} onChange={e => setAnotherState(e.detail.value)} ariaLabel="Another state" />
      <ScreenshotArea>
        {hidden ? null : (
          <PermutationsView
            permutations={permutations}
            render={permutation => (
              <>
                <Alert
                  statusIconAriaLabel={permutation.type}
                  dismissAriaLabel="Dismiss"
                  {...permutation}
                  header={<Button>Action</Button>}
                />
                <Alert
                  statusIconAriaLabel={permutation.type}
                  dismissAriaLabel="Dismiss"
                  {...permutation}
                  header={<Button>Action</Button>}
                >
                  {loading ? 'Loading' : permutation.children}
                </Alert>
              </>
            )}
          />
        )}
      </ScreenshotArea>
    </>
  );
}
