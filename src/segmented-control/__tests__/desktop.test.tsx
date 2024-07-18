// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import SegmentedControl, { SegmentedControlProps } from '../../../lib/components/segmented-control';
import { SegmentedControlWrapper } from '../../../lib/components/test-utils/dom';
import { renderSegmentedControl } from './utils';

import styles from '../../../lib/components/segmented-control/styles.css.js';

const defaultOptions: SegmentedControlProps.Option[] = [
  { text: 'Segment-1', iconName: 'settings', id: 'seg-1' },
  { text: '', iconName: 'settings', iconAlt: 'Icon for Segment-2', id: 'seg-2' },
  { text: 'Segment-3', id: 'seg-3', disabled: true },
  { text: 'Segment-4', iconName: 'settings', id: 'seg-4' },
];

const getSegmentWrapper = function (wrapper: SegmentedControlWrapper, segmentIndex: number) {
  return wrapper.findSegments()[segmentIndex];
};

test('renders segments', () => {
  const { segmentedControlWrapper } = renderSegmentedControl(
    <SegmentedControl selectedId="seg-1" options={defaultOptions} />
  );
  expect(segmentedControlWrapper.findSegments()).toHaveLength(4);
});

describe('Segmented-Control Properties', () => {
  test('does not have a label attribute by default without being set', () => {
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-1" options={defaultOptions} />
    );
    expect(segmentedControlWrapper.findByClassName(styles['segment-part'])!.getElement()).not.toHaveAttribute(
      'aria-label'
    );
  });

  test('does have a label attribute when it is set', () => {
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-1" options={defaultOptions} label="Some label" />
    );
    expect(segmentedControlWrapper.findByClassName(styles['segment-part'])!.getElement()).toHaveAttribute(
      'aria-label',
      'Some label'
    );
  });

  test('does not have ariaLabelledby attribute by default without being set', () => {
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-1" options={defaultOptions} />
    );
    expect(segmentedControlWrapper.findByClassName(styles['segment-part'])!.getElement()).not.toHaveAttribute(
      'aria-labelledby'
    );
  });

  test('does have a ariaLabelledby attribute after it is set', () => {
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-1" options={defaultOptions} ariaLabelledby="Some ariaLabelledby" />
    );
    expect(segmentedControlWrapper.findByClassName(styles['segment-part'])!.getElement()).toHaveAttribute(
      'aria-labelledby',
      'Some ariaLabelledby'
    );
  });
});

describe('Invidual Segment Properties', () => {
  test('each segment has button property attribute', () => {
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-1" options={defaultOptions} />
    );
    expect(getSegmentWrapper(segmentedControlWrapper, 0).getElement()).toHaveAttribute('type', 'button');
  });

  test('each segment is not disabled by default', () => {
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-1" options={defaultOptions} />
    );
    expect(getSegmentWrapper(segmentedControlWrapper, 0).getElement()).not.toHaveAttribute('disabled');
  });

  test('each segment is disabled if disabled is set as true', () => {
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-1" options={defaultOptions} />
    );
    expect(getSegmentWrapper(segmentedControlWrapper, 2).getElement()).toHaveAttribute('disabled');
  });
});

describe('icon property', () => {
  test('renders icon when iconName is provided', () => {
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-1" options={defaultOptions} />
    );
    expect(getSegmentWrapper(segmentedControlWrapper, 1).findIcon()).not.toBeNull();
  });
});

