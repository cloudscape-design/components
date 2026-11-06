// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { OptionDefinition, OptionGroup } from '../../../../types/option';
import { DropdownOption } from '../../option/interfaces';
import { flattenOptions } from '../../option/utils/flatten-options';
import { getListboxNavigation } from '../utils/navigation';

const flatten = (options: ReadonlyArray<OptionDefinition | OptionGroup>) => flattenOptions(options).flatOptions;

const flat = flatten([{ value: '1' }, { value: '2' }, { value: '3' }]);
// [header A, a1, a2, header B, b1]
const grouped = flatten([
  { label: 'A', options: [{ value: 'a1' }, { value: 'a2' }] },
  { label: 'B', options: [{ value: 'b1' }] },
]);
// [1, header Empty]
const endsWithEmptyGroup = flatten([{ value: '1' }, { label: 'Empty', options: [] }]);

function setup(options: ReadonlyArray<DropdownOption>, highlightedIndex: number, interactiveGroups = false) {
  const moveHighlight = jest.fn();
  const goHome = jest.fn();
  const goEnd = jest.fn();
  const navigation = getListboxNavigation({
    options,
    highlightedIndex,
    highlightedOption: options[highlightedIndex],
    interactiveGroups,
    moveHighlight,
    goHome,
    goEnd,
  });
  return { ...navigation, moveHighlight, goHome, goEnd };
}

describe('getListboxNavigation', () => {
  test('moves the highlight by one option', () => {
    const { goUp, goDown, moveHighlight } = setup(flat, 1);
    goDown();
    expect(moveHighlight).toHaveBeenLastCalledWith(1);
    goUp();
    expect(moveHighlight).toHaveBeenLastCalledWith(-1);
  });

  test('wraps from the first option to the end and from the last option to the start', () => {
    const first = setup(flat, 0);
    first.goUp();
    expect(first.goEnd).toHaveBeenCalledTimes(1);
    expect(first.moveHighlight).not.toHaveBeenCalled();

    const last = setup(flat, 2);
    last.goDown();
    expect(last.goHome).toHaveBeenCalledTimes(1);
    expect(last.moveHighlight).not.toHaveBeenCalled();
  });

  test('wraps up from the first child of a leading group when groups are not interactive', () => {
    const { goUp, goEnd, moveHighlight } = setup(grouped, 1);
    goUp();
    expect(goEnd).toHaveBeenCalledTimes(1);
    expect(moveHighlight).not.toHaveBeenCalled();
  });

  test('moves up to the leading group header when groups are interactive', () => {
    const { goUp, goEnd, moveHighlight } = setup(grouped, 1, true);
    goUp();
    expect(goEnd).not.toHaveBeenCalled();
    expect(moveHighlight).toHaveBeenCalledWith(-1);
  });

  test('wraps down only from the last row, even when it is not highlightable', () => {
    const { goDown, goHome, moveHighlight } = setup(endsWithEmptyGroup, 0);
    goDown();
    expect(goHome).not.toHaveBeenCalled();
    expect(moveHighlight).toHaveBeenCalledWith(1);
  });

  test('moves down from no highlight', () => {
    const { goDown, goHome, moveHighlight } = setup(flat, -1);
    goDown();
    expect(goHome).not.toHaveBeenCalled();
    expect(moveHighlight).toHaveBeenCalledWith(1);
  });
});
