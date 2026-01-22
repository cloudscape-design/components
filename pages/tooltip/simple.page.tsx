// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef, useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import FormField from '~components/form-field';
import SegmentedControl from '~components/segmented-control';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import Tooltip from '~components/tooltip';

import { AppContextType } from '../app/app-context';
import AppContext from '../app/app-context';
import { SimplePage } from '../app/templates';

type PageContext = React.Context<
  AppContextType<{
    position?: 'top' | 'right' | 'bottom' | 'left';
  }>
>;

export default function TooltipSimple() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const interactivePosition = urlParams.position ?? 'top';

  const [activeTooltip, setActiveTooltip] = useState<
    null | 'interactive' | 'top' | 'bottom' | 'left' | 'right' | 'link' | 'code' | 'password'
  >(null);

  const interactiveRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isInteractingWithTooltip, setIsInteractingWithTooltip] = useState(false);

  const handleFocusTooltip = (id: typeof activeTooltip) => {
    setActiveTooltip(id);
  };

  const handleBlurTooltip = () => {
    // Only close if not currently interacting with tooltip
    if (!isInteractingWithTooltip) {
      setActiveTooltip(null);
    }
  };

  const handleMouseEnterTooltip = (id: typeof activeTooltip) => {
    setActiveTooltip(id);
  };

  const handleTooltipMouseDown = () => {
    setIsInteractingWithTooltip(true);
  };

  const handleTooltipMouseUp = () => {
    setIsInteractingWithTooltip(false);
  };

  return (
    <SimplePage
      title="Tooltip Examples"
      screenshotArea={{}}
      settings={
        <FormField label="Tooltip position">
          <SpaceBetween direction="horizontal" size="l" alignItems="center">
            <SegmentedControl
              selectedId={interactivePosition}
              onChange={({ detail }) =>
                setUrlParams({ position: detail.selectedId as 'top' | 'right' | 'bottom' | 'left' })
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
              onMouseEnter={() => handleMouseEnterTooltip('interactive')}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <Button
                nativeButtonAttributes={{
                  'aria-describedby': 'interactive-description',
                  onFocus: () => handleFocusTooltip('interactive'),
                  onBlur: handleBlurTooltip,
                }}
                data-testid="hover-button"
              >
                Hover
              </Button>
              <span id="interactive-description" hidden={true}>
                {`Tooltip positioned on ${interactivePosition}`}
              </span>
              {activeTooltip === 'interactive' && (
                <div onMouseDown={handleTooltipMouseDown} onMouseUp={handleTooltipMouseUp}>
                  <Tooltip
                    content={`Tooltip positioned on ${interactivePosition}`}
                    getTrack={() => interactiveRef.current}
                    position={interactivePosition}
                    onEscape={() => setActiveTooltip(null)}
                  />
                </div>
              )}
            </div>
          </SpaceBetween>
        </FormField>
      }
    >
      <SpaceBetween size="l">
        <SpaceBetween direction="horizontal" size="l">
          <ButtonWithTooltip tooltipId="top" buttonText="Short" tooltipContent="Lorem" position="top" />
          <ButtonWithTooltip
            tooltipId="bottom"
            buttonText="Medium"
            tooltipContent="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore."
            position="bottom"
            testId="medium-length-button"
          />
          <ButtonWithTooltip
            tooltipId="left"
            buttonText="Long"
            tooltipContent="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            position="left"
          />
          <ButtonWithTooltip
            tooltipId="right"
            buttonText="Very Long"
            tooltipContent="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum."
            position="right"
          />
        </SpaceBetween>

        <TruncatedTextExample />

        <SpaceBetween direction="horizontal" size="l">
          <div
            ref={linkRef}
            onMouseEnter={() => handleMouseEnterTooltip('link')}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <a
              href="#"
              onFocus={() => handleFocusTooltip('link')}
              onBlur={handleBlurTooltip}
              aria-describedby="link-description"
              style={{ textDecoration: 'underline', cursor: 'pointer' }}
              onClick={e => e.preventDefault()}
            >
              Documentation Link
            </a>
            <span id="link-description" hidden={true}>
              AWS Documentation - Click to view complete API reference - Last updated: Today
            </span>
            {activeTooltip === 'link' && (
              <div onMouseDown={handleTooltipMouseDown} onMouseUp={handleTooltipMouseUp}>
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
                  onEscape={() => setActiveTooltip(null)}
                />
              </div>
            )}
          </div>

          <div
            ref={codeRef}
            onMouseEnter={() => handleMouseEnterTooltip('code')}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <button
              onFocus={() => handleFocusTooltip('code')}
              onBlur={handleBlurTooltip}
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
            {activeTooltip === 'code' && (
              <div onMouseDown={handleTooltipMouseDown} onMouseUp={handleTooltipMouseUp}>
                <Tooltip
                  content={
                    <Box variant="awsui-inline-code">
                      {`const AWS = require('aws-sdk');\nAWS.config.update({\n  region: 'us-west-2'\n});`}
                    </Box>
                  }
                  getTrack={() => codeRef.current}
                  position="bottom"
                  onEscape={() => setActiveTooltip(null)}
                />
              </div>
            )}
          </div>
        </SpaceBetween>

        <div
          onMouseEnter={() => handleMouseEnterTooltip('password')}
          onMouseLeave={() => setActiveTooltip(null)}
          style={{ display: 'inline-block' }}
        >
          <label htmlFor="password-input" style={{ display: 'block', marginBottom: '4px' }}>
            Instance ID:
          </label>
          <input
            ref={passwordRef}
            id="password-input"
            type="text"
            placeholder="i-0123456789abcdef0"
            aria-describedby="password-description"
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontFamily: 'monospace',
            }}
            onFocus={() => handleFocusTooltip('password')}
            onBlur={handleBlurTooltip}
          />
          <span id="password-description" hidden={true}>
            Running - The unique identifier assigned to this EC2 instance when it was launched.
          </span>
          {activeTooltip === 'password' && (
            <div onMouseDown={handleTooltipMouseDown} onMouseUp={handleTooltipMouseUp}>
              <Tooltip
                content={
                  <SpaceBetween size="xxs">
                    <StatusIndicator type="success">Running</StatusIndicator>
                    <span>The unique identifier assigned to this EC2 instance when it was launched.</span>
                  </SpaceBetween>
                }
                getTrack={() => passwordRef.current}
                position="bottom"
                onEscape={() => setActiveTooltip(null)}
              />
            </div>
          )}
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}

