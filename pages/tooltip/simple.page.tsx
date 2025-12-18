// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import Button from '~components/button';
import SegmentedControl from '~components/segmented-control';
import SpaceBetween from '~components/space-between';
import Tooltip from '~components/tooltip';

import ScreenshotArea from '../utils/screenshot-area';

export default function TooltipSimple() {
  // Interactive Position Control
  const [showInteractive, setShowInteractive] = useState(false);
  const [interactivePosition, setInteractivePosition] = useState<'top' | 'right' | 'bottom' | 'left'>('top');
  const interactiveRef = useRef<HTMLDivElement>(null);

  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  // Common use cases
  const [showIconEdit, setShowIconEdit] = useState(false);
  const [showIconDelete, setShowIconDelete] = useState(false);
  const [showIconSettings, setShowIconSettings] = useState(false);
  const [showDisabled, setShowDisabled] = useState(false);
  const [showTruncated, setShowTruncated] = useState(false);

  const iconEditRef = useRef<HTMLDivElement>(null);
  const iconDeleteRef = useRef<HTMLDivElement>(null);
  const iconSettingsRef = useRef<HTMLDivElement>(null);
  const disabledRef = useRef<HTMLDivElement>(null);
  const truncatedRef = useRef<HTMLDivElement>(null);

  // Interactive content
  const [showLink, setShowLink] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const linkRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  // Password input
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  return (
    <article>
      <h1>Tooltip</h1>

      <h2>Interactive Position Control</h2>
      <ScreenshotArea>
        <SpaceBetween direction="horizontal" size="l" alignItems="center">
          <SegmentedControl
            selectedId={interactivePosition}
            onChange={({ detail }) => setInteractivePosition(detail.selectedId as 'top' | 'right' | 'bottom' | 'left')}
            options={[
              { id: 'top', text: 'Top' },
              { id: 'right', text: 'Right' },
              { id: 'bottom', text: 'Bottom' },
              { id: 'left', text: 'Left' },
            ]}
          />
          <div
            ref={interactiveRef}
            onMouseEnter={() => setShowInteractive(true)}
            onMouseLeave={() => setShowInteractive(false)}
            style={{ display: 'inline-block' }}
          >
            <Button
              variant="primary"
              nativeButtonAttributes={{
                onFocus: () => setShowInteractive(true),
                onBlur: () => setShowInteractive(false),
              }}
            >
              Hover
            </Button>
            {showInteractive && (
              <Tooltip
                content={`Tooltip positioned on ${interactivePosition}`}
                getTrack={() => interactiveRef.current}
                position={interactivePosition}
                onEscape={() => setShowInteractive(false)}
                trackKey={`position-${interactivePosition}`}
              />
            )}
          </div>
        </SpaceBetween>
      </ScreenshotArea>

      <h2>Content Length Variations</h2>
      <ScreenshotArea disableAnimations={true}>
        <SpaceBetween direction="horizontal" size="l">
          <section id="tooltip-top">
            <div
              ref={topRef}
              onMouseEnter={() => setShowTop(true)}
              onMouseLeave={() => setShowTop(false)}
              style={{ display: 'inline-block' }}
            >
              <Button
                variant="primary"
                nativeButtonAttributes={{
                  onFocus: () => setShowTop(true),
                  onBlur: () => setShowTop(false),
                }}
              >
                Short
              </Button>
              {showTop && (
                <Tooltip
                  content="Short"
                  getTrack={() => topRef.current}
                  position="top"
                  onEscape={() => setShowTop(false)}
                  trackKey="top"
                />
              )}
            </div>
          </section>

          <section id="tooltip-bottom">
            <div
              ref={bottomRef}
              onMouseEnter={() => setShowBottom(true)}
              onMouseLeave={() => setShowBottom(false)}
              style={{ display: 'inline-block' }}
            >
              <Button
                variant="primary"
                nativeButtonAttributes={{
                  onFocus: () => setShowBottom(true),
                  onBlur: () => setShowBottom(false),
                }}
              >
                Medium
              </Button>
              {showBottom && (
                <Tooltip
                  content="This is a medium length tooltip with more content"
                  getTrack={() => bottomRef.current}
                  position="bottom"
                  onEscape={() => setShowBottom(false)}
                  trackKey="bottom"
                />
              )}
            </div>
          </section>

          <section id="tooltip-left">
            <div
              ref={leftRef}
              onMouseEnter={() => setShowLeft(true)}
              onMouseLeave={() => setShowLeft(false)}
              style={{ display: 'inline-block' }}
            >
              <Button
                variant="primary"
                nativeButtonAttributes={{
                  onFocus: () => setShowLeft(true),
                  onBlur: () => setShowLeft(false),
                }}
              >
                Long
              </Button>
              {showLeft && (
                <Tooltip
                  content="This is a longer tooltip that contains more information and will likely wrap to multiple lines depending on the available space"
                  getTrack={() => leftRef.current}
                  position="left"
                  onEscape={() => setShowLeft(false)}
                  trackKey="left"
                />
              )}
            </div>
          </section>

          <section id="tooltip-right">
            <div
              ref={rightRef}
              onMouseEnter={() => setShowRight(true)}
              onMouseLeave={() => setShowRight(false)}
              style={{ display: 'inline-block' }}
            >
              <Button
                variant="primary"
                nativeButtonAttributes={{
                  onFocus: () => setShowRight(true),
                  onBlur: () => setShowRight(false),
                }}
              >
                Very Long
              </Button>
              {showRight && (
                <Tooltip
                  content="This is a very long tooltip with substantial content that demonstrates how the tooltip component handles longer text. It includes multiple sentences to show text wrapping behavior and ensure the tooltip remains readable with extended content. This helps test various edge cases related to tooltip sizing and positioning."
                  getTrack={() => rightRef.current}
                  position="right"
                  onEscape={() => setShowRight(false)}
                  trackKey="right"
                />
              )}
            </div>
          </section>
        </SpaceBetween>
      </ScreenshotArea>

      <ScreenshotArea disableAnimations={true}>
        <SpaceBetween size="l">
          {/* Icon-only buttons */}
          <section id="tooltip-icon-buttons">
            <h3>Icon-Only Buttons</h3>
            <SpaceBetween direction="horizontal" size="xs">
              <div
                ref={iconEditRef}
                onMouseEnter={() => setShowIconEdit(true)}
                onMouseLeave={() => setShowIconEdit(false)}
                style={{ display: 'inline-block' }}
              >
                <Button
                  variant="icon"
                  iconName="edit"
                  nativeButtonAttributes={{
                    onFocus: () => setShowIconEdit(true),
                    onBlur: () => setShowIconEdit(false),
                  }}
                />
                {showIconEdit && (
                  <Tooltip
                    content="Edit"
                    getTrack={() => iconEditRef.current}
                    position="top"
                    onEscape={() => setShowIconEdit(false)}
                    trackKey="icon-edit"
                  />
                )}
              </div>

              <div
                ref={iconDeleteRef}
                onMouseEnter={() => setShowIconDelete(true)}
                onMouseLeave={() => setShowIconDelete(false)}
                style={{ display: 'inline-block' }}
              >
                <Button
                  variant="icon"
                  iconName="remove"
                  nativeButtonAttributes={{
                    onFocus: () => setShowIconDelete(true),
                    onBlur: () => setShowIconDelete(false),
                  }}
                />
                {showIconDelete && (
                  <Tooltip
                    content="Delete"
                    getTrack={() => iconDeleteRef.current}
                    position="top"
                    onEscape={() => setShowIconDelete(false)}
                    trackKey="icon-delete"
                  />
                )}
              </div>

              <div
                ref={iconSettingsRef}
                onMouseEnter={() => setShowIconSettings(true)}
                onMouseLeave={() => setShowIconSettings(false)}
                style={{ display: 'inline-block' }}
              >
                <Button
                  variant="icon"
                  iconName="settings"
                  nativeButtonAttributes={{
                    onFocus: () => setShowIconSettings(true),
                    onBlur: () => setShowIconSettings(false),
                  }}
                />
                {showIconSettings && (
                  <Tooltip
                    content="Settings"
                    getTrack={() => iconSettingsRef.current}
                    position="top"
                    onEscape={() => setShowIconSettings(false)}
                    trackKey="icon-settings"
                  />
                )}
              </div>
            </SpaceBetween>
          </section>

          {/* Disabled button */}
          <section id="tooltip-disabled">
            <h3>Disabled Button</h3>
            <div
              ref={disabledRef}
              onMouseEnter={() => setShowDisabled(true)}
              onMouseLeave={() => setShowDisabled(false)}
              onFocus={() => setShowDisabled(true)}
              onBlur={() => setShowDisabled(false)}
              tabIndex={0}
              style={{ display: 'inline-block' }}
            >
              <Button disabled={true} iconName="upload">
                Save
              </Button>
              {showDisabled && (
                <Tooltip
                  content="No changes to save"
                  getTrack={() => disabledRef.current}
                  position="top"
                  onEscape={() => setShowDisabled(false)}
                  trackKey="disabled"
                />
              )}
            </div>
          </section>

          {/* Truncated text */}
          <section id="tooltip-truncated">
            <h3>Truncated Text</h3>
            <div
              ref={truncatedRef}
              onMouseEnter={() => setShowTruncated(true)}
              onMouseLeave={() => setShowTruncated(false)}
              style={{ maxWidth: '200px' }}
            >
              <div
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  padding: '8px',
                  background: '#f0f0f0',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                my-very-long-filename-document-final-version.pdf
              </div>
              {showTruncated && (
                <Tooltip
                  content="my-very-long-filename-document-final-version.pdf"
                  getTrack={() => truncatedRef.current}
                  position="top"
                  onEscape={() => setShowTruncated(false)}
                  trackKey="truncated"
                />
              )}
            </div>
          </section>

          {/* Interactive & Formatted Content */}
          <section id="tooltip-interactive-content">
            <h3>Interactive & Formatted Content</h3>
            <SpaceBetween direction="horizontal" size="l">
              <div
                ref={linkRef}
                onMouseEnter={() => setShowLink(true)}
                onMouseLeave={() => setShowLink(false)}
                style={{ display: 'inline-block' }}
              >
                <a
                  href="#"
                  onFocus={() => setShowLink(true)}
                  onBlur={() => setShowLink(false)}
                  style={{ color: '#0073bb', textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={e => e.preventDefault()}
                >
                  Documentation Link
                </a>
                {showLink && (
                  <Tooltip
                    content={
                      <div>
                        <strong>AWS Documentation</strong>
                        <br />
                        Click to view complete API reference
                        <br />
                        Last updated: Today
                      </div>
                    }
                    getTrack={() => linkRef.current}
                    position="top"
                    onEscape={() => setShowLink(false)}
                    trackKey="link-tooltip"
                  />
                )}
              </div>

              <div
                ref={codeRef}
                onMouseEnter={() => setShowCode(true)}
                onMouseLeave={() => setShowCode(false)}
                onFocus={() => setShowCode(true)}
                onBlur={() => setShowCode(false)}
                tabIndex={0}
                style={{ display: 'inline-block' }}
              >
                <span
                  style={{
                    padding: '4px 8px',
                    background: '#f0f0f0',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                  }}
                >
                  aws.config.region
                </span>
                {showCode && (
                  <Tooltip
                    content={
                      <div>
                        <code
                          style={{
                            display: 'block',
                            padding: '8px',
                            background: '#232f3e',
                            color: '#fff',
                            borderRadius: '4px',
                            fontSize: '12px',
                          }}
                        >
                          {`const AWS = require('aws-sdk');\nAWS.config.update({\n  region: 'us-west-2'\n});`}
                        </code>
                      </div>
                    }
                    getTrack={() => codeRef.current}
                    position="bottom"
                    onEscape={() => setShowCode(false)}
                    trackKey="code-tooltip"
                  />
                )}
              </div>
            </SpaceBetween>
          </section>

          <section id="aria-describedby-example">
            <h3>ARIA Described-by Example</h3>
            <div
              style={{ display: 'inline-block' }}
              onMouseEnter={() => setShowPassword(true)}
              onMouseLeave={() => setShowPassword(false)}
            >
              <label htmlFor="password-input" style={{ display: 'block', marginBottom: '4px' }}>
                Password:
              </label>
              <input
                ref={passwordRef}
                id="password-input"
                type="password"
                placeholder="Enter password"
                style={{
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
                onFocus={() => setShowPassword(true)}
                onBlur={() => setShowPassword(false)}
              />
              {showPassword && (
                <Tooltip
                  content={
                    <div>
                      <p>
                        <strong>Password Rules:</strong>
                      </p>
                      <ul style={{ margin: 0, paddingLeft: '16px' }}>
                        <li>Minimum of 8 characters</li>
                        <li>
                          Include at least one lowercase letter, one uppercase letter, one number and one special
                          character
                        </li>
                        <li>Unique to this website</li>
                      </ul>
                    </div>
                  }
                  getTrack={() => passwordRef.current}
                  position="bottom"
                  onEscape={() => setShowPassword(false)}
                  trackKey="password-rules"
                />
              )}
            </div>
          </section>
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
