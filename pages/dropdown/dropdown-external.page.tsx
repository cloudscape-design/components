// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Dropdown from '~components/dropdown';
import SpaceBetween from '~components/space-between';

import styles from './styles.scss';

export default function DropdownExternalPage() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);
  const [open6, setOpen6] = useState(false);
  const [open9, setOpen9] = useState(false);
  const [open10, setOpen10] = useState(false);
  const [open12, setOpen12] = useState(false);

  const sampleContent = (
    <ul className={styles['list-container']}>
      {[...Array(8)].map((_, i) => (
        <li key={i}>
          <a href="#" onClick={e => e.preventDefault()}>
            Item {i + 1}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dropdown External API Demo</h1>
      <p>This page demonstrates the new public API for the Dropdown component.</p>

      <SpaceBetween size="xxl">
        {/* Width Constraints */}
        <section>
          <h2>Width Constraints</h2>
          <SpaceBetween size="m" direction="horizontal">
            <Box>
              <h3>minWidth: trigger (default)</h3>
              <div style={{ display: 'inline-block' }}>
                <Dropdown
                  role="dialog"
                  ariaLabel="Width constraint information"
                  trigger={<Button onClick={() => setOpen1(!open1)}>Short</Button>}
                  open={open1}
                  onDismiss={() => setOpen1(false)}
                  content={
                    <div style={{ padding: '12px' }}>
                      This dropdown is at least as wide as the trigger button, but can grow wider if content needs it.
                      Default maxWidth is 265px.
                    </div>
                  }
                />
              </div>
            </Box>

            <Box>
              <h3>minWidth: 300</h3>
              <div style={{ display: 'inline-block' }}>
                <Dropdown
                  role="dialog"
                  ariaLabel="Minimum width example"
                  trigger={<Button onClick={() => setOpen2(!open2)}>Trigger</Button>}
                  open={open2}
                  onDismiss={() => setOpen2(false)}
                  minWidth={300}
                  content={<div style={{ padding: '12px' }}>minWidth is 300.</div>}
                />
              </div>
            </Box>

            <Box>
              <h3>maxWidth: trigger</h3>
              <div style={{ display: 'inline-block' }}>
                <Dropdown
                  role="dialog"
                  ariaLabel="Maximum width example"
                  trigger={<Button onClick={() => setOpen3(!open3)}>This is a long trigger</Button>}
                  open={open3}
                  onDismiss={() => setOpen3(false)}
                  maxWidth="trigger"
                  content={
                    <div style={{ padding: '12px' }}>
                      This content cannot exceed the trigger width, so it will wrap if needed.
                    </div>
                  }
                />
              </div>
            </Box>

            <Box>
              <h3>minWidth: 200, maxWidth: 400</h3>
              <div style={{ display: 'inline-block' }}>
                <Dropdown
                  role="dialog"
                  ariaLabel="Combined width constraints example"
                  trigger={<Button onClick={() => setOpen4(!open4)}>Combined</Button>}
                  open={open4}
                  onDismiss={() => setOpen4(false)}
                  minWidth={200}
                  maxWidth={400}
                  content={<div style={{ padding: '12px' }}>Width constrained between 200px and 400px.</div>}
                />
              </div>
            </Box>
          </SpaceBetween>
        </section>

        {/* Alignment */}
        <section>
          <h2>Alignment Options</h2>
          <p style={{ marginBottom: '16px' }}>Dropdowns centered to show alignment behavior relative to trigger</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '20px 0' }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ marginBottom: '12px' }}>alignment: start (default)</h3>
              <div style={{ display: 'inline-block' }}>
                <Dropdown
                  role="menu"
                  ariaLabel="Start aligned menu"
                  trigger={<Button onClick={() => setOpen5(!open5)}>Start Aligned</Button>}
                  open={open5}
                  onDismiss={() => setOpen5(false)}
                  preferredAlignment="start"
                  content={sampleContent}
                  minWidth={300}
                />
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <h3 style={{ marginBottom: '12px' }}>alignment: center</h3>
              <div style={{ display: 'inline-block' }}>
                <Dropdown
                  role="menu"
                  ariaLabel="Center aligned menu"
                  trigger={<Button onClick={() => setOpen6(!open6)}>Center Aligned</Button>}
                  open={open6}
                  onDismiss={() => setOpen6(false)}
                  preferredAlignment="center"
                  content={sampleContent}
                  minWidth={300}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Header and Footer */}
        <section>
          <h2>Header and Footer</h2>
          <Box>
            <h3>Dropdown with fixed header and footer (scrollable content)</h3>
            <div style={{ display: 'inline-block' }}>
              <Dropdown
                role="listbox"
                ariaLabel="Scrollable list with header and footer"
                trigger={<Button onClick={() => setOpen9(!open9)}>With Header & Footer</Button>}
                open={open9}
                onDismiss={() => setOpen9(false)}
                header={
                  <div style={{ padding: '12px', borderBottom: '1px solid #ccc', fontWeight: 'bold' }}>
                    Fixed Header - Always Visible
                  </div>
                }
                content={
                  <ul className={styles['list-container']}>
                    {[...Array(50)].map((_, i) => (
                      <li key={i}>Item {i + 1}</li>
                    ))}
                  </ul>
                }
                footer={
                  <div style={{ padding: '12px', borderTop: '1px solid #ccc', color: '#666' }}>
                    Footer stays fixed at bottom while content scrolls
                  </div>
                }
              />
            </div>
          </Box>
        </section>

        {/* Advanced Options */}
        <section>
          <h2>Advanced Options</h2>
          <SpaceBetween size="m" direction="horizontal">
            <Box>
              <h3>expandToViewport: true</h3>
              <p style={{ fontSize: '12px', color: '#666' }}>
                Uses portal rendering to break out of scrollable containers
              </p>
              <div style={{ border: '1px solid #ccc', padding: '12px', maxHeight: '200px', overflow: 'auto' }}>
                <div style={{ height: '100px' }}>Scroll down...</div>
                <Dropdown
                  role="menu"
                  ariaLabel="Viewport expanded menu"
                  trigger={<Button onClick={() => setOpen10(!open10)}>Expands to Viewport</Button>}
                  open={open10}
                  onDismiss={() => setOpen10(false)}
                  expandToViewport={true}
                  content={sampleContent}
                  maxWidth={'trigger'}
                />
                <div style={{ height: '100px' }}>...and scroll up</div>
              </div>
            </Box>

            <Box>
              <h3>Auto-close on blur</h3>
              <p style={{ fontSize: '12px', color: '#666' }}>Closes automatically when focus moves outside</p>
              <div>
                <Dropdown
                  role="dialog"
                  ariaLabel="Auto-close form dialog"
                  trigger={<Button onClick={() => setOpen12(!open12)}>Auto-close Dropdown</Button>}
                  open={open12}
                  onDismiss={() => setOpen12(false)}
                  onFocusOut={() => setOpen12(false)}
                  content={
                    <div style={{ padding: '12px' }}>
                      <SpaceBetween size="s">
                        <input type="text" placeholder="Tab out to close" />
                        <Button>Or tab from here</Button>
                      </SpaceBetween>
                    </div>
                  }
                />
                <span style={{ marginLeft: '12px', display: 'inline-block' }}>
                  <Button>Next focusable element</Button>
                </span>
              </div>
            </Box>
          </SpaceBetween>
        </section>
      </SpaceBetween>

      <div style={{ height: '400px' }} />
    </div>
  );
}
