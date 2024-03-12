// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { TableBodyCell } from '~components/table/body-cell';
import { TableProps } from '~components/table';
import Input from '~components/input';
import Multiselect from '~components/multiselect';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { useStickyColumns } from '~components/table/sticky-columns';
import { Box } from '~components';

const baseColumnDefinition = {
  cell: () => <Box>Cell content</Box>,
  header: 'Column header',
};

const options = ['A', 'B', 'C', 'D', 'E', 'F'].map(value => ({ value, label: `Option ${value}` }));

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
            <table>
              <tbody>
                <tr>
                  <TableBodyCell
                    ariaLabels={{
                      activateEditLabel: column => `Edit ${column.header}`,
                      cancelEditLabel: column => `Cancel editing ${column.header}`,
                      submitEditLabel: column => `Submit edit ${column.header}`,
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
                    tableRole="grid"
                    {...permutation}
                  />
                </tr>
              </tbody>
            </table>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
