// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import Select, { SelectProps } from '~components/select';
import Box from '~components/box';

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
        <Box variant="h1">Overflow test</Box>
        <Box variant="p">Dropdown should not be rendered beyond the container with overflow hidden</Box>
        <div style={{ height: '600px' }}>Placeholder</div>
        <div style={{ overflow: 'hidden', height: '200px', width: '300px' }}>
          <Select
            id="select_overflow"
            placeholder="Choose option"
            selectedOption={null}
            options={optionsSemiExtended}
            expandToViewport={true}
          />
        </div>
      </Box>
    </article>
  );
}
