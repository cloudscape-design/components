// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// const options = ['A', 'B', 'C', 'D', 'E', 'F'].map(value => ({ value, label: `Option ${value}` }));

// const editPermutations = createPermutations<TableProps.EditConfig<unknown>>([
//   {
//     ariaLabel: ['Editable column'],
//     editIconAriaLabel: ['editable'],
//     errorIconAriaLabel: ['Error'],
//     editingCell: [
//       () => <Input value="editing" onChange={() => {}} />,
//       () => (
//         <Multiselect
//           options={options}
//           selectedOptions={[options[2]]}
//           placeholder="Choose an option"
//           deselectAriaLabel={() => 'Dismiss'}
//         />
//       ),
//     ],
//     constraintText: [undefined, 'This requirement needs to be met.'],
//     validation: [undefined, () => 'There was an error!'],
//   },
// ]);

// const stickyColumnProperties = {
//   isSticky: false,
//   isLastStickyLeft: false,
//   isLastStickyRight: false,
//   stickyStyles: { sticky: {}, stuck: {} },
// };

// export default function InlineEditorPermutations() {
//   return (
//     <>
//       <h1>Table inline editor permutations</h1>
//       <ScreenshotArea>
//         <PermutationsView
//           permutations={editPermutations}
//           render={permutation => (
//             <table>
//               <tbody>
//                 <tr>
//                   <TableBodyCell
//                     ariaLabels={{
//                       activateEditLabel: column => `Edit ${column.header}`,
//                       cancelEditLabel: column => `Cancel editing ${column.header}`,
//                       submitEditLabel: column => `Submit edit ${column.header}`,
//                     }}
//                     item={{}}
//                     column={{ ...baseColumnDefinition, editConfig: permutation }}
//                     isEditing={true}
//                     isEditable={true}
//                     isFirstRow={false}
//                     isLastRow={false}
//                     isNextSelected={false}
//                     isPrevSelected={false}
//                     isSelected={false}
//                     onEditStart={() => {}}
//                     onEditEnd={() => {}}
//                     wrapLines={false}
//                     stickyColumnProperties={stickyColumnProperties}
//                     {...permutation}
//                   />
//                 </tr>
//               </tbody>
//             </table>
//           )}
//         />
//       </ScreenshotArea>
//     </>
//   );
// }
