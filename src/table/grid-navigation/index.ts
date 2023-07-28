// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// TODO: add extensive unit tests
// TODO: add test page with a custom table
// TODO: implement keyboard support from here: https://www.w3.org/WAI/ARIA/apg/patterns/grid/examples/data-grids/
// TODO: make sure all ARIA attributes are set accordingly
// TODO: define the page size
// TODO: hidden grid navigation API to be reviewed and exposed publicly

// TODO: implement the following focusing behavior:
// When a cell does not have focusable elements - focus cell
// When a cell does have at least one focusable element - focus the first
// When focus leaves the cell focus on the next/prev cell
// The grid has one tab stop - can navigate inside with array keys but not tab
// Screen-reader user experience is unchanged
