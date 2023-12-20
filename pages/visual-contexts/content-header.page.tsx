// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Autosuggest from '~components/autosuggest';
import Box from '~components/box';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import Checkbox from '~components/checkbox';
import FormField from '~components/form-field';
import Input from '~components/input';
import Multiselect from '~components/multiselect';
import RadioGroup from '~components/radio-group';
import Select from '~components/select';
import SegmentedControl from '~components/segmented-control';
import SpaceBetween from '~components/space-between';
import Textarea from '~components/textarea';
import Tiles from '~components/tiles';
import VisualContext from '~components/internal/components/visual-context';
import ScreenshotArea from '../utils/screenshot-area';
import styles from './styles.scss';

const options = [
  {
    label: 'Option 1',
    value: '1',
    description: 'This is a description',
  },
];

const items = [
  { value: 'first', label: 'First choice' },
  { value: 'second', label: 'Second choice' },
  { value: 'third', label: 'Third choice' },
];

const onChange = () => {};

export default function ContentHeaderVisualContextDemo() {
  return (
    <ScreenshotArea gutters={false}>
      <VisualContext contextName="content-header">
        <Box padding="l" className={styles.main}>
          <SpaceBetween size="l">
            <Box variant="h1">Content header visual context</Box>
            <SpaceBetween direction="horizontal" size="xs">
              <Button>Normal button</Button>
              <Button disabled={true}>Disabled</Button>
            </SpaceBetween>
            <SpaceBetween direction="horizontal" size="xs">
              <ButtonDropdown
                items={[
                  { text: 'Delete', id: 'rm', disabled: false },
                  { text: 'Move', id: 'mv', disabled: false },
                  { text: 'Rename', id: 'rn', disabled: true },
                ]}
              >
                Button dropdown
              </ButtonDropdown>
              <ButtonDropdown items={[]} disabled={true}>
                Disabled
              </ButtonDropdown>
              <ButtonDropdown
                expandToViewport={true}
                data-testid="button-dropdown-expand"
                items={[
                  { text: 'Delete', id: 'rm', disabled: false },
                  { text: 'Move', id: 'mv', disabled: false },
                  { text: 'Rename', id: 'rn', disabled: true },
                ]}
              >
                Button dropdown
              </ButtonDropdown>
            </SpaceBetween>
            <SegmentedControl
              selectedId="seg-1"
              onChange={onChange}
              label="Default segmented control"
              options={[
                { text: 'Segment 1', id: 'seg-1' },
                { text: 'Segment 2', id: 'seg-2' },
                { text: 'Segment 3', id: 'seg-3', disabled: true },
              ]}
            />
            <FormField label="Checkbox">
              <Checkbox checked={true} onChange={onChange}>
                Checked
              </Checkbox>
              <Checkbox checked={false} onChange={onChange}>
                Not checked
              </Checkbox>
            </FormField>
            <FormField label="Checkbox">
              <RadioGroup onChange={onChange} value="first" items={items} />
            </FormField>
            <FormField label="Checkbox">
              <Tiles onChange={onChange} value="first" items={items} />
            </FormField>
            <FormField label="Input">
              <Input value="input" onChange={onChange} />
            </FormField>
            <FormField label="Textarea">
              <Textarea value="textarea" onChange={onChange} />
            </FormField>
            <FormField label="Select">
              <Select selectedOption={null} options={options} onChange={onChange} />
            </FormField>
            <FormField label="Select with expandToViewport">
              <Select
                selectedOption={null}
                options={options}
                onChange={onChange}
                expandToViewport={true}
                data-testid="select-expand"
              />
            </FormField>
            <FormField label="Multiselect">
              <Multiselect selectedOptions={[]} options={options} onChange={onChange} />
            </FormField>
            <FormField label="Autosuggest">
              <Autosuggest value={''} options={options} onChange={onChange} enteredTextLabel={() => 'label'} />
            </FormField>
          </SpaceBetween>
        </Box>
      </VisualContext>
    </ScreenshotArea>
  );
}
