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
  const [showTruncated, setShowTruncated] = useState(false);
  const truncatedRef = useRef<HTMLDivElement>(null);

  // Interactive content
  const [showLink, setShowLink] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const linkRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  // Password input
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef<HTMLDivElement>(null);

  return (
    <article>
      <h1>Tooltip Examples</h1>
      <p>Interactive tooltip demonstrations with positioning and content variations</p>

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
                    'aria-describedby': 'interactive-description',
                    onFocus: () => setShowInteractive(true),
                    onBlur: () => setShowInteractive(false),
                  }}
                  data-testid="hover-button"
                >
                  Hover
                </Button>
                <span id="interactive-description" hidden={true}>
                  {`Tooltip positioned on ${interactivePosition}`}
                </span>
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
                    'aria-describedby': 'short-description',
                    onFocus: () => setShowTop(true),
                    onBlur: () => setShowTop(false),
                  }}
                >
                  Short
                </Button>
                <span id="short-description" hidden={true}>
                  Lorem
                </span>
                {showTop && (
                  <Tooltip
                    content="Lorem"
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
                  data-testid="medium-length-button"
                  nativeButtonAttributes={{
                    'aria-describedby': 'medium-description',
                    onFocus: () => setShowBottom(true),
                    onBlur: () => setShowBottom(false),
                  }}
                >
                  Medium
                </Button>
                <span id="medium-description" hidden={true}>
                  Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore.
                </span>
                {showBottom && (
                  <Tooltip
                    content="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore."
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
                    'aria-describedby': 'long-description',
                    onFocus: () => setShowLeft(true),
                    onBlur: () => setShowLeft(false),
                  }}
                >
                  Long
                </Button>
                <span id="long-description" hidden={true}>
                  Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip
                  ex ea commodo consequat.
                </span>
                {showLeft && (
                  <Tooltip
                    content="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
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
                style={{ display: 'inline-block' }}
              >
                <Button
                  variant="primary"
                  nativeButtonAttributes={{
                    'aria-describedby': 'very-long-description',
                    onFocus: () => setShowRight(true),
                    onBlur: () => setShowRight(false),
                  }}
                >
                  Very Long
                </Button>
                <span id="very-long-description" hidden={true}>
                  Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip
                  ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                  eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia
                  deserunt mollit anim id est laborum.
                </span>
                {showRight && (
                  <Tooltip
                    content="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum."
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
            <h3>Truncated Text</h3>
            <div
              ref={truncatedRef}
              onMouseEnter={() => setShowTruncated(true)}
              onMouseLeave={() => setShowTruncated(false)}
              style={{ display: 'inline-block' }}
            >
              <button
                data-testid="truncated-text-button"
                onFocus={() => setShowTruncated(true)}
                onBlur={() => setShowTruncated(false)}
                aria-describedby="truncated-description"
                style={{
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  padding: '8px',
                  border: '1px solid',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: 'transparent',
                  textAlign: 'left',
                }}
              >
                Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt
              </button>
              <span id="truncated-description" hidden={true}>
                Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt
              </span>
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
                <a
                  href="#"
                  onFocus={() => setShowLink(true)}
                  onBlur={() => setShowLink(false)}
                  aria-describedby="link-description"
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={e => e.preventDefault()}
                >
                  Documentation Link
                </a>
                <span id="link-description" hidden={true}>
                  AWS Documentation - Click to view complete API reference - Last updated: Today
                </span>
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
                style={{ display: 'inline-block' }}
              >
                <button
                  onFocus={() => setShowCode(true)}
                  onBlur={() => setShowCode(false)}
                  aria-describedby="code-description"
                  style={{
                    padding: '4px 8px',
                    border: '1px solid',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                    background: 'transparent',
                  }}
                >
                  aws.config.region
                </button>
                <span id="code-description" hidden={true}>
                  {`const AWS = require('aws-sdk'); AWS.config.update({ region: 'us-west-2' });`}
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
            <h3>Password Input Example</h3>
            <div
              ref={passwordRef}
              onMouseEnter={() => setShowPassword(true)}
              onMouseLeave={() => setShowPassword(false)}
              style={{ display: 'inline-block' }}
            >
              <label htmlFor="password-input" style={{ display: 'block', marginBottom: '4px' }}>
                Password:
              </label>
              <input
                id="password-input"
                type="password"
                placeholder="Enter password"
                aria-describedby="password-description"
                style={{
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
                onFocus={() => setShowPassword(true)}
                onBlur={() => setShowPassword(false)}
              />
              <span id="password-description" hidden={true}>
                Password Rules: Minimum of 8 characters, Include at least one lowercase letter, one uppercase letter,
                one number and one special character, Unique to this website
              </span>
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
