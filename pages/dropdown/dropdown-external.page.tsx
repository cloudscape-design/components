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
  const [open7, setOpen7] = useState(false);
  const [open10, setOpen10] = useState(false);
  const [open11, setOpen11] = useState(false);
  const [open12, setOpen12] = useState(false);
  const [open13, setOpen13] = useState(false);
  const [open14, setOpen14] = useState(false);
  const [focusEvents, setFocusEvents] = useState<string[]>([]);
  const [closeCount, setCloseCount] = useState(0);

  const addFocusEvent = (event: string) => {
    setFocusEvents(prev => [...prev.slice(-4), event]);
  };

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
    <article>
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
                  trigger={<Button onClick={() => setOpen1(!open1)}>Short</Button>}
                  open={open1}
                  onClose={() => setOpen1(false)}
                  content={
                    <div style={{ padding: '12px' }}>
                      This dropdown is at least as wide as the trigger button, but can grow wider if content needs it.
                    </div>
                  }
                />
              </div>
            </Box>

            <Box>
              <h3>minWidth: 300</h3>
              <div style={{ display: 'inline-block' }}>
                <Dropdown
                  trigger={<Button onClick={() => setOpen2(!open2)}>Trigger</Button>}
                  open={open2}
                  onClose={() => setOpen2(false)}
                  minWidth={300}
                  content={<div style={{ padding: '12px' }}>Minimum 300px width regardless of trigger size.</div>}
                />
              </div>
            </Box>

            <Box>
              <h3>maxWidth: trigger</h3>
              <div style={{ display: 'inline-block' }}>
                <Dropdown
                  trigger={<Button onClick={() => setOpen3(!open3)}>This is a long trigger</Button>}
                  open={open3}
                  onClose={() => setOpen3(false)}
                  maxWidth="trigger"
                  content={
                    <div style={{ padding: '12px' }}>
                      This content cannot exceed the trigger width, so it will wrap if needed. Very long text will wrap
                      to multiple lines.
                    </div>
                  }
                />
              </div>
            </Box>

            <Box>
              <h3>minWidth: 200, maxWidth: 400</h3>
              <div style={{ display: 'inline-block' }}>
                <Dropdown
                  trigger={<Button onClick={() => setOpen4(!open4)}>Combined</Button>}
                  open={open4}
                  onClose={() => setOpen4(false)}
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
                  trigger={<Button onClick={() => setOpen5(!open5)}>Start Aligned</Button>}
                  open={open5}
                  onClose={() => setOpen5(false)}
                  alignment="start"
                  content={sampleContent}
                  minWidth={300}
                />
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <h3 style={{ marginBottom: '12px' }}>alignment: center</h3>
              <div style={{ display: 'inline-block' }}>
                <Dropdown
                  trigger={<Button onClick={() => setOpen6(!open6)}>Center Aligned</Button>}
                  open={open6}
                  onClose={() => setOpen6(false)}
                  alignment="center"
                  content={sampleContent}
                  minWidth={300}
                />
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <h3 style={{ marginBottom: '12px' }}>alignment: end</h3>
              <div style={{ display: 'inline-block' }}>
                <Dropdown
                  trigger={<Button onClick={() => setOpen7(!open7)}>End Aligned</Button>}
                  open={open7}
                  onClose={() => setOpen7(false)}
                  alignment="end"
                  content={sampleContent}
                  minWidth={200}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Event Handlers */}
        <section>
          <h2>Event Handlers</h2>
          <Box>
            <h3>onClose, onFocusIn, onFocusOut</h3>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ display: 'inline-block' }}>
                <Dropdown
                  trigger={<Button onClick={() => setOpen10(!open10)}>Dropdown with Events</Button>}
                  open={open10}
                  onClose={() => {
                    setOpen10(false);
                    setCloseCount(prev => prev + 1);
                  }}
                  onFocusIn={event => {
                    addFocusEvent(`Focus IN: ${(event.detail.target as HTMLElement).tagName}`);
                  }}
                  onFocusOut={event => {
                    addFocusEvent(`Focus OUT: ${(event.detail.target as HTMLElement).tagName}`);
                  }}
                  content={
                    <div style={{ padding: '12px' }}>
                      <SpaceBetween size="s">
                        <input type="text" placeholder="Focusable input" />
                        <Button>Focusable button</Button>
                        <a href="#" onClick={e => e.preventDefault()}>
                          Focusable link
                        </a>
                      </SpaceBetween>
                    </div>
                  }
                />
              </div>
              <Box variant="awsui-key-label">
                <div>
                  <strong>Close count:</strong> {closeCount}
                </div>
                <div style={{ marginTop: '8px' }}>
                  <strong>Recent focus events:</strong>
                  <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                    {focusEvents.map((event, i) => (
                      <li key={i}>{event}</li>
                    ))}
                  </ul>
                </div>
              </Box>
            </div>
          </Box>
        </section>

        {/* Header and Footer */}
        <section>
          <h2>Header and Footer</h2>
          <Box>
            <h3>Dropdown with fixed header and footer (scrollable content)</h3>
            <div style={{ display: 'inline-block' }}>
              <Dropdown
                trigger={<Button onClick={() => setOpen11(!open11)}>With Header & Footer</Button>}
                open={open11}
                onClose={() => setOpen11(false)}
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
                  trigger={<Button onClick={() => setOpen12(!open12)}>Expands to Viewport</Button>}
                  open={open12}
                  onClose={() => setOpen12(false)}
                  expandToViewport={true}
                  content={sampleContent}
                  maxWidth={'trigger'}
                />
                <div style={{ height: '100px' }}>...and scroll up</div>
              </div>
            </Box>

            <Box>
              <h3>loopFocus: true</h3>
              <p style={{ fontSize: '12px', color: '#666' }}>Focus loops between trigger and dropdown content</p>
              <Dropdown
                trigger={<Button onClick={() => setOpen13(!open13)}>Focus Loop Enabled</Button>}
                open={open13}
                onClose={() => setOpen13(false)}
                loopFocus={true}
                content={
                  <div style={{ padding: '12px' }}>
                    <SpaceBetween size="s">
                      <input type="text" placeholder="First input" />
                      <input type="text" placeholder="Second input" />
                      <Button>Focus will loop back to trigger after this</Button>
                    </SpaceBetween>
                  </div>
                }
              />
            </Box>

            <Box>
              <h3>Auto-close on blur</h3>
              <p style={{ fontSize: '12px', color: '#666' }}>Closes automatically when focus moves outside</p>
              <div>
                <Dropdown
                  trigger={<Button onClick={() => setOpen14(!open14)}>Auto-close Dropdown</Button>}
                  open={open14}
                  onClose={() => setOpen14(false)}
                  onFocusOut={() => setOpen14(false)}
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
    </article>
  );
}
