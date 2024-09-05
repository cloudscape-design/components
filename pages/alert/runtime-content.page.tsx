// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { Checkbox, FormField, Input } from '~components';
import Alert, { AlertProps } from '~components/alert';
import Button from '~components/button';
import awsuiPlugins from '~components/internal/plugins';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

awsuiPlugins.alertContent.registerContentReplacer({
  id: 'awsui/alert-test-action',
  runReplacer(context, registerReplacement) {
    console.log('mount');

    const doReplace = () => {
      registerReplacement('header', 'original');
      registerReplacement('content', 'original');
      if (context.type === 'error' && context.contentRef.current?.textContent?.match('Access denied')) {
        registerReplacement('header', 'remove');
        registerReplacement('content', container => {
          console.log('render replacement content');
          render(<div>---REPLACEMENT--- Access denied message! ---REPLACEMENT---</div>, container);
        });
      }
    };

    doReplace();

    return {
      update() {
        console.log('update');
        doReplace();
      },
      unmount({ replacementContentContainer }) {
        console.log('unmount');
        unmountComponentAtNode(replacementContentContainer);
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
        Alert content loading
      </Checkbox>
      <Checkbox onChange={e => setHidden(e.detail.checked)} checked={hidden}>
        Unmount all alerts
      </Checkbox>
      <FormField label="Input for unrelated state updated">
        <Input value={anotherState} onChange={e => setAnotherState(e.detail.value)} />
      </FormField>
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
                  {loading ? 'Loading...' : permutation.children}
                </Alert>
              </>
            )}
          />
        )}
      </ScreenshotArea>
    </>
  );
}
