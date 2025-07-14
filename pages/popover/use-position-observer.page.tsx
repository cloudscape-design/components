// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import Box from '~components/box';
import ExpandableSection from '~components/expandable-section';
import Arrow from '~components/popover/arrow';
import PopoverContainer from '~components/popover/container';
import Slider from '~components/slider';
import SpaceBetween from '~components/space-between';

const sliderI18nStrings = {
  valueTextRange: (previousValue: string, value: number, nextValue: string) =>
    `${value}, between ${previousValue} and ${nextValue}`,
};

export default function () {
  const keepPositionRef = useRef<HTMLDivElement>(null);
  const updatePositionRef = useRef<HTMLDivElement>(null);
  const [sliderValue, setSliderValue] = useState(0);
  return (
    <article>
      <Box margin={'xl'}>
        <h1>Position observer test</h1>
        <SpaceBetween size="xxl">
          {/* Expanded section with and without keepPosition */}
          <>
            <ExpandableSection headerText="Expandable section">Test content</ExpandableSection>
            <SpaceBetween direction="horizontal" size="xxl">
              <>
                <div ref={keepPositionRef} style={{ maxWidth: '50px' }}>
                  Test
                </div>
                <PopoverContainer
                  className="keepPositionPopover"
                  size="small"
                  fixedWidth={false}
                  position="bottom"
                  trackRef={keepPositionRef}
                  keepPosition={true}
                  arrow={position => <Arrow position={position} />}
                >
                  Keep position
                </PopoverContainer>
              </>

              <>
                <div ref={updatePositionRef} style={{ maxWidth: '50px', marginLeft: '50px' }}>
                  Test
                </div>
                <PopoverContainer
                  className="updatePositionPopover"
                  size="small"
                  fixedWidth={false}
                  position="bottom"
                  trackRef={updatePositionRef}
                  keepPosition={false}
                  arrow={position => <Arrow position={position} />}
                >
                  Update position
                </PopoverContainer>
              </>
            </SpaceBetween>
          </>

          {/* Slider */}
          <Slider
            ariaLabel="Slider test"
            min={0}
            max={100}
            value={sliderValue}
            onChange={({ detail }) => setSliderValue(detail.value)}
            i18nStrings={sliderI18nStrings}
          />
        </SpaceBetween>
      </Box>
    </article>
  );
}