interface ButtonWithTooltipProps {
  tooltipId: string;
  buttonText: string;
  tooltipContent: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  testId?: string;
}

function ButtonWithTooltip({
  tooltipId,
  buttonText,
  tooltipContent,
  position = 'top',
  testId,
}: ButtonWithTooltipProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const contentText = typeof tooltipContent === 'string' ? tooltipContent : '';

  const handleBlur = () => {
    if (!isInteracting) {
      setShowTooltip(false);
    }
  };

  return (
    <div ref={ref} onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
      <Button
        nativeButtonAttributes={{
          'aria-describedby': `${tooltipId}-description`,
          onFocus: () => setShowTooltip(true),
          onBlur: handleBlur,
        }}
        data-testid={testId}
      >
        {buttonText}
      </Button>
      <span id={`${tooltipId}-description`} hidden={true}>
        {contentText}
      </span>
      {showTooltip && (
        <div onMouseDown={() => setIsInteracting(true)} onMouseUp={() => setIsInteracting(false)}>
          <Tooltip
            content={tooltipContent}
            getTrack={() => ref.current}
            position={position}
            onEscape={() => setShowTooltip(false)}
          />
        </div>
      )}
    </div>
  );
}

function TruncatedTextExample() {
  const ref1 = useRef<HTMLSpanElement>(null);
  const ref2 = useRef<HTMLSpanElement>(null);
  const ref3 = useRef<HTMLSpanElement>(null);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [isInteracting1, setIsInteracting1] = useState(false);
  const [isInteracting2, setIsInteracting2] = useState(false);
  const [isInteracting3, setIsInteracting3] = useState(false);

  // Full text content - CSS truncates visually, but screen readers see the full text
  // No aria-describedby needed since the span contains the full text
  const text1 = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor';
  const text2 = 'Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip';
  const text3 = 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore';

  const truncatedStyle: React.CSSProperties = {
    display: 'block',
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    padding: '8px',
    border: '1px solid',
    borderRadius: '4px',
  };

  return (
    <SpaceBetween size="s">
      <span
        ref={ref1}
        tabIndex={0}
        onMouseEnter={() => setShow1(true)}
        onMouseLeave={() => setShow1(false)}
        onFocus={() => setShow1(true)}
        onBlur={() => !isInteracting1 && setShow1(false)}
        style={truncatedStyle}
      >
        {text1}
        {show1 && (
          <div onMouseDown={() => setIsInteracting1(true)} onMouseUp={() => setIsInteracting1(false)}>
            <Tooltip content={text1} getTrack={() => ref1.current} position="top" onEscape={() => setShow1(false)} />
          </div>
        )}
      </span>

      <span
        ref={ref2}
        tabIndex={0}
        onMouseEnter={() => setShow2(true)}
        onMouseLeave={() => setShow2(false)}
        onFocus={() => setShow2(true)}
        onBlur={() => !isInteracting2 && setShow2(false)}
        style={truncatedStyle}
      >
        {text2}
        {show2 && (
          <div onMouseDown={() => setIsInteracting2(true)} onMouseUp={() => setIsInteracting2(false)}>
            <Tooltip content={text2} getTrack={() => ref2.current} position="top" onEscape={() => setShow2(false)} />
          </div>
        )}
      </span>

      <span
        ref={ref3}
        tabIndex={0}
        onMouseEnter={() => setShow3(true)}
        onMouseLeave={() => setShow3(false)}
        onFocus={() => setShow3(true)}
        onBlur={() => !isInteracting3 && setShow3(false)}
        style={truncatedStyle}
      >
        {text3}
        {show3 && (
          <div onMouseDown={() => setIsInteracting3(true)} onMouseUp={() => setIsInteracting3(false)}>
            <Tooltip content={text3} getTrack={() => ref3.current} position="top" onEscape={() => setShow3(false)} />
          </div>
        )}
      </span>
    </SpaceBetween>
  );
}
