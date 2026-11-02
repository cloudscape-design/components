// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// TEMPORARY harness (never committed). Renders the shared listbox row for a matrix of cases and
// writes document.body.innerHTML per case to $ITEM_HTML_OUT, so the output at two commits can be diffed.
// Copy into src/internal/components/listbox/__tests__/ to run; delete afterwards.
import * as React from 'react';
import * as fs from 'fs';
import { act, cleanup, render } from '@testing-library/react';

import Item from '../../../../../lib/components/internal/components/listbox/parts/item';

// Same mocks as src/select/__tests__/disabled.test.tsx, so the tooltip renders deterministically.
jest.mock('../../../../../lib/components/popover/utils/positions', () => {
  const originalModule = jest.requireActual('../../../../../lib/components/popover/utils/positions');
  return {
    ...originalModule,
    getOffsetDimensions: () => ({ offsetWidth: 136, offsetHeight: 44 }),
    isCenterOutside: () => true,
  };
});

type Case = { name: string; props: any };

const OUT = process.env.ITEM_HTML_OUT;

const contents: Record<string, any> = {
  basic: { value: 'opt-1', label: 'Option one' },
  rich: {
    value: 'opt-1',
    label: 'Option one',
    labelTag: 'tag',
    description: 'Description of option',
    tags: ['t1', 't2'],
    filteringTags: ['ft1'],
    iconName: 'settings',
    secondaryText: 'secondary',
  },
};

const parentDropdownOption = {
  type: 'parent',
  option: { label: 'Group one', options: [{ value: 'opt-1', label: 'Option one' }] },
};

// Disabled variants: wrapped option disabled (with/without reason), DropdownOption disabled
// (with/without DropdownOption-level reason, which only Multiselect reads).
const disabledVariants: Record<string, (dropdown: any) => any> = {
  enabled: d => d,
  wrappedDisabled: d => ({ ...d, option: { ...d.option, disabled: true } }),
  wrappedDisabledReason: d => ({ ...d, option: { ...d.option, disabled: true, disabledReason: 'Wrapped reason' } }),
  enabledWithReason: d => ({ ...d, option: { ...d.option, disabledReason: 'Unused reason' } }),
  dropdownDisabled: d => ({ ...d, disabled: true }),
  dropdownDisabledReason: d => ({ ...d, disabled: true, disabledReason: 'Dropdown reason' }),
};

const renderOptions: Record<string, any> = {
  none: undefined,
  fn: ({ item, filterText }: any) => (
    <span data-args={JSON.stringify({ item, filterText })} className="custom-render">
      custom
    </span>
  ),
  nullReturn: () => null,
};

const highlights: Record<string, any> = {
  none: { highlighted: false },
  keyboard: { highlighted: true, highlightType: 'keyboard' },
  mouse: { highlighted: true, highlightType: 'mouse' },
};

function makeOption(type: string, content: any) {
  if (type === 'parent') {
    return { type: 'parent', option: { label: content.label, options: [content] } };
  }
  if (type === 'select-all') {
    return { type: 'select-all', option: { label: 'Select all' } };
  }
  if (type === 'option') {
    return { option: content };
  }
  return { type, option: content };
}

function buildCases(): Case[] {
  const cases: Case[] = [];
  const modes = ['single', 'multi', 'default'];
  const types = ['option', 'child', 'parent', 'select-all', 'use-entered'];

  // Core cartesian matrix.
  for (const mode of modes) {
    for (const type of types) {
      if (type === 'select-all' && mode !== 'multi') {
        continue;
      }
      for (const [contentName, content] of Object.entries(contents)) {
        for (const selected of [false, true]) {
          for (const indeterminate of [false, true]) {
            for (const [hName, h] of Object.entries(highlights)) {
              for (const [dName, d] of Object.entries(disabledVariants)) {
                for (const [rName, renderOption] of Object.entries(renderOptions)) {
                  for (const filteringValue of [undefined, 'opt']) {
                    const option = d(makeOption(type, content));
                    cases.push({
                      name: [mode, type, contentName, `sel=${selected}`, `ind=${indeterminate}`, `hl=${hName}`, dName, `ro=${rName}`, `f=${filteringValue}`].join('|'),
                      props: {
                        index: 3,
                        virtualIndex: 5,
                        option,
                        ...(mode === 'default' ? {} : { selectionType: mode }),
                        selected,
                        indeterminate,
                        ...h,
                        renderOption,
                        filteringValue,
                        parentProps:
                          type === 'child'
                            ? {
                                index: 0,
                                virtualIndex: 1,
                                option: parentDropdownOption,
                                disabled: false,
                                indeterminate: true,
                                highlighted: false,
                                selected: true,
                              }
                            : undefined,
                      },
                    });
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // Row-shell props matrix.
  const shells: Record<string, any> = {
    plain: {},
    sticky: { sticky: true },
    stickyVirtual: { sticky: true, virtualPosition: 40 },
    virtual: { virtualPosition: 40 },
    virtualPadBottom: { virtualPosition: 80, padBottom: true },
    padBottom: { padBottom: true },
    neighbors: { isNextSelected: true, isPreviousSelected: true },
    next: { isNextSelected: true },
    prev: { isPreviousSelected: true },
    scrollbar: { withScrollbar: true },
    a11y: { ariaPosinset: 2, ariaSetsize: 9, screenReaderContent: 'Announce this' },
    posinsetOnly: { ariaPosinset: 2 },
    baseProps: { className: 'custom-class', id: 'custom-id', 'data-testid': 'row', 'data-foo': 'bar' },
    afterHeader: { afterHeaderOnOption: true },
    all: {
      sticky: true,
      virtualPosition: 40,
      padBottom: true,
      isNextSelected: true,
      isPreviousSelected: true,
      withScrollbar: true,
      ariaPosinset: 2,
      ariaSetsize: 9,
      screenReaderContent: 'Announce this',
      className: 'custom-class',
      'data-testid': 'row',
      afterHeaderOnOption: true,
    },
  };
  for (const mode of modes) {
    for (const type of types) {
      if (type === 'select-all' && mode !== 'multi') {
        continue;
      }
      for (const [sName, shell] of Object.entries(shells)) {
        for (const selected of [false, true]) {
          for (const [hName, h] of Object.entries(highlights)) {
            for (const dName of ['enabled', 'wrappedDisabledReason', 'dropdownDisabledReason']) {
              const { afterHeaderOnOption, ...shellProps } = shell;
              let option = disabledVariants[dName](makeOption(type, contents.basic));
              if (afterHeaderOnOption) {
                option = { ...option, afterHeader: true };
              }
              cases.push({
                name: [mode, type, `shell=${sName}`, `sel=${selected}`, `hl=${hName}`, dName].join('|'),
                props: {
                  index: 1,
                  option,
                  ...(mode === 'default' ? {} : { selectionType: mode }),
                  selected,
                  indeterminate: type === 'parent' || type === 'select-all',
                  ...h,
                  ...shellProps,
                },
              });
            }
          }
        }
      }
    }
  }
  return cases;
}

test('item html matrix', async () => {
  const cases = buildCases();
  const out: Record<string, string> = {};
  for (const c of cases) {
    const ref = React.createRef<HTMLDivElement>();
    render(<Item {...c.props} ref={ref} />);
    await act(async () => {
      await Promise.resolve();
    });
    out[c.name] = document.body.innerHTML + `\n<!--ref:${ref.current ? ref.current.className : 'null'}-->`;
    cleanup();
  }
  expect(Object.keys(out).length).toBe(cases.length);
  if (OUT) {
    fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  }
}, 1_800_000);
