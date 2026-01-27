// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Dropdown from '~components/dropdown';
import OptionsList from '~components/internal/components/options-list';
import SpaceBetween from '~components/space-between';

export default function DropdownExposedScenario() {
  const [sizingFitOpen, setSizingFitOpen] = useState(false);
  const [sizingMatchOpen, setSizingMatchOpen] = useState(false);
  const [sizingMinOpen, setSizingMinOpen] = useState(false);
  const [sizingFullOpen, setSizingFullOpen] = useState(false);

  const [alignStartOpen, setAlignStartOpen] = useState(false);
  const [alignCenterOpen, setAlignCenterOpen] = useState(false);
  const [alignEndOpen, setAlignEndOpen] = useState(false);

  const [heightFitOpen, setHeightFitOpen] = useState(false);
  const [heightFullOpen, setHeightFullOpen] = useState(false);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleContextMenu = (event: React.MouseEvent, item: string) => {
    event.preventDefault();
    setSelectedItem(item);
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setMenuOpen(true);
  };

  return (
    <Box padding="l">
      <h1>Exposed Dropdown Component - New Interface</h1>
      <SpaceBetween size="xxl">
        {/* Section 1: Sizing Strategies */}
        <div>
          <h2>1. Sizing Strategies</h2>
          <p>Control how the dropdown sizes itself relative to its trigger and content.</p>
          <SpaceBetween size="l" direction="horizontal">
            {/* fit-content */}
            <div>
              <h3>sizing=fit-content</h3>
              <p style={{ fontSize: '14px', color: '#666' }}>Dropdown sizes to its content width</p>
              <Dropdown
                trigger={<Button onClick={() => setSizingFitOpen(!sizingFitOpen)}>Trigger</Button>}
                content={
                  <div style={{ minWidth: '300px' }}>
                    <Box padding="m">
                      <SpaceBetween size="s">
                        <div>This dropdown sizes to its content width.</div>
                        <div>It ignores the trigger width completely.</div>
                        <Button onClick={() => setSizingFitOpen(false)}>Close</Button>
                      </SpaceBetween>
                    </Box>
                  </div>
                }
                open={sizingFitOpen}
                onDropdownClose={() => setSizingFitOpen(false)}
                sizing="fit-content"
              />
            </div>

            {/* match-trigger */}
            <div>
              <h3>sizing=match-trigger</h3>
              <p style={{ fontSize: '14px', color: '#666' }}>Matches trigger width exactly</p>
              <Dropdown
                trigger={<Button onClick={() => setSizingMatchOpen(!sizingMatchOpen)}>Wide Trigger Button</Button>}
                content={
                  <Box padding="m">
                    <SpaceBetween size="s">
                      <div>Exactly matches trigger width.</div>
                      <div>Cannot grow or shrink.</div>
                      <Button onClick={() => setSizingMatchOpen(false)}>Close</Button>
                    </SpaceBetween>
                  </Box>
                }
                open={sizingMatchOpen}
                onDropdownClose={() => setSizingMatchOpen(false)}
                sizing="match-trigger"
              />
            </div>

            {/* min-trigger-width (default) */}
            <div>
              <h3>sizing=min-trigger-width</h3>
              <p style={{ fontSize: '14px', color: '#666' }}>At least as wide as trigger, can grow (default)</p>
              <Dropdown
                trigger={<Button onClick={() => setSizingMinOpen(!sizingMinOpen)}>Trigger</Button>}
                content={
                  <Box padding="m">
                    <SpaceBetween size="s">
                      <div>At least as wide as the trigger button.</div>
                      <div>But can grow wider to fit longer content if needed.</div>
                      <Button onClick={() => setSizingMinOpen(false)}>Close</Button>
                    </SpaceBetween>
                  </Box>
                }
                open={sizingMinOpen}
                onDropdownClose={() => setSizingMinOpen(false)}
                sizing="min-trigger-width"
              />
            </div>

            {/* full-width */}
            <div>
              <h3>sizing=full-width</h3>
              <p style={{ fontSize: '14px', color: '#666' }}>Takes full available width</p>
              <Dropdown
                trigger={<Button onClick={() => setSizingFullOpen(!sizingFullOpen)}>Trigger</Button>}
                content={
                  <Box padding="m">
                    <SpaceBetween size="s">
                      <div>This dropdown stretches to fill the available width.</div>
                      <div>Useful for select-like components.</div>
                      <Button onClick={() => setSizingFullOpen(false)}>Close</Button>
                    </SpaceBetween>
                  </Box>
                }
                open={sizingFullOpen}
                onDropdownClose={() => setSizingFullOpen(false)}
                sizing="full-width"
              />
            </div>
          </SpaceBetween>
        </div>

        {/* Section 2: Alignment */}
        <div>
          <h2>2. Alignment</h2>
          <p>Control how the dropdown aligns relative to its trigger.</p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              maxWidth: '900px',
              padding: '20px',
            }}
          >
            {/* start */}
            <div>
              <h3>alignment=start</h3>
              <p style={{ fontSize: '14px', color: '#666' }}>Aligns to left edge (default)</p>
              <Dropdown
                trigger={<Button onClick={() => setAlignStartOpen(!alignStartOpen)}>Start</Button>}
                content={
                  <Box padding="m">
                    <div>Aligned to left edge</div>
                    <Button onClick={() => setAlignStartOpen(false)}>Close</Button>
                  </Box>
                }
                open={alignStartOpen}
                onDropdownClose={() => setAlignStartOpen(false)}
                alignment="start"
                sizing="fit-content"
              />
            </div>

            {/* center */}
            <div>
              <h3>alignment=center</h3>
              <p style={{ fontSize: '14px', color: '#666' }}>Centers on trigger</p>
              <Dropdown
                trigger={<Button onClick={() => setAlignCenterOpen(!alignCenterOpen)}>Center</Button>}
                content={
                  <Box padding="m">
                    <div>Centered on trigger button</div>
                    <Button onClick={() => setAlignCenterOpen(false)}>Close</Button>
                  </Box>
                }
                open={alignCenterOpen}
                onDropdownClose={() => setAlignCenterOpen(false)}
                alignment="center"
                sizing="fit-content"
              />
            </div>

            {/* end */}
            <div>
              <h3>alignment=end</h3>
              <p style={{ fontSize: '14px', color: '#666' }}>Aligns to right edge</p>
              <Dropdown
                trigger={<Button onClick={() => setAlignEndOpen(!alignEndOpen)}>End</Button>}
                content={
                  <Box padding="m">
                    <div>Aligned to right edge</div>
                    <Button onClick={() => setAlignEndOpen(false)}>Close</Button>
                  </Box>
                }
                open={alignEndOpen}
                onDropdownClose={() => setAlignEndOpen(false)}
                alignment="end"
                sizing="fit-content"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Height */}
        <div>
          <h2>3. Height Strategies</h2>
          <p>Control how the dropdown handles height.</p>
          <SpaceBetween size="l" direction="horizontal">
            {/* fit-content */}
            <div>
              <h3>height=fit-content</h3>
              <p style={{ fontSize: '14px', color: '#666' }}>Crops content with scroll affordance (default)</p>
              <Dropdown
                trigger={<Button onClick={() => setHeightFitOpen(!heightFitOpen)}>Fit Content</Button>}
                header={
                  <div style={{ padding: '12px 12px 8px' }}>
                    <div style={{ marginBottom: '4px' }}>
                      <strong>Scrollable List</strong>
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>Content crops with scroll affordance</div>
                  </div>
                }
                content={
                  <OptionsList open={heightFitOpen} statusType="finished" position="static">
                    {Array.from({ length: 30 }, (_, i) => (
                      <div
                        key={i}
                        role="option"
                        style={{
                          padding: '8px 12px',
                          borderBottom: '1px solid #eee',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.backgroundColor = '#f5f5f5';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        Item {i + 1}
                      </div>
                    ))}
                  </OptionsList>
                }
                footer={
                  <div style={{ padding: '12px', borderTop: '2px solid #ddd' }}>
                    <Button fullWidth={true} onClick={() => setHeightFitOpen(false)}>
                      Close
                    </Button>
                  </div>
                }
                open={heightFitOpen}
                onDropdownClose={() => setHeightFitOpen(false)}
                height="fit-content"
                sizing="fit-content"
              />
            </div>

            {/* full-height */}
            <div>
              <h3>height=full-height</h3>
              <p style={{ fontSize: '14px', color: '#666' }}>Takes full available height (for calendars)</p>
              <Dropdown
                trigger={<Button onClick={() => setHeightFullOpen(!heightFullOpen)}>Full Height</Button>}
                content={
                  <div style={{ height: '100%', minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                      <div style={{ marginBottom: '4px' }}>
                        <strong>Fixed Layout Example</strong>
                      </div>
                      <div style={{ fontSize: '14px', color: '#666' }}>Uses full available height</div>
                    </div>
                    <div
                      style={{
                        flex: '1',
                        border: '2px dashed #ccc',
                        margin: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        textAlign: 'center',
                        overflow: 'hidden',
                      }}
                    >
                      <div>
                        <div style={{ marginBottom: '8px', fontSize: '32px' }}>📅</div>
                        <div>Calendar widget would go here</div>
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>(Fixed-size, no scroll)</div>
                      </div>
                    </div>
                    <div style={{ padding: '12px', borderTop: '1px solid #eee' }}>
                      <Button fullWidth={true} onClick={() => setHeightFullOpen(false)}>
                        Close
                      </Button>
                    </div>
                  </div>
                }
                open={heightFullOpen}
                onDropdownClose={() => setHeightFullOpen(false)}
                height="fit-content"
                sizing="fit-content"
              />
            </div>
          </SpaceBetween>
        </div>

        {/* Section 4: Real-World Examples */}
        <div>
          <h2>4. Real-World Examples</h2>

          {/* Settings Menu */}
          <Box margin={{ bottom: 'l' }}>
            <h3>User Settings Dropdown (alignment=center, sizing=fit-content)</h3>
            <Dropdown
              loopFocus={true}
              trigger={<Button variant="icon" iconName="settings" onClick={() => setSettingsOpen(!settingsOpen)} />}
              content={
                <div
                  style={{
                    backgroundColor: '#1d2634',
                    color: 'white',
                    minWidth: '400px',
                    maxWidth: '400px',
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
                                defaultChecked={true}
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
              open={settingsOpen}
              onDropdownClose={() => setSettingsOpen(false)}
              sizing="fit-content"
            />
          </Box>

          {/* Context Menu */}
          <Box>
            <h3>Context Menu (Right-Click) - (sizing=fit-content)</h3>
            <Box padding="m" variant="awsui-key-label">
              <SpaceBetween size="m">
                {['Document 1', 'Document 2', 'Document 3', 'Document 4'].map(item => (
                  <div
                    key={item}
                    onContextMenu={e => handleContextMenu(e, item)}
                    style={{
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'context-menu',
                      backgroundColor: selectedItem === item && menuOpen ? '#f0f0f0' : 'white',
                    }}
                  >
                    {item}
                  </div>
                ))}
              </SpaceBetween>
            </Box>

            {/* Context Menu Dropdown - positioned at cursor */}
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
                            setMenuOpen(false);
                            setSelectedItem(null);
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
                            setMenuOpen(false);
                            setSelectedItem(null);
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
                  open={menuOpen}
                  onDropdownClose={() => {
                    setMenuOpen(false);
                    setSelectedItem(null);
                  }}
                  sizing="fit-content"
                />
              </div>
            )}
          </Box>
        </div>

        {/* Section 5: Other Props */}
        <div>
          <h2>5. Other Props</h2>
          <SpaceBetween size="m">
            <div>
              <strong>stretchTrigger</strong>: Makes the trigger stretch to container height (useful for navigation)
            </div>
            <div>
              <strong>expandToViewport</strong>: Uses portals to break out of scrollable containers
            </div>
            <div>
              <strong>loopFocus</strong>: Creates focus trap between trigger and dropdown (default: true when
              expandToViewport=true)
            </div>
            <div>
              <strong>header/footer</strong>: Optional fixed header and footer sections
            </div>
            <div>
              <strong>contentId, role, ariaLabelledby, ariaDescribedby</strong>: Accessibility props
            </div>
          </SpaceBetween>
        </div>
      </SpaceBetween>

      <div style={{ height: '400px' }} />
    </Box>
  );
}
