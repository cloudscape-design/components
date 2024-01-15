// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import Option, { OptionProps } from '../../../../../lib/components/internal/components/option';
import { OptionDefinition } from '../../../../../lib/components/internal/components/option/interfaces';
import OptionWrapper from '../../../../../lib/components/test-utils/dom/internal/option';
import CheckboxWrapper from '../../../../../lib/components/test-utils/dom/checkbox';
import styles from '../../../../../lib/components/internal/components/option/styles.selectors.js';
import iconStyles from '../../../../../lib/components/icon/styles.selectors.js';

function renderOption(props: OptionProps = {}): OptionWrapper {
  const renderResult = render(<Option {...props} />);
  const optionElement = renderResult.container.querySelector<HTMLElement>(`.${OptionWrapper.rootSelector}`)!;
  return new OptionWrapper(optionElement);
}

const checkTags = (optionWrapper: OptionWrapper, expected: string[]) => {
  const actualElements = optionWrapper.findTags()?.map(wrappedElement => wrappedElement.getElement()) || [];
  expect(actualElements).toHaveLength(expected.length);
  actualElements.forEach((actual, index) => expect(actual).toHaveTextContent(expected[index]));
};

const checkMatches = (optionWrapper: OptionWrapper, count: number, text: string | RegExp) => {
  const highlighted = optionWrapper
    .findAllByClassName(styles['filtering-match-highlight'])
    .map(element => element.getElement());
  expect(highlighted).toHaveLength(count);
  highlighted.forEach(elm => expect(elm).toHaveTextContent(text));
};

const findIcon = (optionWrapper: OptionWrapper) => optionWrapper.findByClassName(styles.icon);

const findCheckbox = (optionWrapper: OptionWrapper) => {
  const checkboxElement = optionWrapper.findByClassName(CheckboxWrapper.rootSelector);
  return checkboxElement ? new CheckboxWrapper(checkboxElement.getElement()) : null;
};

