// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useContext } from 'react';
import Icon, { IconProps } from '~components/icon';
import TextContent from '~components/text-content';
import Box from '~components/box';
import ScreenshotArea from '../utils/screenshot-area';
import SpaceBetween from '~components/space-between';
import customIcon from './custom-icon.png';
import icons from '~components/icon/icons';
import AppContext, { AppContextType } from '../app/app-context';

const UNITS = 'px';
const tagVariants = ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'div', 'span', 'small'] as const;
type DemoContext = React.Context<AppContextType<{ iconName: IconProps.Name }>>;

export default function IconScenario() {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const iconName: IconProps.Name = urlParams.iconName || 'settings';
  const [height, setHeight] = useState(16);
  const [visibility, setVisibility] = useState(false);
  const unitHeight = height + UNITS;
  const iconPermutations = (
    <>
      <Icon name="external" size="inherit" /> <Icon url={customIcon} alt="custom icon" size="inherit" />{' '}
      <Icon
        svg={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false">
            <circle cx="8" cy="8" r="7" strokeWidth="2" stroke="currentColor" fill="none" />
            <circle cx="8" cy="8" r="3" />
          </svg>
        }
        size="inherit"
      />
    </>
  );

  return (
    <article>
      <ul>
        <li>Icons must align with text</li>
      </ul>
      <div style={{ padding: '5px 20px' }} id="test-controls">
        <label>
          Icon to show:
          <select defaultValue={iconName} onChange={e => setUrlParams({ iconName: e.target.value as IconProps.Name })}>
            {Object.keys(icons).map((icon, key) => (
              <option value={icon} key={key}>
                {icon}
              </option>
            ))}
          </select>
        </label>
        <SpaceBetween direction="horizontal" size="xxl">
          <div>
            <h2>Dynamic line height switch</h2>
            <label htmlFor="height-input">
              Line height:
              <input
                type="number"
                id="height-input"
                value={height}
                onChange={e => setHeight(parseInt(e.target.value, 10))}
              />
            </label>
            <span> {UNITS}</span>

            <div>
              <h1 style={{ lineHeight: unitHeight }}>
                <Icon name={iconName} size="inherit" id="dynamic-test-1" /> Heading 1 {unitHeight} {iconPermutations}
              </h1>
              <h2 style={{ lineHeight: unitHeight }}>
                <Icon name={iconName} size="inherit" id="dynamic-test-2" /> Heading 2 {unitHeight} {iconPermutations}
              </h2>
              <p style={{ lineHeight: unitHeight }}>
                <Icon name={iconName} size="inherit" id="dynamic-test-p" /> Paragraph {unitHeight} {iconPermutations}
              </p>
            </div>
          </div>
          <div>
            <h2>Toggle visibility (hidden by default)</h2>
            <label htmlFor="visibility-toggle">
              <input
                type="checkbox"
                id="visibility-toggle"
                checked={visibility}
                onChange={e => setVisibility(e.target.checked)}
              />{' '}
              Show icon
            </label>
            {visibility && (
              <Box variant="h1">
                <Icon name={iconName} size="inherit" id="visibility-test-1" /> Box h1 (big)
              </Box>
            )}
            <h2 style={{ display: visibility ? 'block' : 'none' }}>
              <Icon name={iconName} size="inherit" id="visibility-test-2" /> Heading 2 with default line height (24px)
            </h2>

            <div>
              <Box variant="h2" padding={{ vertical: 'xl' }}>
                <Icon name={iconName} size="inherit" id="static-test" /> Box h2 (normal/medium)
              </Box>
            </div>
          </div>
        </SpaceBetween>
      </div>
      <hr />

      <ScreenshotArea>
        <SpaceBetween direction="horizontal" size="xl">
          <div>
            <h2>Text content + inherit prop</h2>
            <TextContent>
              {tagVariants.map(tag => {
                const Tag = tag as keyof JSX.IntrinsicElements;
                return (
                  <Tag key={tag}>
                    <Icon name={iconName} size="inherit" /> {tag} example text {iconPermutations}
                  </Tag>
                );
              })}
            </TextContent>
          </div>
          <div>
            <h2>Box + inherit prop</h2>
            <div>
              {tagVariants.map(variant => {
                return (
                  <Box variant={variant} key={variant}>
                    <Icon name={iconName} size="inherit" /> {variant} example text {iconPermutations}
                  </Box>
                );
              })}
            </div>
          </div>
        </SpaceBetween>
        <h2>Other permutations</h2>
        <div style={{ width: '250px' }}>
          <Box>
            <Icon name={iconName} size="inherit" /> A long line of text to make sure that the icon inherits the right
            size. {iconPermutations}
          </Box>
          <Box variant="h2">
            <Icon name={iconName} size="inherit" /> A long line of text to make sure that the icon inherits the right
            size. {iconPermutations}
          </Box>
        </div>
        <Icon name={iconName} size="inherit" /> <Box variant="h2">Icons with no parent shouldnt inherit height</Box>{' '}
        <Icon name="external" size="inherit" />
      </ScreenshotArea>
    </article>
  );
}
