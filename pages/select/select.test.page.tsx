// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import range from 'lodash/range';
import Select from '~components/select';
import Box from '~components/box';
import ScreenshotArea from '../utils/screenshot-area';

const options = [
  {
    value: '1',
    label: 'Option 1',
  },
  {
    value: '2',
    label: 'Option 2',
  },
];

const groupOptions = [
  {
    label: 'Group 1',
    options: [
      {
        label: 'Child 1',
        value: 'child1',
      },
      {
        label: 'Child 2',
        disabled: true,
      },
    ],
  },
  {
    label: 'Option 1',
    labelTag: 'bx',
  },
  {
    label: 'Group 2',
    disabled: true,
    options: [
      {
        label: 'Child 1',
      },
      {
        label: 'Child 2',
        disabled: true,
      },
    ],
  },
];

const optionsOverflow = range(45).map(index => ({
  value: 'option' + index,
  label: 'option ' + index,
}));

const optionsExtended = [
  {
    value: 'option1',
    label: 'Something longer than expected',
    labelTag: '128Gb',
    description: 'Blah, and then blablaaah',
    tags: ['2-CPU', '2Gb RAM'],
  },
  {
    value: 'option2',
    label: 'Another thing',
    labelTag: '128Gb',
    description: 'Blah, and then blablaaah',
    tags: ['2-CPU', '2Gb RAM', 'Stuff', 'More stuff', 'A lot'],
    disabled: true,
  },
  {
    value: 'option3',
    label: 'Third thing',
    labelTag: '128Gb',
    description: 'short',
    tags: ['2-CPU', '2Gb RAM'],
  },
];

const optionsSemiExtended = [
  {
    id: 'option1',
    label: 'Something longer than expected',
  },
  {
    id: 'option2',
    label: 'Another thing',
  },
  {
    id: 'option3',
    label: 'Third thing',
  },
];

export default function SelectPage() {
  const [selectedOption1, setSelectedOption1] = React.useState(null);
  const [selectedOption2, setSelectedOption2] = React.useState(null);
  const [selectedOption3, setSelectedOption3] = React.useState(null);
  const [selectedOption4, setSelectedOption4] = React.useState(null);
  const [selectedOption5, setSelectedOption5] = React.useState(null);
  const [selectedOption6, setSelectedOption6] = React.useState(null);

  return (
    <article>
      <ScreenshotArea>
        <Box padding="l">
          <Box padding="s">
            <Box variant="h1">Overflow test</Box>
            <Box variant="p">Dropdown should not be rendered beyond the container with overflow hidden</Box>
            <div id="smallest_container" style={{ overflow: 'hidden', height: '500px', padding: 0 }}>
              <div style={{ overflow: 'hidden', height: '900px' }}>
                <Select
                  id="select_overflow"
                  placeholder="Choose option"
                  selectedOption={{ value: 'option30' }}
                  options={optionsOverflow}
                />
              </div>
            </div>
          </Box>
          <Box padding="s">
            <Box variant="h1">Simple select</Box>
            <Select
              id="simple_select"
              statusType="pending"
              filteringType="auto"
              options={options}
              selectedOption={selectedOption1}
              placeholder="Choose option"
              onChange={(e: any) => {
                setSelectedOption1(e.detail.selectedOption);
              }}
            />
          </Box>
          <Box padding="s">
            <Box variant="h1">Expanded select</Box>
            <Select
              expandToViewport={true}
              id="expanded_select"
              statusType="pending"
              filteringType="auto"
              options={options}
              selectedOption={selectedOption2}
              placeholder="Choose option"
              onChange={(e: any) => {
                setSelectedOption2(e.detail.selectedOption);
              }}
            />
          </Box>
          <Box padding="s">
            <Box variant="h1">Group select</Box>
            <Select
              expandToViewport={true}
              id="expanded_select"
              statusType="pending"
              filteringType="auto"
              options={groupOptions}
              selectedOption={selectedOption3}
              placeholder="Choose option"
              onChange={(e: any) => {
                setSelectedOption3(e.detail.selectedOption);
              }}
            />
          </Box>
          <Box padding="s">
            <Box variant="h1">Native search tests</Box>
            <Select
              id="select_native_search_simple"
              options={options}
              selectedOption={selectedOption4}
              placeholder="Choose option"
              onChange={(e: any) => {
                setSelectedOption4(e.detail.selectedOption);
              }}
            />
          </Box>
          <Box padding="s">
            <Box variant="h1">Native search tests: extended</Box>
            <Select
              id="select_native_search_extended"
              options={optionsExtended}
              selectedOption={selectedOption5}
              placeholder="Choose option"
              onChange={(e: any) => {
                setSelectedOption5(e.detail.selectedOption);
              }}
            />
          </Box>
          <Box padding="s">
            <Box variant="h1">Native search tests: semi-extended</Box>
            <Select
              id="select_native_search_semi_extended"
              options={optionsSemiExtended}
              selectedOption={selectedOption6}
              placeholder="Choose option"
              onChange={(e: any) => {
                setSelectedOption6(e.detail.selectedOption);
              }}
            />
          </Box>
        </Box>
      </ScreenshotArea>
    </article>
  );
}