describe('Option component', () => {
  const baseOption = {
    value: 'optionABC',
    label: 'ABC',
  };
  test('displays label', () => {
    const optionWrapper = renderOption({
      option: baseOption,
    });
    expect(optionWrapper.findLabel().getElement()).toHaveTextContent('ABC');
  });

  test('adds data-value and title attributes', () => {
    const optionWrapper = renderOption({
      option: baseOption,
    });
    expect(optionWrapper.getElement()).toHaveAttribute('title', 'ABC');
    expect(optionWrapper.getElement()).toHaveAttribute('data-value', 'optionABC');
  });

  test('does not display unwanted elements', () => {
    const optionWrapper = renderOption({
      option: baseOption,
    });

    expect(optionWrapper.findLabelTag()).toBeNull();
    expect(optionWrapper.findDescription()).toBeNull();
    expect(findIcon(optionWrapper)).toBeNull();
    expect(findCheckbox(optionWrapper)).toBeNull();
    checkTags(optionWrapper, []);
  });

  test('displays label tag', () => {
    const optionWrapper = renderOption({
      option: {
        ...baseOption,
        labelTag: 'labelTagABC',
      },
    });

    expect(optionWrapper.findLabelTag()!.getElement()).toHaveTextContent('labelTagABC');
  });

  test('displays description', () => {
    const optionWrapper = renderOption({
      option: {
        ...baseOption,
        description: 'descriptionABC',
      },
    });

    expect(optionWrapper.findDescription()!.getElement()).toHaveTextContent('descriptionABC');
  });

  test('displays tags', () => {
    const optionWrapper = renderOption({
      option: {
        ...baseOption,
        tags: ['firstTag', 'secondTag'],
      },
    });

    checkTags(optionWrapper, ['firstTag', 'secondTag']);
  });

  test('does not display filtering tags without a highlightText', () => {
    const optionWrapper = renderOption({
      option: {
        ...baseOption,
        filteringTags: ['firstTag', 'secondTag'],
      },
    });

    checkTags(optionWrapper, []);
  });

  describe('With value (for Autosuggest)', () => {
    const optionWithValueAndLabel = {
      option: {
        value: 'some value',
        label: 'some value - with label',
      },
    };

    const optionWithValueOnly = {
      option: {
        value: 'some value',
      },
    };
    test('uses label property', () => {
      const optionWrapper = renderOption(optionWithValueAndLabel);
      expect(optionWrapper.findLabel().getElement()).toHaveTextContent('some value - with label');
    });
    test('does not display unwanted elements', () => {
      const optionWrapper = renderOption(optionWithValueAndLabel);

      expect(optionWrapper.findLabelTag()).toBeNull();
      expect(optionWrapper.findDescription()).toBeNull();
      expect(findIcon(optionWrapper)).toBeNull();
      expect(findCheckbox(optionWrapper)).toBeNull();
      checkTags(optionWrapper, []);
    });

    test('uses value as label if label is undefined', () => {
      const optionWrapper = renderOption(optionWithValueOnly);

      expect(optionWrapper.findLabel().getElement()).toHaveTextContent('some value');
      expect(optionWrapper.getElement()).toHaveAttribute('title', 'some value');
    });

    test('uses value property for data-value', () => {
      const optionWrapper = renderOption(optionWithValueAndLabel);
      expect(optionWrapper.getElement()).toHaveAttribute('data-value', 'some value');
    });

    it('uses label property for title', () => {
      const optionWrapper = renderOption(optionWithValueAndLabel);
      expect(optionWrapper.getElement()).toHaveAttribute('title', 'some value - with label');
    });
  });

  describe('displays icon', () => {
    const findIconWithSize = (optionWrapper: OptionWrapper, size: string) => {
      return findIcon(optionWrapper)!.findByClassName(iconStyles[`size-${size}`]);
    };

    const baseOptionWithIcon: OptionDefinition = {
      ...baseOption,
      iconName: 'close',
    };
    test('with name, url, alt', () => {
      const optionWrapper = renderOption({
        option: {
          ...baseOptionWithIcon,
          iconUrl: 'iconUrl',
          iconAlt: 'iconAlt',
        },
      });
      const icon = findIcon(optionWrapper)!;
      expect(icon.find('img')!.getElement()).toHaveAttribute('alt', 'iconAlt');
      expect(icon.find('img')!.getElement()).toHaveAttribute('src', 'iconUrl');
    });

    test('in normal size if description or tags are not set', () => {
      const optionWrapper = renderOption({
        option: baseOptionWithIcon,
      });

      expect(findIconWithSize(optionWrapper, 'normal')).not.toBeNull();
    });

    test('in big variant if description is set', () => {
      const optionWrapper = renderOption({
        option: {
          ...baseOptionWithIcon,
          description: 'desc',
        },
      });
      expect(findIconWithSize(optionWrapper, 'big')).not.toBeNull();
    });
    test('in big variant if tags are set', () => {
      const optionWrapper = renderOption({
        option: {
          ...baseOptionWithIcon,
          tags: ['first'],
        },
      });
      expect(findIconWithSize(optionWrapper, 'big')).not.toBeNull();
    });
    test('with custom icon', () => {
      const __customIcon = <span className="custom-icon" />;

      const optionWrapper = renderOption({
        option: {
          ...baseOption,
          __customIcon,
        },
      });

      expect(findIcon(optionWrapper)).toBeNull();
      expect(optionWrapper.find('.custom-icon')).not.toBeNull();
    });
    test('with custom svg icon', () => {
      const optionWrapper = renderOption({
        option: {
          ...baseOption,
          iconSvg: (
            <svg className="test-svg">
              <circle cx="8" cy="8" r="7" />
            </svg>
          ),
        },
      });

      expect(optionWrapper.findByClassName('test-svg')).not.toBeNull();
    });
  });

  describe('with highlightText', () => {
    test('highlights the matching parts', () => {
      const optionWrapper = renderOption({
        option: {
          label: 'aaa',
          labelTag: 'aaa tag',
          value: '1',
          description: 'aaa bbb',
          tags: ['aaa'],
          filteringTags: ['aaa'],
        },
        highlightText: 'aaa',
      });
      checkMatches(optionWrapper, 5, 'aaa');
    });
    test('highlights the matching parts regardless of case', () => {
      const optionWrapper = renderOption({
        option: {
          label: 'aaa',
          labelTag: 'aAa tag',
          value: '1',
          description: 'aAa bbb',
          tags: ['aaA'],
          filteringTags: ['aaa'],
        },
        highlightText: 'aaa',
      });
      checkMatches(optionWrapper, 5, /aaa/i);
    });
    test('displays filteringTags when they match', () => {
      const optionWrapper = renderOption({
        option: {
          label: 'aaa',
          value: '1',
          filteringTags: ['bbb', 'ccc'],
        },
        highlightText: 'bbb',
      });
      checkMatches(optionWrapper, 1, 'bbb');
      checkTags(optionWrapper, ['bbb']);
    });
    test('highlights the matching parts even if disabled', () => {
      const optionWrapper = renderOption({
        option: {
          label: 'aaa',
          labelTag: 'aaa tag',
          value: '1',
          description: 'aaa bbb',
          tags: ['aaa'],
          filteringTags: ['aaa'],
          disabled: true,
        },
        highlightText: 'aaa',
      });
      checkMatches(optionWrapper, 5, 'aaa');
    });
    test('can match regexp special characters', () => {
      const optionWrapper = renderOption({
        option: {
          label: 'This is regexp stuff ^${}[]().*+?<>-& ',
          value: '1',
        },
        highlightText: '^${}[]().*+?<>-&',
      });
      checkMatches(optionWrapper, 1, '^${}[]().*+?<>-&');
    });
    test('skips highlighting if the label text is too long', () => {
      const optionWrapper = renderOption({
        option: {
          label: 'a'.repeat(1000000),
          value: '1',
        },
        highlightText: 'a'.repeat(500000),
      });
      checkMatches(optionWrapper, 0, '');
    });
  });
});

describe('runtime warnings', () => {
  let consoleWarnSpy: jest.SpyInstance;
  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  test('warns about non-string label value', () => {
    renderOption({
      option: {
        // @ts-expect-error this should not be allowed in types
        label: <span>test</span>,
      },
    });
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('This component only supports string values, but "option.label" has object type.')
    );
  });

  test('warns about non-string values in tags array', () => {
    consoleWarnSpy.mockReset();
    renderOption({
      option: {
        label: 'test',
        // @ts-expect-error this should not be allowed in types
        tags: ['plain tag', <i key={1}>formatted tag</i>],
      },
    });
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('This component only supports string values, but "option.tags[1]" has object type')
    );
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
  });
});
