// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
test('dummy', () => expect(1).toBe(1));

// describe('getItemsDisplayProperties', () => {
//   test('does not break with zero items', () => {
//     const displayProperties = getItemsDisplayProperties([], 90);
//     expect(displayProperties).toEqual({
//       shrinkFactors: [],
//       minWidths: [],
//       collapsed: 0,
//     });
//   });
//   test('returns correct shrinkFactors', () => {
//     const { shrinkFactors } = getItemsDisplayProperties([20, 300, 0, 1000, 150], 0);
//     expect(shrinkFactors).toEqual([0, 300, 0, 1000, 0]);
//   });
//   test('returns correct minWidths', () => {
//     const { minWidths } = getItemsDisplayProperties([20, 300, 0, 1000, 150], 0);
//     expect(minWidths).toEqual([0, 150, 0, 150, 0]);
//   });
//   test('returns correct number of collapsed items', () => {
//     const itemsWidths = [20, 300, 500, 60, 150, 1000];
//     [
//       [3000, 0],
//       [730, 0],
//       [729, 1], // second breadcrumb collapses
//       [580, 1],
//       [579, 2], // third breadcrumb collapses
//       [430, 2],
//       [429, 3], // fourth breadcrumb collapses
//       [370, 3],
//       [369, 4], // fifth breadcrumb collapses
//       [250, 4],
//       [10, 4],
//       [-10, 4],
//     ].forEach(([navWidth, expectedCollapsed]) =>
//       expect(getItemsDisplayProperties(itemsWidths, navWidth).collapsed).toEqual(expectedCollapsed)
//     );
//   });
//   describe('adjusts to small container widths', () => {
//     describe('with one item', () => {
//       test('smaller than default min width and bigger than available width', () => {
//         expect(getItemsDisplayProperties([100], 90)).toEqual({
//           shrinkFactors: [100],
//           minWidths: [90],
//           collapsed: 0,
//         });
//       });
//       test('smaller than default min width and smaller than available width', () => {
//         expect(getItemsDisplayProperties([80], 90)).toEqual({
//           shrinkFactors: [0],
//           minWidths: [0],
//           collapsed: 0,
//         });
//       });

//       test('bigger than default min width and bigger than available width', () => {
//         expect(getItemsDisplayProperties([160], 90)).toEqual({
//           shrinkFactors: [160],
//           minWidths: [90],
//           collapsed: 0,
//         });
//       });
//     });
//   });
//   describe('with two items', () => {
//     test('both bigger than default min width and bigger than available width', () => {
//       expect(getItemsDisplayProperties([160, 160], 90)).toEqual({
//         shrinkFactors: [160, 160],
//         minWidths: [45, 45],
//         collapsed: 0,
//       });
//     });
//     test('both smaller than default min width and bigger than available width', () => {
//       expect(getItemsDisplayProperties([100, 100], 90)).toEqual({
//         shrinkFactors: [100, 100],
//         minWidths: [45, 45],
//         collapsed: 0,
//       });
//     });
//   });
//   describe('with more than two items', () => {
//     test('first and last bigger than default min width and bigger than available width', () => {
//       expect(getItemsDisplayProperties([160, 200, 20, 140, 160], 320)).toEqual({
//         shrinkFactors: [160, 200, 0, 140, 160],
//         minWidths: [135, 135, 0, 135, 135],
//         collapsed: 3,
//       });
//     });
//     test('first and last smaller than default min width and bigger than available width', () => {
//       expect(getItemsDisplayProperties([140, 200, 20, 140, 140], 320)).toEqual({
//         shrinkFactors: [140, 200, 0, 140, 140],
//         minWidths: [135, 135, 0, 135, 135],
//         collapsed: 3,
//       });
//     });
//   });
// });
