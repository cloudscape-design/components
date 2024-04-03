// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import Select, { SelectProps } from '~components/select';
import Box from '~components/box';
import ScreenshotArea from '../utils/screenshot-area';

const optionsSemiExtended: SelectProps['options'] = [
  {
    value: 'option1',
    label: 'Something longer than expected',
  },
  {
    value: 'option2',
    label: 'Another thing',
  },
  {
    value: 'option3',
    label: 'Third thing',
  },
  {
    value: 'option4',
    label: 'Apples thing',
  },
  {
    value: 'option5',
    label: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  },
  {
    value: 'option6',
    label: 'de Finibus Bonorum et Malorum',
  },
  {
    value: 'option7',
    label: 'because it is pleasure, but because those who do not ',
  },
  {
    value: 'option8',
    label: '1914 translation',
  },
  {
    value: 'option9',
    label: ' H. Rackham',
  },
  {
    value: 'option10',
    label: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur',
  },
] as const;

export default function SelectPage() {
  return (
    <article>
      <Box margin="l">
        <Box variant="h1">Borders test</Box>
        <Box variant="p">Dropdown should have all borders when expandToViewport set to true</Box>
        <ScreenshotArea
          style={{
            // extra space to include dropdown in the screenshot area
            paddingTop: 350,
          }}
        >
          <div style={{ width: '300px' }}>
            <Select
              placeholder="Choose option"
              selectedOption={null}
              options={optionsSemiExtended}
              expandToViewport={false}
              data-testid="select-border"
            />
          </div>
        </ScreenshotArea>
      </Box>
    </article>
  );
}
