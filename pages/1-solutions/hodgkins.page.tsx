// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Icon, PromptInput, SpaceBetween } from '~components';
import Theme from '~components/theming/component';

import { soundBars } from './foundation/icons';
import SegmentedControl from './SegmentedControl';
import SideNavigationBar from './SideNavigationBar/SideNavigationBar';
import TopNavigation from './TopNavigation/TopNavigation';
import Typography from './Typography';

export default function HodgkinsDemo() {
  const [inputValue, setInputValue] = useState('');
  const [selectedId, setSelectedId] = useState('seg-1');
  const [selectedButton, setSelectedButton] = React.useState('add');

  return (
    <Theme fontFamily='"Amazon Ember Display", "Helvetica Neue", Helvetica, Arial, sans-serif'>
      <TopNavigation />
      <div className={'h-[calc(100vh_-_96px)] bg-image-gradient'}>
        <div className="grid grid-cols-[20%_40%_40%] gap-xxxl px-xxxl min-h-[calc(100%-100px)] overflow-hidden">
          <div className="flex pt-xxxl items-center">
            <SideNavigationBar
              selectedId={selectedButton}
              onItemClick={({ detail }) => setSelectedButton(detail.pressed ? detail.id : '')}
            />
          </div>

          <div className="flex pt-xxxl flex-col justify-between">
            <div>
              <Typography size="medium" type="label">
                New project
              </Typography>

              <Typography
                type="headline"
                size="large"
                fontWeight="700"
                gradient="linear-gradient(to right, #006ce0, #18ffb6)"
              >
                Antibody targeting CD20 for B-cell non-Hodgkin lymphomas
              </Typography>
            </div>

            <PromptInput
              onChange={({ detail }) => setInputValue(detail.value)}
              value={inputValue}
              actionButtonAriaLabel="Send message"
              actionButtonIconSvg={soundBars}
              ariaLabel="Prompt input with min and max rows"
              maxRows={10}
              minRows={5}
            />
          </div>

          <div className="flex pt-xxxl">
            <div className="rounded-[16px] p-[16px] bg-[#101415]">
              <Typography size="medium" type="label">
                Experiment
              </Typography>

              <SpaceBetween size="m">
                <Typography size="large" type="title" tag="h2">
                  Generate candidates for ANPS motif
                </Typography>

                <SegmentedControl
                  onChange={({ detail }) => setSelectedId(detail.selectedId)}
                  selectedId={selectedId}
                  label="Default segmented control"
                  options={[
                    { text: 'Simple', id: 'seg-1', iconName: selectedId === 'seg-1' ? 'check' : undefined },
                    { text: 'Detailed', id: 'seg-2', iconName: selectedId === 'seg-2' ? 'check' : undefined },
                  ]}
                />

                <div className="rounded-[16px] px-[16px] py-[12px] bg-[#191c1d]">
                  <Typography size="small" type="title" tag="h3">
                    <Theme fill="rgba(24, 255, 182, .8) ">
                      <Icon name="gen-ai" size="inherit" /> Overview
                    </Theme>
                  </Typography>
                </div>
              </SpaceBetween>
            </div>
          </div>
        </div>
      </div>
    </Theme>
  );
}
