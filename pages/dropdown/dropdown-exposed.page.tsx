// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Dropdown from '~components/dropdown';
import SpaceBetween from '~components/space-between';

export default function DropdownExposedScenario() {
  const [leftOpen, setLeftOpen] = useState(false);
  const [centerOpen, setCenterOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [aiModelOpen, setAiModelOpen] = useState(false);
  const [triggerMatchOpen, setTriggerMatchOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('GPT-4');
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleContextMenu = (event: React.MouseEvent, item: string) => {
    event.preventDefault();
    setSelectedItem(item);
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setContextMenuOpen(true);
  };

  const items = ['Document 1', 'Document 2', 'Document 3', 'Document 4'];

  return (
    <Box padding="l">
      <h1>Exposed Dropdown Component Examples</h1>
      <SpaceBetween size="xxl">
        {/* Example 1: Simple Dropdown */}
        <div>
          <h2>1. Simple Dropdown Use-Case</h2>
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0 20px' }}
          >
            {/* Left Dropdown */}
            <Dropdown
              trigger={<Button onClick={() => setLeftOpen(!leftOpen)}>Left Dropdown</Button>}
              content={
                <Box padding="m">
                  <SpaceBetween size="s">
                    <div>Welcome to the dropdown!</div>
                    <div>This is simple content inside the dropdown bla bla bkla bl balb lab lab alb alla b</div>
                    <Button onClick={() => setLeftOpen(false)}>Close</Button>
                  </SpaceBetween>
                </Box>
              }
              open={leftOpen}
              onDropdownClose={() => setLeftOpen(false)}
              stretchToTriggerWidth={true}
            />

            {/* Center Dropdown */}
            <div style={{ position: 'relative' }}>
              <Dropdown
                trigger={<Button onClick={() => setCenterOpen(!centerOpen)}>Center Dropdown Test Bla</Button>}
                content={
                  <Box padding="m">
                    <SpaceBetween size="s">
                      <div>Welcome to the dropdown!</div>
                      <div>This is simple content inside the dropdown bla bla bkla bl balb lab lab alb alla b</div>
                      <Button onClick={() => setCenterOpen(false)}>Close</Button>
                    </SpaceBetween>
                  </Box>
                }
                open={centerOpen}
                onDropdownClose={() => setCenterOpen(false)}
                onBlur={() => setCenterOpen(false)}
                stretchToTriggerWidth={false}
                stretchBeyondTriggerWidth={true}
                preferCenter={true}

                // stretchWidth={true}
                // stretchHeight={true}
                // stretchToTriggerWidth={true}
                // stretchBeyondTriggerWidth={false}
                // preferCenter={false}
              />
            </div>

            {/* Right Dropdown */}
            <div style={{ position: 'relative' }}>
              <Dropdown
                trigger={<Button onClick={() => setRightOpen(!rightOpen)}>Right Dropdown</Button>}
                content={
                  <Box padding="m">
                    <SpaceBetween size="s">
                      <div>Welcome to the dropdown!</div>
                      <div>This is simple content inside the dropdown bla bla bkla bl balb lab lab alb alla b</div>
                      <Button onClick={() => setRightOpen(false)}>Close</Button>
                    </SpaceBetween>
                  </Box>
                }
                open={rightOpen}
                onDropdownClose={() => setRightOpen(false)}
                stretchToTriggerWidth={false}
                stretchBeyondTriggerWidth={true}
                preferCenter={true}
              />
            </div>
          </div>
        </div>

        {/* Example 2: User Settings Dropdown */}
        <Box>
          <h2>2. User Settings Dropdown Use-Case</h2>
          <Dropdown
            loopFocus={true}
            trigger={<Button variant="icon" iconName="settings" onClick={() => setAiModelOpen(!aiModelOpen)} />}
            stretchToTriggerWidth={false}
            content={
              <div
                style={{
                  backgroundColor: '#1d2634',
                  color: 'white',
                  minWidth: '400px',
                  padding: '24px',
                  borderRadius: '10px',
                }}
              >
                <SpaceBetween size="l">
                  <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '400' }}>Current user settings</h2>

                  <div style={{ borderTop: '1px solid #414d5c', paddingTop: '16px' }}>
                    <SpaceBetween size="m">
                      <div>
                        <div style={{ marginBottom: '8px', fontSize: '14px' }}>Language</div>
                        <div
                          style={{
                            backgroundColor: '#0d1925',
                            border: '1px solid #414d5c',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <span>Browser default</span>
                          <span style={{ color: '#0972d3' }}>▼</span>
                        </div>
                      </div>

                      <div>
                        <div style={{ marginBottom: '12px', fontSize: '14px' }}>
                          Visual mode - <span style={{ fontStyle: 'italic' }}>beta</span>
                        </div>
                        <SpaceBetween size="s">
                          <label
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer',
                            }}
                          >
                            <input
                              type="radio"
                              name="visualMode"
                              value="browser"
                              checked={selectedModel === 'browser'}
                              onChange={() => setSelectedModel('browser')}
                              style={{ width: '16px', height: '16px' }}
                            />
                            <span>Browser default</span>
                          </label>
                          <label
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer',
                            }}
                          >
                            <input
                              type="radio"
                              name="visualMode"
                              value="light"
                              checked={selectedModel === 'light'}
                              onChange={() => setSelectedModel('light')}
                              style={{ width: '16px', height: '16px', accentColor: '#0972d3' }}
                            />
                            <span>Light</span>
                          </label>
                          <label
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer',
                            }}
                          >
                            <input
                              type="radio"
                              name="visualMode"
                              value="dark"
                              checked={selectedModel === 'dark'}
                              onChange={() => setSelectedModel('dark')}
                              style={{ width: '16px', height: '16px' }}
                            />
                            <span>Dark</span>
                          </label>
                        </SpaceBetween>
                      </div>
                    </SpaceBetween>
                  </div>
                </SpaceBetween>
              </div>
            }
            open={aiModelOpen}
            onDropdownClose={() => setAiModelOpen(false)}
          />
        </Box>

        {/* Example 3: Trigger-Match Width */}
        <Box>
          <h2>3. Trigger-Match Width Use-Case</h2>
          <div style={{ width: '220px' }}>
            <Dropdown
              trigger={
                <Button onClick={() => setTriggerMatchOpen(!triggerMatchOpen)}>Trigger Match Width Button</Button>
              }
              content={
                <Box padding="m">
                  <div>This width to be be exactly as above.</div>
                  <div>No wider, no narrower.</div>
                </Box>
              }
              open={triggerMatchOpen}
              onDropdownClose={() => setTriggerMatchOpen(false)}
              stretchBeyondTriggerWidth={false}
            />
          </div>
        </Box>

        {/* Example 4: Context Menu (Right-Click) */}
        <Box>
          <h2>4. Context Menu Use-Case (Right-Click)</h2>
          <Box padding="m" variant="awsui-key-label">
            <SpaceBetween size="m">
              {items.map(item => (
                <div
                  key={item}
                  onContextMenu={e => handleContextMenu(e, item)}
                  style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'context-menu',
                    backgroundColor: selectedItem === item && contextMenuOpen ? '#f0f0f0' : 'white',
                  }}
                >
                  {item}
                </div>
              ))}
            </SpaceBetween>
          </Box>

          {/* Context Menu Dropdown */}
          {selectedItem && (
            <div
              style={{
                position: 'fixed',
                left: contextMenuPosition.x,
                top: contextMenuPosition.y,
                zIndex: 1000,
              }}
            >
              <Dropdown
                trigger={<div style={{ display: 'none' }} />}
                content={
                  <div>
                    <SpaceBetween size="xxxs">
                      <div
                        style={{
                          padding: '8px 16px 4px 16px',
                          cursor: 'pointer',
                          minWidth: '150px',
                        }}
                        onClick={() => {
                          setContextMenuOpen(false);
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.backgroundColor = '#f5f5f5';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        Edit {selectedItem}
                      </div>
                      <div
                        style={{
                          padding: '4px 16px 8px 16px',
                          cursor: 'pointer',
                          color: '#d13212',
                        }}
                        onClick={() => {
                          setContextMenuOpen(false);
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.backgroundColor = '#f5f5f5';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        Delete {selectedItem}
                      </div>
                    </SpaceBetween>
                  </div>
                }
                open={contextMenuOpen}
                onDropdownClose={() => {
                  setContextMenuOpen(false);
                  setSelectedItem(null);
                }}
                stretchWidth={false}
              />
            </div>
          )}
        </Box>
      </SpaceBetween>

      <div style={{ height: '400px' }} />
    </Box>
  );
}
