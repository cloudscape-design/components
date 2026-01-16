// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef, useState } from 'react';

import Button from '~components/button';
import FormField from '~components/form-field';
import SegmentedControl from '~components/segmented-control';
import SpaceBetween from '~components/space-between';
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
      subtitle="Interactive tooltip demonstrations with positioning and content variations"
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
                    trackKey={`position-${interactivePosition}`}
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
          <ButtonWithTooltip
            tooltipId="top"
            buttonText="Short"
            tooltipContent="Lorem"
            position="top"
            activeTooltip={activeTooltip}
            onActivate={setActiveTooltip}
            onDeactivate={() => setActiveTooltip(null)}
          />
          <ButtonWithTooltip
            tooltipId="bottom"
            buttonText="Medium"
            tooltipContent="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore."
            position="bottom"
            activeTooltip={activeTooltip}
            onActivate={setActiveTooltip}
            onDeactivate={() => setActiveTooltip(null)}
            testId="medium-length-button"
          />
          <ButtonWithTooltip
            tooltipId="left"
            buttonText="Long"
            tooltipContent="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            position="left"
            activeTooltip={activeTooltip}
            onActivate={setActiveTooltip}
            onDeactivate={() => setActiveTooltip(null)}
          />
          <ButtonWithTooltip
            tooltipId="right"
            buttonText="Very Long"
            tooltipContent="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum."
            position="right"
            activeTooltip={activeTooltip}
            onActivate={setActiveTooltip}
            onDeactivate={() => setActiveTooltip(null)}
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
                  trackKey="link-tooltip"
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
                  onEscape={() => setActiveTooltip(null)}
                  trackKey="code-tooltip"
                />
              </div>
            )}
          </div>
        </SpaceBetween>

        <div onMouseEnter={() => handleMouseEnterTooltip('password')} onMouseLeave={() => setActiveTooltip(null)}>
          <label htmlFor="password-input" style={{ display: 'block', marginBottom: '4px' }}>
            Password:
          </label>
          <input
            ref={passwordRef}
            id="password-input"
            type="password"
            placeholder="Enter password"
            aria-describedby="password-description"
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
            onFocus={() => handleFocusTooltip('password')}
            onBlur={handleBlurTooltip}
          />
          <span id="password-description" hidden={true}>
            Password Rules: Minimum of 8 characters. Include at least one lowercase letter, one uppercase letter, one
            number and one special character. Unique to this website.
          </span>
          {activeTooltip === 'password' && (
            <div onMouseDown={handleTooltipMouseDown} onMouseUp={handleTooltipMouseUp}>
              <Tooltip
                content={
                  <div>
                    <strong>Password Rules:</strong>
                    <br />• Minimum of 8 characters
                    <br />• Include at least one lowercase letter, one uppercase letter, one number and one special
                    character
                    <br />• Unique to this website
                  </div>
                }
                getTrack={() => passwordRef.current}
                position="bottom"
                onEscape={() => setActiveTooltip(null)}
                trackKey="password-rules"
              />
            </div>
          )}
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}

interface ButtonWithTooltipProps {
  tooltipId: 'interactive' | 'top' | 'bottom' | 'left' | 'right' | 'link' | 'code' | 'password';
  buttonText: string;
  tooltipContent: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  activeTooltip: 'interactive' | 'top' | 'bottom' | 'left' | 'right' | 'link' | 'code' | 'password' | null;
  onActivate: (id: 'interactive' | 'top' | 'bottom' | 'left' | 'right' | 'link' | 'code' | 'password') => void;
  onDeactivate: () => void;
  testId?: string;
}

function ButtonWithTooltip({
  tooltipId,
  buttonText,
  tooltipContent,
  position = 'top',
  activeTooltip,
  onActivate,
  onDeactivate,
  testId,
}: ButtonWithTooltipProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const contentText = typeof tooltipContent === 'string' ? tooltipContent : '';

  const handleFocus = () => {
    onActivate(tooltipId);
  };

  const handleBlur = () => {
    if (!isInteracting) {
      onDeactivate();
    }
  };

  const handleMouseEnter = () => {
    onActivate(tooltipId);
  };

  const handleTooltipMouseDown = () => {
    setIsInteracting(true);
  };

  const handleTooltipMouseUp = () => {
    setIsInteracting(false);
  };

  return (
    <div ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={onDeactivate}>
      <Button
        nativeButtonAttributes={{
          'aria-describedby': `${tooltipId}-description`,
          onFocus: handleFocus,
          onBlur: handleBlur,
        }}
        data-testid={testId}
      >
        {buttonText}
      </Button>
      <span id={`${tooltipId}-description`} hidden={true}>
        {contentText}
      </span>
      {activeTooltip === tooltipId && (
        <div onMouseDown={handleTooltipMouseDown} onMouseUp={handleTooltipMouseUp}>
          <Tooltip
            content={tooltipContent}
            getTrack={() => ref.current}
            position={position}
            onEscape={onDeactivate}
            trackKey={tooltipId}
          />
        </div>
      )}
    </div>
  );
}

function TruncatedTextExample() {
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref3 = useRef<HTMLDivElement>(null);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);

  return (
    <SpaceBetween size="s">
      <div
        ref={ref1}
        onMouseEnter={() => setShow1(true)}
        onMouseLeave={() => setShow1(false)}
        onFocus={() => setShow1(true)}
        onBlur={() => setShow1(false)}
        tabIndex={0}
        style={{
          maxWidth: '200px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          padding: '8px',
          border: '1px solid',
          borderRadius: '4px',
        }}
      >
        <span>Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor</span>
        {show1 && (
          <Tooltip
            content="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor"
            getTrack={() => ref1.current}
            onEscape={() => setShow1(false)}
            trackKey="file1"
          />
        )}
      </div>

      <div
        ref={ref2}
        onMouseEnter={() => setShow2(true)}
        onMouseLeave={() => setShow2(false)}
        onFocus={() => setShow2(true)}
        onBlur={() => setShow2(false)}
        tabIndex={0}
        style={{
          maxWidth: '200px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          padding: '8px',
          border: '1px solid',
          borderRadius: '4px',
        }}
      >
        <span>Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip</span>
        {show2 && (
          <Tooltip
            content="Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip"
            getTrack={() => ref2.current}
            onEscape={() => setShow2(false)}
            trackKey="arn"
          />
        )}
      </div>

      <div
        ref={ref3}
        onMouseEnter={() => setShow3(true)}
        onMouseLeave={() => setShow3(false)}
        onFocus={() => setShow3(true)}
        onBlur={() => setShow3(false)}
        tabIndex={0}
        style={{
          maxWidth: '200px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          padding: '8px',
          border: '1px solid',
          borderRadius: '4px',
        }}
      >
        <span>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore</span>
        {show3 && (
          <Tooltip
            content="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore"
            getTrack={() => ref3.current}
            onEscape={() => setShow3(false)}
            trackKey="email"
          />
        )}
      </div>
    </SpaceBetween>
  );
}
