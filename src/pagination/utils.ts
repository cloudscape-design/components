// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// TODO [mjawors] _.range
export function range(from: number, to: number) {
  const result = [];
  for (let i = from; i <= to; i++) {
    result.push(i);
  }
  return result;
}

export function getPaginationState(currentPageIndex: number, totalPagesCount: number, isOpenEnd?: boolean) {
  // Total number of elements handled here
  const numberOfControls = 7;
  // Max number of controls that can be displayed on the left and right hand side of the current page.
  // Works only for odd numbers
  const leftDelta = Math.floor(numberOfControls / 2);
  let rightDelta = leftDelta;
  // upper and lower limits for pages range
  const lowerLimit = 2;
  let upperLimit = totalPagesCount - 1;

  if (isOpenEnd) {
    rightDelta++;
    upperLimit = totalPagesCount + 1;
  }

  // Left and right indices based on delta calculation
  let leftIndex = currentPageIndex - leftDelta;
  let rightIndex = currentPageIndex + rightDelta;

  // adjust page indexes if page index is too small
  if (leftIndex < lowerLimit) {
    rightIndex += lowerLimit - leftIndex;
    leftIndex = lowerLimit;
  }

  // adjust page indexes if page index is to big
  if (rightIndex > upperLimit) {
    leftIndex -= rightIndex - upperLimit;
    rightIndex = upperLimit;
  }

  // adjust indexes one more time to avoid out of range errors
  leftIndex = Math.max(leftIndex, 2);
  rightIndex = Math.min(rightIndex, upperLimit);

  // consider adding dots
  const leftDots = leftIndex > 2;
  const rightDots = isOpenEnd || rightIndex < upperLimit;

  if (leftDots) {
    leftIndex++;
  }

  if (rightDots) {
    rightIndex--;
  }

  return { leftDots, rightDots, leftIndex, rightIndex };
}