describe('Segment disabled property', () => {
  test('does not fire onChange event when disabled', () => {
    const onChange = jest.fn();
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-1" options={defaultOptions} onChange={onChange} />
    );
    getSegmentWrapper(segmentedControlWrapper, 2).getElement().click();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('does fire onChange event when not disabled', () => {
    const onChange = jest.fn();
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-2" options={defaultOptions} onChange={onChange} />
    );
    getSegmentWrapper(segmentedControlWrapper, 0).getElement().click();
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { selectedId: 'seg-1' } }));
  });

  describe('Disabled with reason', () => {
    test('should behave as normal when disabledReason is provided without disabled: true', () => {
      const onChange = jest.fn();
      const { segmentedControlWrapper } = renderSegmentedControl(
        <SegmentedControl
          selectedId="seg-2"
          options={defaultOptions.map(option => {
            if (option.id === 'seg-2') {
              return {
                ...option,
                disabledReason: 'disabled reason',
              };
            }

            return option;
          })}
          onChange={onChange}
        />
      );

      expect(segmentedControlWrapper.findSegmentById('seg-2')!.getElement()).not.toHaveAttribute(
        'aria-disabled',
        'true'
      );

      segmentedControlWrapper.findSegmentById('seg-2')!.focus();

      expect(segmentedControlWrapper.findSegmentById('seg-2')!.findDisabledReason()).toBe(null);

      segmentedControlWrapper.findSegmentById('seg-1')!.click();

      expect(onChange).toHaveBeenCalled();
    });

    test('has no disabled attribute when disabled with reason', () => {
      const { segmentedControlWrapper } = renderSegmentedControl(
        <SegmentedControl
          selectedId="seg-2"
          options={defaultOptions.map(option => {
            if (option.id === 'seg-2') {
              return {
                ...option,
                disabled: true,
                disabledReason: 'disabled reason',
              };
            }

            return option;
          })}
        />
      );
      expect(segmentedControlWrapper.findSegmentById('seg-2')!.getElement()).not.toHaveAttribute('disabled');
    });

    test('has aria-disabled property when disabled with reason', () => {
      const { segmentedControlWrapper } = renderSegmentedControl(
        <SegmentedControl
          selectedId="seg-2"
          options={defaultOptions.map(option => {
            if (option.id === 'seg-2') {
              return {
                ...option,
                disabled: true,
                disabledReason: 'disabled reason',
              };
            }

            return option;
          })}
        />
      );
      expect(segmentedControlWrapper.findSegmentById('seg-2')!.getElement()).toHaveAttribute('aria-disabled', 'true');
    });

    test('has no tooltip open by default', () => {
      const { segmentedControlWrapper } = renderSegmentedControl(
        <SegmentedControl
          selectedId="seg-2"
          options={defaultOptions.map(option => {
            if (option.id === 'seg-2') {
              return {
                ...option,
                disabled: true,
                disabledReason: 'disabled reason',
              };
            }

            return option;
          })}
        />
      );
      expect(segmentedControlWrapper.findSegmentById('seg-2')!.findDisabledReason()).toBe(null);
    });

    test('has no tooltip without disabledReason', () => {
      const { segmentedControlWrapper } = renderSegmentedControl(
        <SegmentedControl
          selectedId="seg-1"
          options={defaultOptions.map(option => {
            if (option.id === 'seg-2') {
              return {
                ...option,
                disabled: true,
              };
            }

            return option;
          })}
        />
      );

      segmentedControlWrapper.findSegmentById('seg-2')!.focus();

      expect(segmentedControlWrapper.findSegmentById('seg-2')!.findDisabledReason()).toBe(null);
    });

    test('open tooltip on focus', () => {
      const { segmentedControlWrapper } = renderSegmentedControl(
        <SegmentedControl
          selectedId="seg-1"
          options={defaultOptions.map(option => {
            if (option.id === 'seg-2') {
              return {
                ...option,
                disabled: true,
                disabledReason: 'disabled reason',
              };
            }

            return option;
          })}
        />
      );

      segmentedControlWrapper.findSegmentById('seg-2')!.focus();

      expect(segmentedControlWrapper.findSegmentById('seg-2')!.findDisabledReason()!.getElement()).toHaveTextContent(
        'disabled reason'
      );
    });

    test('closes tooltip on blur', () => {
      const { segmentedControlWrapper } = renderSegmentedControl(
        <SegmentedControl
          selectedId="seg-1"
          options={defaultOptions.map(option => {
            if (option.id === 'seg-2') {
              return {
                ...option,
                disabled: true,
                disabledReason: 'disabled reason',
              };
            }

            return option;
          })}
        />
      );

      segmentedControlWrapper.findSegmentById('seg-2')!.focus();

      expect(segmentedControlWrapper.findSegmentById('seg-2')!.findDisabledReason()!.getElement()).toHaveTextContent(
        'disabled reason'
      );

      segmentedControlWrapper.findSegmentById('seg-2')!.blur();

      expect(segmentedControlWrapper.findSegmentById('seg-2')!.findDisabledReason()).toBe(null);
    });

    test('open tooltip on mouseenter', () => {
      const { segmentedControlWrapper } = renderSegmentedControl(
        <SegmentedControl
          selectedId="seg-1"
          options={defaultOptions.map(option => {
            if (option.id === 'seg-2') {
              return {
                ...option,
                disabled: true,
                disabledReason: 'disabled reason',
              };
            }

            return option;
          })}
        />
      );

      fireEvent.mouseEnter(segmentedControlWrapper.findSegmentById('seg-2')!.getElement());

      expect(segmentedControlWrapper.findSegmentById('seg-2')!.findDisabledReason()!.getElement()).toHaveTextContent(
        'disabled reason'
      );
    });

    test('close tooltip on mouseleave', () => {
      const { segmentedControlWrapper } = renderSegmentedControl(
        <SegmentedControl
          selectedId="seg-1"
          options={defaultOptions.map(option => {
            if (option.id === 'seg-2') {
              return {
                ...option,
                disabled: true,
                disabledReason: 'disabled reason',
              };
            }

            return option;
          })}
        />
      );

      fireEvent.mouseEnter(segmentedControlWrapper.findSegmentById('seg-2')!.getElement());

      expect(segmentedControlWrapper.findSegmentById('seg-2')!.findDisabledReason()!.getElement()).toHaveTextContent(
        'disabled reason'
      );

      fireEvent.mouseLeave(segmentedControlWrapper.findSegmentById('seg-2')!.getElement());

      expect(segmentedControlWrapper.findSegmentById('seg-2')!.findDisabledReason()).toBe(null);
    });

    test('has no aria-describedby by default', () => {
      const { segmentedControlWrapper } = renderSegmentedControl(
        <SegmentedControl selectedId="seg-1" options={defaultOptions} />
      );

      expect(segmentedControlWrapper.findSegmentById('seg-2')!.getElement()).not.toHaveAttribute('aria-describedby');
    });

    test('has no aria-describedby without disabledReason', () => {
      const { segmentedControlWrapper } = renderSegmentedControl(
        <SegmentedControl
          selectedId="seg-1"
          options={defaultOptions.map(option => {
            if (option.id === 'seg-2') {
              return {
                ...option,
                disabled: true,
              };
            }

            return option;
          })}
        />
      );

      expect(segmentedControlWrapper.findSegmentById('seg-2')!.getElement()).not.toHaveAttribute('aria-describedby');
    });

    test('has aria-describedby with disabledReason', () => {
      const { segmentedControlWrapper } = renderSegmentedControl(
        <SegmentedControl
          selectedId="seg-1"
          options={defaultOptions.map(option => {
            if (option.id === 'seg-2') {
              return {
                ...option,
                disabled: true,
                disabledReason: 'disabled reason',
              };
            }

            return option;
          })}
        />
      );

      expect(segmentedControlWrapper.findSegmentById('seg-2')!.getElement()).toHaveAttribute('aria-describedby');
    });

    test('has hidden element (linked to aria-describedby) with disabledReason', () => {
      const { segmentedControlWrapper } = renderSegmentedControl(
        <SegmentedControl
          selectedId="seg-1"
          options={defaultOptions.map(option => {
            if (option.id === 'seg-2') {
              return {
                ...option,
                disabled: true,
                disabledReason: 'disabled reason',
              };
            }

            return option;
          })}
        />
      );

      expect(segmentedControlWrapper.findSegmentById('seg-2')!.find('span[hidden]')!.getElement()).toHaveTextContent(
        'disabled reason'
      );
    });

    test('does not trigger onChange on disabled with reason segment', () => {
      const onChange = jest.fn();
      const { segmentedControlWrapper } = renderSegmentedControl(
        <SegmentedControl
          selectedId="seg-1"
          options={defaultOptions.map(option => {
            if (option.id === 'seg-2') {
              return {
                ...option,
                disabled: true,
                disabledReason: 'disabled reason',
              };
            }

            return option;
          })}
          onChange={onChange}
        />
      );

      segmentedControlWrapper.findSegmentById('seg-2')!.click();

      expect(onChange).not.toHaveBeenCalled();
    });
  });
});

