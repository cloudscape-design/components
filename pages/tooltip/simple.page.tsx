// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import Button from '~components/button';
import SegmentedControl from '~components/segmented-control';
import SpaceBetween from '~components/space-between';
import Tooltip, { useHiddenDescription } from '~components/tooltip';

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

  // Hidden descriptions for Content Length Variations
  const { targetProps: shortTargetProps, descriptionEl: shortDescriptionEl } = useHiddenDescription('Short');
  const { targetProps: mediumTargetProps, descriptionEl: mediumDescriptionEl } = useHiddenDescription(
    'This is a medium length tooltip that provides more information than the short one but is not as detailed as the longer versions.'
  );
  const { targetProps: longTargetProps, descriptionEl: longDescriptionEl } = useHiddenDescription(
    'This is a longer tooltip that provides comprehensive information about the feature or action. It includes multiple sentences and detailed explanations to help users understand exactly what will happen when they interact with this element.'
  );
  const { targetProps: veryLongTargetProps, descriptionEl: veryLongDescriptionEl } = useHiddenDescription(
    'This is a very long tooltip that contains extensive information and will likely wrap to multiple lines depending on the available space. It demonstrates how tooltips handle longer content and provides a comprehensive explanation of the feature, including detailed instructions, warnings, and additional context that users might need to make informed decisions about their actions.'
  );

  // Hidden description for Interactive Position Control (updates with position)
  const interactiveTooltipContent = `Tooltip positioned on ${interactivePosition}`;
  const { targetProps: interactiveTargetProps, descriptionEl: interactiveDescriptionEl } =
    useHiddenDescription(interactiveTooltipContent);

  // Hidden description for Truncated Text
  const { targetProps: truncatedTargetProps, descriptionEl: truncatedDescriptionEl } = useHiddenDescription(
    'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt'
  );

  // Hidden descriptions for Interactive & Formatted Content
  const { targetProps: linkTargetProps, descriptionEl: linkDescriptionEl } = useHiddenDescription(
    'AWS Documentation - Click to view complete API reference - Last updated: Today'
  );
  const { targetProps: codeTargetProps, descriptionEl: codeDescriptionEl } = useHiddenDescription(
    "const AWS = require('aws-sdk'); AWS.config.update({ region: 'us-west-2' });"
  );

  // Hidden description for Password Input
  const { targetProps: passwordTargetProps, descriptionEl: passwordDescriptionEl } = useHiddenDescription(
    'Password Rules: Minimum of 8 characters, Include at least one lowercase letter, one uppercase letter, one number and one special character, Unique to this website'
  );

  return (
    <article>
      <h1>Tooltip Examples</h1>
      <p>Interactive tooltip demonstrations with positioning, content variations, and accessibility features</p>

      <ScreenshotArea>
        <SpaceBetween size="l">
          <section>
            <h2>Interactive Position Control</h2>
            <SpaceBetween direction="horizontal" size="l" alignItems="center">
              <SegmentedControl
                selectedId={interactivePosition}
                onChange={({ detail }) =>
                  setInteractivePosition(detail.selectedId as 'top' | 'right' | 'bottom' | 'left')
                }
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
                    ...interactiveTargetProps,
                  }}
                  data-testid="hover-button"
                >
                  Hover
                </Button>
                {interactiveDescriptionEl}
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
          </section>

          <section>
            <h2>Content Length Variations</h2>
            <SpaceBetween direction="horizontal" size="l">
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
                    ...shortTargetProps,
                  }}
                >
                  Short
                </Button>
                {shortDescriptionEl}
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
                    ...mediumTargetProps,
                  }}
                >
                  Medium
                </Button>
                {mediumDescriptionEl}
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
                    ...longTargetProps,
                  }}
                >
                  Long
                </Button>
                {longDescriptionEl}
                {showLeft && (
                  <Tooltip
                    content="This is a longer tooltip..."
                    getTrack={() => leftRef.current}
                    position="left"
                    onEscape={() => setShowLeft(false)}
                    trackKey="left"
                  />
                )}
              </div>

              <div
                ref={rightRef}
                onMouseEnter={() => setShowRight(true)}
                onMouseLeave={() => setShowRight(false)}
                onFocus={() => setShowRight(true)}
                onBlur={() => setShowRight(false)}
                style={{ display: 'inline-block' }}
              >
                <Button
                  variant="primary"
                  nativeButtonAttributes={{
                    onFocus: () => setShowRight(true),
                    onBlur: () => setShowRight(false),
                    ...veryLongTargetProps,
                  }}
                >
                  Very Long
                </Button>
                {veryLongDescriptionEl}
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
            </SpaceBetween>
          </section>

          <section>
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

          <section>
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

          <section>
            <h3>Truncated Text</h3>
            <div
              ref={truncatedRef}
              onMouseEnter={() => setShowTruncated(true)}
              onMouseLeave={() => setShowTruncated(false)}
              style={{ maxWidth: '200px' }}
              tabIndex={0}
              onFocus={() => setShowTruncated(true)}
              onBlur={() => setShowTruncated(false)}
              {...truncatedTargetProps}
            >
              {truncatedDescriptionEl}
              <div
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  padding: '8px',
                  border: '1px solid',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt
              </div>
              {showTruncated && (
                <Tooltip
                  content="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt"
                  getTrack={() => truncatedRef.current}
                  position="top"
                  onEscape={() => setShowTruncated(false)}
                  trackKey="truncated"
                />
              )}
            </div>
          </section>

          <section>
            <h3>Interactive & Formatted Content</h3>
            <SpaceBetween direction="horizontal" size="l">
              <div
                ref={linkRef}
                onMouseEnter={() => setShowLink(true)}
                onMouseLeave={() => setShowLink(false)}
                style={{ display: 'inline-block' }}
              >
                {linkDescriptionEl}
                <a
                  href="#"
                  onFocus={() => setShowLink(true)}
                  onBlur={() => setShowLink(false)}
                  style={{ color: '#0073bb', textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={e => e.preventDefault()}
                  {...linkTargetProps}
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
                {...codeTargetProps}
              >
                {codeDescriptionEl}
                <span
                  style={{
                    padding: '4px 8px',
                    border: '1px solid',
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

          <section>
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
                {...passwordTargetProps}
              />
              {passwordDescriptionEl}

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
