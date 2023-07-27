// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Button } from '~components';
import Popover from '~components/popover';

export default function () {
  const [renderWithPortal, setRenderWithPortal] = React.useState(false);
  return (
    <article>
      <h1>Popover focus test</h1>
      <section>
        <label>
          <input
            id="renderWithPortal"
            type="checkbox"
            checked={renderWithPortal}
            onChange={e => setRenderWithPortal(e.target.checked)}
          />
          renderWithPortal
        </label>
      </section>
      <ul>
        <li>Popover with dismiss button should trap focus when opened</li>
        <li>Popover with dismiss button should return focus to the trigger when closed</li>
        <li id="text-before-focus-trap">
          Popover with dismiss button should not prevent focus from moving to the clicked element
        </li>
      </ul>
      <button type="button" id="focus-trap-target">
        Click to focus
      </button>{' '}
      <Popover
        size="medium"
        header="Memory error"
        content={
          <>
            <p>
              This instance contains insufficient memory. Stop the instance, choose a different instance type with more
              memory, and restart it.
            </p>
            <input />
          </>
        }
        dismissAriaLabel="Close"
        id="focus-trap"
        renderWithPortal={renderWithPortal}
      >
        Error
      </Popover>
      <br />
      <button type="button" id="focus-trap-target-button">
        Click to focus
      </button>{' '}
      <Popover
        size="medium"
        header="Memory error"
        content={
          <>
            <p>
              This instance contains insufficient memory. Stop the instance, choose a different instance type with more
              memory, and restart it.
            </p>
            <input />
          </>
        }
        dismissAriaLabel="Close"
        id="focus-trap-button"
        renderWithPortal={renderWithPortal}
        triggerType="custom"
      >
        <Button>Open</Button>
      </Popover>
      <ul>
        <li>Popover without dismiss button should not trap focus when opened</li>
        <li>Popover without dismiss button should close when focus leaves the trigger</li>
      </ul>
      <button type="button" id="no-focus-trap-target">
        Click to focus
      </button>{' '}
      <Popover
        position="top"
        size="small"
        content="Text copied."
        id="no-focus-trap"
        dismissButton={false}
        renderWithPortal={renderWithPortal}
      >
        sj-45ab8k
      </Popover>
      <div tabIndex={0}>
        <Popover
          size="medium"
          header="Memory error"
          content={
            <>
              <p>
                This instance contains insufficient memory. Stop the instance, choose a different instance type with
                more memory, and restart it.
              </p>
              <input />
            </>
          }
          dismissAriaLabel="Close"
          id="focus-trap-within-focusable"
          renderWithPortal={renderWithPortal}
        >
          Error
        </Popover>
      </div>
    </article>
  );
}