describe('selected property', () => {
  test('finds the selected segment', () => {
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-1" options={defaultOptions} />
    );
    expect(segmentedControlWrapper.findSelectedSegment()!.getElement()).toHaveTextContent('Segment-1');
  });

  test('does not fire onChange event when selected', () => {
    const onChange = jest.fn();
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-1" options={defaultOptions} onChange={onChange} />
    );
    getSegmentWrapper(segmentedControlWrapper, 0).getElement().click();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('does fire onChange event when not selected', () => {
    const onChange = jest.fn();
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-2" options={defaultOptions} onChange={onChange} />
    );
    getSegmentWrapper(segmentedControlWrapper, 0).getElement().click();
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { selectedId: 'seg-1' } }));
  });

  test('does change focus when left/right arrow key is pressed', () => {
    const { segmentedControlWrapper } = renderSegmentedControl(
      <SegmentedControl selectedId="seg-1" options={defaultOptions} />
    );

    getSegmentWrapper(segmentedControlWrapper, 0).getElement().focus();
    getSegmentWrapper(segmentedControlWrapper, 0).keydown(KeyCode.right);
    expect(getSegmentWrapper(segmentedControlWrapper, 1).getElement()).toHaveFocus();
    getSegmentWrapper(segmentedControlWrapper, 1).keydown(KeyCode.right);
    expect(getSegmentWrapper(segmentedControlWrapper, 3).getElement()).toHaveFocus();
    getSegmentWrapper(segmentedControlWrapper, 3).keydown(KeyCode.left);
    expect(getSegmentWrapper(segmentedControlWrapper, 1).getElement()).toHaveFocus();
  });
});
