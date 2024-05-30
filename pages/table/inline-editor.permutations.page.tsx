// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { TableBodyCell } from '~components/table/body-cell';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { useStickyColumns } from '~components/table/sticky-columns';
import { Box, Select, Multiselect, Input, TableProps } from '~components';

const baseColumnDefinition = {
  cell: () => 'Editable cell content shown inline when not editing',
  header: 'Column header',
};

const options = ['A', 'B', 'C', 'D', 'E', 'F'].map(value => ({ value, label: `Option ${value}` }));

const unevenOptions = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C (this option label is very long and can cause an overflow)' },
];

interface PermutationProps extends TableProps.EditConfig<unknown> {
  isEditing: boolean;
  interactiveCell: boolean;
  successfulEdit?: boolean;
  disabledReason?: () => string;
}

const editPermutations = createPermutations<PermutationProps>([
  {
    ariaLabel: ['Editable column'],
    editIconAriaLabel: ['editable'],
    errorIconAriaLabel: ['Error'],
    editingCell: [
      () => <Input value="editing" onChange={() => {}} />,
      () => (
        <Multiselect
          options={options}
          selectedOptions={[options[2]]}
          placeholder="Choose an option"
          deselectAriaLabel={() => 'Dismiss'}
        />
      ),
    ],
    constraintText: [undefined, 'This requirement needs to be met.'],
    validation: [undefined, () => 'There was an error!'],
    isEditing: [true],
    interactiveCell: [false],
  },
  {
    ariaLabel: ['Editable column'],
    editIconAriaLabel: ['editable'],
    errorIconAriaLabel: ['Error'],
    editingCell: [() => null],
    constraintText: [undefined],
    validation: [undefined],
    isEditing: [false],
    interactiveCell: [false, true],
    successfulEdit: [false, true],
  },
  {
    ariaLabel: ['Editable column'],
    editIconAriaLabel: ['editable'],
    errorIconAriaLabel: ['Error'],
    editingCell: [() => null],
    constraintText: [undefined],
    validation: [undefined],
    isEditing: [false],
    interactiveCell: [false, true],
    disabledReason: [() => 'Disabled reason popover content'],
  },
  // Select overflow permutation
  {
    ariaLabel: ['Editable column'],
    editIconAriaLabel: ['editable'],
    errorIconAriaLabel: ['Error'],
    editingCell: [
      () => <Select options={unevenOptions} selectedOption={unevenOptions[2]} placeholder="Choose an option" />,
      () => <Multiselect options={unevenOptions} selectedOptions={[unevenOptions[2]]} placeholder="Choose an option" />,
    ],
    constraintText: [undefined],
    validation: [undefined],
    isEditing: [true],
    interactiveCell: [false],
  },
]);

export default function InlineEditorPermutations() {
  const stickyState = useStickyColumns({ visibleColumns: ['id'], stickyColumnsFirst: 0, stickyColumnsLast: 0 });
  return (
    <>
      <h1>Table inline editor permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={editPermutations}
          render={permutation => (
            <Box>
              <table style={{ tableLayout: 'fixed', width: 300 }}>
                <tbody>
                  <tr>
                    <TableBodyCell
                      ariaLabels={{
                        activateEditLabel: column => `Edit ${column.header}`,
                        cancelEditLabel: column => `Cancel editing ${column.header}`,
                        submitEditLabel: column => `Submit edit ${column.header}`,
                        successfulEditLabel: () => 'Edit successful',
                      }}
                      item={{}}
                      column={{ ...baseColumnDefinition, editConfig: permutation }}
                      isEditable={true}
                      isFirstRow={false}
                      isLastRow={false}
                      isNextSelected={false}
                      isPrevSelected={false}
                      isSelected={false}
                      onEditStart={() => {}}
                      onEditEnd={() => {}}
                      wrapLines={false}
                      columnId="id"
                      colIndex={0}
                      stickyState={stickyState}
                      resizableColumns={true}
                      tableRole="grid"
                      {...permutation}
                    />
                  </tr>
                </tbody>
              </table>
            </Box>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
