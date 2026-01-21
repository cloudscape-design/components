// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useState } from 'react';

import Popover from '~components/popover';

import AppContext, { AppContextType } from '../app/app-context';

const longContent =
  'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.';

type DemoContext = React.Context<
  AppContextType<{
    renderWithPortal: boolean;
    maxHeight: string;
  }>
>;

export default function () {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const [maxHeightInput, setMaxHeightInput] = useState(urlParams.maxHeight || '200');

  const maxHeight = maxHeightInput ? parseInt(maxHeightInput, 10) : undefined;

  return (
    <>
      <h1>Popover maxHeight test</h1>

      <div style={{ marginBlockEnd: 20 }}>
        <label>
          Max height (px):{' '}
          <input
            type="number"
            value={maxHeightInput}
            onChange={event => {
              setMaxHeightInput(event.target.value);
              setUrlParams({ maxHeight: event.target.value });
            }}
            style={{ width: 80 }}
          />
        </label>
        <span style={{ marginInlineStart: 20 }}>
          <label>
            Render with portal{' '}
            <input
              type="checkbox"
              checked={urlParams.renderWithPortal || false}
              onChange={event => setUrlParams({ renderWithPortal: event.target.checked })}
            />
          </label>
        </span>
      </div>

      <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
        <div>
          <h2>With maxHeight={maxHeight}</h2>
          <Popover
            size="medium"
            header="Constrained height"
            content={<div>{longContent}</div>}
            dismissAriaLabel="Close"
            renderWithPortal={urlParams.renderWithPortal}
            maxHeight={maxHeight}
          >
            Click me (constrained)
          </Popover>
        </div>

        <div>
          <h2>Without maxHeight (default)</h2>
          <Popover
            size="medium"
            header="Default height"
            content={<div>{longContent}</div>}
            dismissAriaLabel="Close"
            renderWithPortal={urlParams.renderWithPortal}
          >
            Click me (default)
          </Popover>
        </div>

        <div>
          <h2>Short content with maxHeight</h2>
          <Popover
            size="medium"
            header="Short content"
            content={<div>This is short content that fits within the maxHeight.</div>}
            dismissAriaLabel="Close"
            renderWithPortal={urlParams.renderWithPortal}
            maxHeight={maxHeight}
          >
            Click me (short content)
          </Popover>
        </div>
      </div>

      <div style={{ marginBlockStart: 40 }}>
        <h2>Different positions with maxHeight={maxHeight}</h2>
        <div
          style={{
            display: 'flex',
            gap: 40,
            flexWrap: 'wrap',
            marginBlockStart: 20,
            justifyContent: 'center',
            padding: '100px 200px',
          }}
        >
          {(['top', 'bottom', 'left', 'right'] as const).map(position => (
            <Popover
              key={position}
              position={position}
              size="medium"
              header={`Position: ${position}`}
              content={<div>{longContent}</div>}
              dismissAriaLabel="Close"
              renderWithPortal={urlParams.renderWithPortal}
              maxHeight={maxHeight}
            >
              {position}
            </Popover>
          ))}
        </div>
      </div>
    </>
  );
}
