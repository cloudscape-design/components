// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { TableBodyCell } from '~components/table/body-cell';
import { TableProps } from '~components/table';
import SpaceBetween from '~components/space-between';
import Input from '~components/input';
import Multiselect from '~components/multiselect';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const baseColumnDefinition = { cell: () => 'Cell content', header: 'Column header' };

const options = ['A', 'B', 'C', 'D', 'E', 'F'].map(value => ({ value, label: `Option ${value}` }));

const editPermutations = createPermutations<TableProps.EditConfig<unknown>>([
  {
    ariaLabel: ['Editable column'],
    editIconAriaLabel: ['editable'],
    errorIconAriaLabel: ['Error'],
    editingCell: [
      () => <Input value="editing" />,
      () => <Multiselect options={options} selectedOptions={[options[2]]} placeholder="Choose an option" />,
    ],
    constraintText: [undefined, 'This requirement needs to be met.'],
    validation: [undefined, () => 'There was an error!'],
  },
]);

export default function InlineEditorPermutations() {
  return (
    <>
      <h1>Table inline editor permutations</h1>
      <ScreenshotArea>
        <SpaceBetween size="xs">
          <PermutationsView
            permutations={editPermutations}
            render={permutation => (
              <TableBodyCell
                ariaLabels={{
                  activateEditLabel: column => `Edit ${column.header}`,
                  cancelEditLabel: column => `Cancel editing ${column.header}`,
                  submitEditLabel: column => `Submit edit ${column.header}`,
                }}
                item={{}}
                column={{ ...baseColumnDefinition, editConfig: permutation }}
                isEditing={true}
                isEditable={true}
                isFirstRow={false}
                isLastRow={false}
                isNextSelected={false}
                isPrevSelected={false}
                isSelected={false}
                onEditStart={() => {}}
                onEditEnd={() => {}}
                wrapLines={false}
                {...permutation}
              />
            )}
          />
        </SpaceBetween>
      </ScreenshotArea>
    </>
  );
}
