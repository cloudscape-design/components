// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act } from 'react-dom/test-utils';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import DateInput, { DateInputProps } from '../../../lib/components/date-input';
import { displayToIso, formatDateLocalized } from '../../../lib/components/internal/utils/date-time';
import createWrapper from '../../../lib/components/test-utils/dom';
import { CalendarProps } from '../../calendar/interfaces';

import testStyles from '../../../lib/components/date-input/styles.css.js';

function renderDateInput(props: DateInputProps) {
  const onChangeSpy = jest.fn();
  const { container } = render(<DateInput onChange={onChangeSpy} {...props} />);
  const wrapper = createWrapper(container).findDateInput()!;
  return { wrapper, container, onChangeSpy };
}

interface GenerateValueProps {
  locale?: string;
  format: DateInputProps.Format;
  inputFormat: DateInputProps.InputFormat;
  granularity: CalendarProps.Granularity;
  initValue: string;
  isFocused?: boolean;
}
function generateValue({
  locale = 'en-US',
  format,
  inputFormat,
  granularity,
  initValue,
  isFocused = false,
}: GenerateValueProps) {
  function renderSlashed(granularity: CalendarProps.Granularity, value: string) {
    if (granularity === 'month') {
      return value.split('-').slice(0, 2).join('/');
    }
    return value?.split('-').join('/');
  }

  function renderIso(granularity: CalendarProps.Granularity, value: string) {
    if (granularity === 'month') {
      return value.split('-').slice(0, 2).join('-');
    }
    return value;
  }

  switch (format) {
    case 'slashed':
      return renderSlashed(granularity, initValue);
    case 'iso':
      return renderIso(granularity, initValue);
    case 'long-localized':
      if (isFocused) {
        switch (inputFormat) {
          case 'slashed':
            return renderSlashed(granularity, initValue);
          case 'iso':
            return renderIso(granularity, initValue);
        }
      }

      return formatDateLocalized({
        date: displayToIso(initValue),
        hideTimeOffset: true,
        isDateOnly: true,
        isMonthOnly: granularity === 'month',
        locale,
      });
  }
}

describe('Date Input component', () => {
  beforeAll(() => {
    jest.resetModules();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe.each(['day', 'month'] as CalendarProps.Granularity[])('granularity of %s', granularity => {
    describe.each(['en-US', 'de'] as const)('locale of %s', locale => {
      describe.each(['iso', 'slashed', 'long-localized'] as DateInputProps.Format[])('Format of %s', format => {
        const inputFormatsToTest = format === 'long-localized' ? ['iso', 'slashed'] : [format];
        describe.each([...inputFormatsToTest] as DateInputProps.InputFormat[])(
          `${format === 'long-localized' ? '' : 'non-'}applicable inputFormat of %s`,
          inputFormat => {
            const isIso = format === 'iso' || (format === 'long-localized' && inputFormat === 'iso');
            const placeholder = `YYYY${isIso ? '-' : '/'}MM${granularity === 'day' ? `${isIso ? '-' : '/'}DD` : ''}`;
            const sharedProps = {
              format,
              placeholder,
              granularity,
              locale,
              inputFormat,
            };

            test('should disable browser autocorrect by default', () => {
              const { wrapper } = renderDateInput({ ...sharedProps, value: '' });
              const inputElement = wrapper.findNativeInput().getElement();
              expect(inputElement).toHaveAttribute('autoCorrect', 'off');
              expect(inputElement).toHaveAttribute('autoCapitalize', 'off');
            });

            test('should pass input props down to the native input', () => {
              const { wrapper } = renderDateInput({
                ...sharedProps,
                value: '',
                ariaLabel: 'ariaLabel',
                ariaDescribedby: 'ariaDescribedby',
                ariaLabelledby: 'ariaLabelledby',
                disabled: true,
                readOnly: true,
                controlId: 'custom-id',
              });

              expect((wrapper.getElement() as HTMLElement).getAttribute('data-format')).toBe(format);
              expect((wrapper.getElement() as HTMLElement).getAttribute('data-editable-format')).toBe(
                format === 'long-localized' ? inputFormat : format
              );
              const inputElement = wrapper.findNativeInput().getElement();
              expect(inputElement).toHaveAttribute('placeholder', placeholder);
              expect(inputElement).toHaveAttribute('aria-label', 'ariaLabel');
              expect(inputElement).toHaveAttribute('aria-describedby', 'ariaDescribedby');
              expect(inputElement).toHaveAttribute('aria-labelledby', 'ariaLabelledby');
              expect(inputElement).toHaveAttribute('autoComplete', 'off');
              expect(inputElement).toHaveAttribute('disabled');
              expect(inputElement).toHaveAttribute('readonly');
              expect(inputElement).toHaveAttribute('id', 'custom-id');
            });

            test('does accept values in ISO format', () => {
              const initValue = '2018-01-02';
              const { wrapper } = renderDateInput({ ...sharedProps, value: initValue });
              const expectedResult = generateValue({
                locale,
                format,
                inputFormat,
                granularity,
                initValue,
              });
              expect(wrapper.findNativeInput().getElement().value).toBe(expectedResult);
            });

            test('should not limit pasted value by the current month', async () => {
              const testValue = '2019/02/01';
              const { wrapper, onChangeSpy, container } = renderDateInput({
                ...sharedProps,
                value: testValue,
              });

              let targetInputElement = wrapper.findNativeInput()!.getElement();

              if (format === 'long-localized') {
                //focus on input & update state
                act(() => {
                  fireEvent.focus(targetInputElement);
                });

                const updatedWrapper = createWrapper(container).findDateInput()!;
                await waitFor(() => {
                  //assert value is updated into editable format
                  expect(updatedWrapper.getElement()!.classList.contains(testStyles['long-localized-focused'])).toBe(
                    true
                  );
                  targetInputElement = updatedWrapper.findNativeInput()!.getElement();
                });
              }

              targetInputElement.setSelectionRange(0, 0);
              fireEvent.paste(targetInputElement, {
                clipboardData: { getData: () => '2019/03/30' },
              });

              expect(onChangeSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                  detail: { value: `2019-03${granularity === 'day' ? '-30' : ''}` },
                })
              );
            });

            test('should not paste value when readonly', () => {
              const { wrapper, onChangeSpy } = renderDateInput({
                ...sharedProps,
                value: '2019/02/01',
                readOnly: true,
              });

              fireEvent.paste(wrapper.findNativeInput()!.getElement(), {
                clipboardData: { getData: () => '2019/03/30' },
              });

              expect(onChangeSpy).not.toHaveBeenCalled();
            });

            test('should not paste value when disabled', () => {
              const { wrapper, onChangeSpy } = renderDateInput({
                ...sharedProps,
                value: '2019/02/01',
                disabled: true,
              });

              fireEvent.paste(wrapper.findNativeInput()!.getElement(), {
                clipboardData: { getData: () => '2019/03/30' },
              });

              expect(onChangeSpy).not.toHaveBeenCalled();
            });

            describe('autocomplete', () => {
              ['-', '/', '.', ' '].forEach(separatorKey => {
                test(`should autocomplete using [${separatorKey}] key`, async () => {
                  const { wrapper, onChangeSpy } = renderDateInput({
                    ...sharedProps,
                    value: '1',
                  });

                  //focus to change to masked-input
                  if (format === 'long-localized') {
                    act(() => {
                      wrapper.findNativeInput()!.getElement().focus();
                    });
                    await waitFor(() => {
                      expect(wrapper!.getElement().classList).toContain(testStyles['long-localized-focused']);
                    });
                  }

                  //change value
                  act(() => {
                    fireEvent.keyDown(wrapper.findNativeInput()!.getElement(), { key: separatorKey });
                  });
                  expect(onChangeSpy).toHaveBeenCalledTimes(1);
                  expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2001-' } }));
                });
              });

              test('should autocomplete by adding a prefix of to a single digit month', async () => {
                const { wrapper, onChangeSpy } = renderDateInput({
                  ...sharedProps,
                  value: '2018-',
                });

                //focus to change to masked-input
                if (format === 'long-localized') {
                  act(() => {
                    wrapper.findNativeInput()!.getElement().focus();
                  });
                  await waitFor(() => {
                    expect(wrapper!.getElement().classList).toContain(testStyles['long-localized-focused']);
                  });
                }

                act(() => {
                  fireEvent.keyDown(wrapper.findNativeInput()!.getElement(), { key: '3' });
                });
                expect(onChangeSpy).toHaveBeenCalledWith(
                  expect.objectContaining({
                    detail: {
                      value: `2018-03${granularity === 'day' ? '-' : ''}`,
                    },
                  })
                );
              });

              (granularity === 'month' ? test.skip : test)(
                'should autocomplete by adding a prefix of to a single digit day',
                async () => {
                  const { wrapper, onChangeSpy } = renderDateInput({
                    ...sharedProps,
                    value: '2018-02-',
                  });

                  //focus to change to masked-input
                  if (format === 'long-localized') {
                    act(() => {
                      wrapper.findNativeInput()!.getElement().focus();
                    });
                    await waitFor(() => {
                      expect(wrapper!.getElement().classList).toContain(testStyles['long-localized-focused']);
                    });
                  }

                  act(() => {
                    fireEvent.keyDown(wrapper.findNativeInput()!.getElement(), { key: '3' });
                  });

                  expect(onChangeSpy).toHaveBeenCalledWith(
                    expect.objectContaining({ detail: { value: '2018-02-03' } })
                  );
                }
              );

              test(`should correct single digit year on enter`, async () => {
                const { wrapper, onChangeSpy } = renderDateInput({
                  ...sharedProps,
                  value: '2',
                });

                //focus to change to masked-input
                if (format === 'long-localized') {
                  act(() => {
                    wrapper.findNativeInput()!.getElement().focus();
                  });
                  await waitFor(() => {
                    expect(wrapper!.getElement().classList).toContain(testStyles['long-localized-focused']);
                  });
                }

                act(() => {
                  wrapper.findNativeInput().keydown({ key: 'Enter', keyCode: KeyCode.enter });
                });

                expect(onChangeSpy).toHaveBeenCalledWith(
                  expect.objectContaining({
                    detail: {
                      value: `2002-01${granularity === 'day' ? '-01' : ''}`,
                    },
                  })
                );
              });

              test('should correct double digit year on enter', async () => {
                const { wrapper, onChangeSpy } = renderDateInput({
                  ...sharedProps,
                  value: '22',
                });

                //focus to change to masked-input
                if (format === 'long-localized') {
                  act(() => {
                    wrapper.findNativeInput()!.getElement().focus();
                  });
                  await waitFor(() => {
                    expect(wrapper!.getElement().classList).toContain(testStyles['long-localized-focused']);
                  });
                }

                act(() => {
                  wrapper.findNativeInput().keydown({ key: 'Enter', keyCode: KeyCode.enter });
                });

                expect(onChangeSpy).toHaveBeenCalledWith(
                  expect.objectContaining({
                    detail: {
                      value: `2022-01${granularity === 'day' ? '-01' : ''}`,
                    },
                  })
                );
              });

              test(`should correct single digit month on enter`, async () => {
                const { wrapper, onChangeSpy } = renderDateInput({
                  ...sharedProps,
                  value: '2002-2',
                });

                //focus to change to masked-input
                if (format === 'long-localized') {
                  act(() => {
                    wrapper.findNativeInput()!.getElement().focus();
                  });
                  await waitFor(() => {
                    expect(wrapper!.getElement().classList).toContain(testStyles['long-localized-focused']);
                  });
                }

                act(() => {
                  wrapper.findNativeInput().keydown({ key: 'Enter', keyCode: KeyCode.enter });
                });

                expect(onChangeSpy).toHaveBeenCalledWith(
                  expect.objectContaining({
                    detail: {
                      value: `2002-02${granularity === 'day' ? '-01' : ''}`,
                    },
                  })
                );
              });

              (granularity === 'month' ? test.skip : test)(`should correct single digit day on enter`, async () => {
                const { wrapper, onChangeSpy } = renderDateInput({
                  ...sharedProps,
                  value: '2001/01/1',
                });

                //focus to change to masked-input
                if (format === 'long-localized') {
                  act(() => {
                    wrapper.findNativeInput()!.getElement().focus();
                  });
                  await waitFor(() => {
                    expect(wrapper!.getElement().classList).toContain(testStyles['long-localized-focused']);
                  });
                }

                act(() => {
                  wrapper.findNativeInput().keydown({ key: 'Enter', keyCode: KeyCode.enter });
                });

                expect(onChangeSpy).toHaveBeenCalledWith(
                  expect.objectContaining({
                    detail: {
                      value: '2001-01-01',
                    },
                  })
                );
              });
            });

            describe('limiting range', () => {
              ['-', '/', '.', ' '].forEach(separatorKey => {
                test(`should correct "1${separatorKey}" to "2001${separatorKey}"`, async () => {
                  const { wrapper, onChangeSpy } = renderDateInput({
                    ...sharedProps,
                    value: '1',
                  });

                  //focus to change to masked-input
                  if (format === 'long-localized') {
                    act(() => {
                      wrapper.findNativeInput()!.getElement().focus();
                    });
                    await waitFor(() => {
                      expect(wrapper!.getElement().classList).toContain(testStyles['long-localized-focused']);
                    });
                  }

                  //change value
                  act(() => {
                    fireEvent.keyDown(wrapper.findNativeInput()!.getElement(), { key: separatorKey });
                  });
                  expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2001-' } }));
                });

                test(`should correct "2018${separatorKey}1${separatorKey}" to "2018${separatorKey}01${granularity === 'day' ? separatorKey : ''}"`, async () => {
                  const { wrapper, onChangeSpy } = renderDateInput({
                    ...sharedProps,
                    value: '2018-1',
                  });

                  //focus to change to masked-input
                  if (format === 'long-localized') {
                    act(() => {
                      wrapper.findNativeInput()!.getElement().focus();
                    });
                    await waitFor(() => {
                      expect(wrapper!.getElement().classList).toContain(testStyles['long-localized-focused']);
                    });
                  }

                  //change value
                  act(() => {
                    fireEvent.keyDown(wrapper.findNativeInput()!.getElement(), { key: separatorKey });
                  });
                  expect(onChangeSpy).toHaveBeenCalledWith(
                    expect.objectContaining({ detail: { value: `2018-01${granularity === 'day' ? '-' : ''}` } })
                  );
                });

                test(`should correct "2018${separatorKey}0${separatorKey}" to "2018${separatorKey}01${separatorKey}"`, async () => {
                  const { wrapper, onChangeSpy } = renderDateInput({
                    ...sharedProps,
                    value: '2018-0',
                  });

                  //focus to change to masked-input
                  if (format === 'long-localized') {
                    act(() => {
                      wrapper.findNativeInput()!.getElement().focus();
                    });
                    await waitFor(() => {
                      expect(wrapper!.getElement().classList).toContain(testStyles['long-localized-focused']);
                    });
                  }

                  //change value
                  act(() => {
                    fireEvent.keyDown(wrapper.findNativeInput()!.getElement(), { key: separatorKey });
                  });
                  expect(onChangeSpy).toHaveBeenCalledWith(
                    expect.objectContaining({ detail: { value: `2018-01${granularity === 'day' ? '-' : ''}` } })
                  );
                });

                (granularity === 'day' ? test : test.skip)(
                  `should correct "2018${separatorKey}1${separatorKey}2" to "2018${separatorKey}01${separatorKey}02"`,
                  async () => {
                    const { wrapper, onChangeSpy } = renderDateInput({
                      ...sharedProps,
                      value: '2018-01-2',
                    });

                    //focus to change to masked-input
                    if (format === 'long-localized') {
                      act(() => {
                        wrapper.findNativeInput()!.getElement().focus();
                      });
                      await waitFor(() => {
                        expect(wrapper!.getElement().classList).toContain(testStyles['long-localized-focused']);
                      });
                    }

                    //change value
                    act(() => {
                      fireEvent.keyDown(wrapper.findNativeInput()!.getElement(), { key: separatorKey });
                    });
                    expect(onChangeSpy).toHaveBeenCalledWith(
                      expect.objectContaining({ detail: { value: '2018-01-02' } })
                    );
                  }
                );
              });

              (granularity === 'day' ? test : test.skip)('should allow entry of day 31 in January', async () => {
                const { wrapper, onChangeSpy } = renderDateInput({
                  ...sharedProps,
                  value: '2018-01-3',
                });

                //focus to change to masked-input
                if (format === 'long-localized') {
                  act(() => {
                    wrapper.findNativeInput()!.getElement().focus();
                  });
                  await waitFor(() => {
                    expect(wrapper!.getElement().classList).toContain(testStyles['long-localized-focused']);
                  });
                }

                //change value
                act(() => {
                  fireEvent.keyDown(wrapper.findNativeInput()!.getElement(), { key: '1' });
                });

                expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2018-01-31' } }));
              });

              (granularity === 'day' ? test : test.skip)('should allow entry of day 30 in March', async () => {
                const { wrapper, onChangeSpy } = renderDateInput({
                  ...sharedProps,
                  value: '2018-03-3',
                });

                //focus to change to masked-input
                if (format === 'long-localized') {
                  act(() => {
                    wrapper.findNativeInput()!.getElement().focus();
                  });
                  await waitFor(() => {
                    expect(wrapper!.getElement().classList).toContain(testStyles['long-localized-focused']);
                  });
                }

                //change value
                act(() => {
                  fireEvent.keyDown(wrapper.findNativeInput()!.getElement(), { key: '0' });
                });

                expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2018-03-30' } }));
              });

              (granularity === 'day' ? test : test.skip)('should disallow entry of day 31 in April', async () => {
                const { wrapper, onChangeSpy } = renderDateInput({
                  ...sharedProps,
                  value: '2018-04-3',
                });

                //focus to change to masked-input
                if (format === 'long-localized') {
                  act(() => {
                    wrapper.findNativeInput()!.getElement().focus();
                  });
                  await waitFor(() => {
                    expect(wrapper!.getElement().classList).toContain(testStyles['long-localized-focused']);
                  });
                }

                //change value
                act(() => {
                  fireEvent.keyDown(wrapper.findNativeInput()!.getElement(), { key: '1' });
                });
                expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2018-04-30' } }));
              });

              (granularity === 'day' ? test : test.skip)('should disallow entry of day 29 in february', async () => {
                const { wrapper, onChangeSpy } = renderDateInput({
                  ...sharedProps,
                  value: '2018-02-2',
                });

                if (format === 'long-localized') {
                  act(() => {
                    wrapper.findNativeInput()!.getElement().focus();
                  });
                  await waitFor(() => {
                    expect(wrapper!.getElement().classList).toContain(testStyles['long-localized-focused']);
                  });
                }

                //change value
                act(() => {
                  fireEvent.keyDown(wrapper.findNativeInput()!.getElement(), { key: '9' });
                });

                expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2018-02-28' } }));
              });

              (granularity === 'day' ? test : test.skip)(
                'should allow entry of day 29 in february, in a leap year',
                async () => {
                  const { wrapper, onChangeSpy } = renderDateInput({
                    ...sharedProps,
                    value: '2020-02-2',
                  });

                  if (format === 'long-localized') {
                    act(() => {
                      wrapper.findNativeInput()!.getElement().focus();
                    });
                    await waitFor(() => {
                      expect(wrapper!.getElement().classList).toContain(testStyles['long-localized-focused']);
                    });
                  }

                  //change value
                  act(() => {
                    fireEvent.keyDown(wrapper.findNativeInput()!.getElement(), { key: '9' });
                  });
                  expect(onChangeSpy).toHaveBeenCalledWith(
                    expect.objectContaining({ detail: { value: '2020-02-29' } })
                  );
                }
              );
            }); // End limiting range

            describe('appending separator', () => {
              test('should automatically append separator after 4 digits entered', async () => {
                const { wrapper, onChangeSpy } = renderDateInput({
                  ...sharedProps,
                  value: '201',
                });

                if (format === 'long-localized') {
                  act(() => {
                    wrapper.findNativeInput()!.getElement().focus();
                  });
                  await waitFor(() => {
                    expect(wrapper!.getElement().classList).toContain(testStyles['long-localized-focused']);
                  });
                }

                //change value
                act(() => {
                  fireEvent.keyDown(wrapper.findNativeInput()!.getElement(), { key: '8' });
                });
                expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2018-' } }));
              });

              (granularity === 'day' ? test : test.skip)(
                'should automatically append separator after 6 digits entered',
                async () => {
                  const { wrapper, onChangeSpy } = renderDateInput({
                    ...sharedProps,
                    value: '2018-1',
                  });

                  if (format === 'long-localized') {
                    act(() => {
                      wrapper.findNativeInput()!.getElement().focus();
                    });
                    await waitFor(() => {
                      expect(wrapper!.getElement().classList).toContain(testStyles['long-localized-focused']);
                    });
                  }

                  //change value
                  act(() => {
                    fireEvent.keyDown(wrapper.findNativeInput()!.getElement(), { key: '1' });
                  });
                  expect(onChangeSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '2018-11-' } }));
                }
              );
            }); // End appending separator

            describe('entering value in middle of input', () => {
              test('should allow a value to be changed', async () => {
                const { wrapper, onChangeSpy } = renderDateInput({
                  ...sharedProps,
                  value: '2018-01-02',
                });

                if (format === 'long-localized') {
                  act(() => {
                    wrapper.findNativeInput()!.getElement().focus();
                  });
                  await waitFor(() => {
                    expect(wrapper!.getElement().classList).toContain(testStyles['long-localized-focused']);
                  });
                }

                act(() => {
                  wrapper.findNativeInput().getElement().setSelectionRange(3, 3);
                });

                //change value
                act(() => {
                  fireEvent.keyDown(wrapper.findNativeInput()!.getElement(), { key: '9' });
                });
                expect(onChangeSpy).toHaveBeenCalledWith(
                  expect.objectContaining({
                    detail: {
                      value: `2019-01${granularity === 'day' ? '-02' : ''}`,
                    },
                  })
                );
              });

              test('should autocorrect if value is over limit', async () => {
                const { wrapper, onChangeSpy } = renderDateInput({
                  ...sharedProps,
                  value: '2018-11-02',
                });

                if (format === 'long-localized') {
                  act(() => {
                    wrapper.findNativeInput()!.getElement().focus();
                  });
                  await waitFor(() => {
                    expect(wrapper!.getElement().classList).toContain(testStyles['long-localized-focused']);
                  });
                }

                act(() => {
                  wrapper.findNativeInput().getElement().setSelectionRange(5, 5);
                });

                //change value
                act(() => {
                  wrapper.findNativeInput().keydown({ key: '5' });
                });
                expect(onChangeSpy).toHaveBeenCalledWith(
                  expect.objectContaining({
                    detail: {
                      value: `2018-12${granularity === 'day' ? '-02' : ''}`,
                    },
                  })
                );
              });

              ['-', '/', '.', ' '].forEach(separatorKey => {
                test(`should swallow "${separatorKey}" at separator`, async () => {
                  const { wrapper, onChangeSpy } = renderDateInput({
                    ...sharedProps,
                    value: `2018-11${granularity === 'day' ? '-02' : ''}`,
                  });

                  if (format === 'long-localized') {
                    act(() => {
                      wrapper.findNativeInput()!.getElement().focus();
                    });
                    await waitFor(() => {
                      expect(wrapper!.getElement().classList).toContain(testStyles['long-localized-focused']);
                    });
                  }

                  act(() => {
                    wrapper.findNativeInput().getElement().setSelectionRange(4, 4);
                  });
                  act(() => {
                    wrapper.findNativeInput().keydown({ key: separatorKey });
                  });

                  // Value does not change as key is swallowed
                  expect(onChangeSpy).not.toHaveBeenCalled();
                });
              });

              test('should swallow keys at separator - that is not a separator', async () => {
                const { wrapper, onChangeSpy } = renderDateInput({
                  ...sharedProps,
                  value: `2018-11${granularity === 'day' ? '-02' : ''}`,
                });

                if (format === 'long-localized') {
                  act(() => {
                    wrapper.findNativeInput()!.getElement().focus();
                  });
                  await waitFor(() => {
                    expect(wrapper!.getElement().classList).toContain(testStyles['long-localized-focused']);
                  });
                }

                act(() => {
                  wrapper
                    .findNativeInput()
                    .getElement()
                    .setSelectionRange(granularity === 'day' ? 7 : 4, granularity === 'day' ? 7 : 4);
                });
                act(() => {
                  wrapper.findNativeInput().keydown({ key: '3' });
                });

                // Value does not change as key is swallowed
                expect(onChangeSpy).not.toHaveBeenCalled();
              });

              test('should ignore selection end', async () => {
                const { wrapper, onChangeSpy } = renderDateInput({
                  ...sharedProps,
                  value: `2018-01${granularity === 'day' ? '-02' : ''}`,
                });

                if (format === 'long-localized') {
                  act(() => {
                    wrapper.findNativeInput()!.getElement().focus();
                  });
                  await waitFor(() => {
                    expect(wrapper!.getElement().classList).toContain(testStyles['long-localized-focused']);
                  });
                }

                act(() => {
                  wrapper
                    .findNativeInput()
                    .getElement()
                    .setSelectionRange(3, granularity === 'day' ? 7 : 4);
                });
                act(() => {
                  wrapper.findNativeInput().keydown({ key: '9' });
                });

                expect(onChangeSpy).toHaveBeenCalledWith(
                  expect.objectContaining({ detail: { value: `2019-01${granularity === 'day' ? '-02' : ''}` } })
                );
              });

              (granularity === 'day' ? test : test.skip)(
                'should autocorrect day if month is changed to one with fewer days - 30',
                async () => {
                  const { wrapper, onChangeSpy } = renderDateInput({
                    ...sharedProps,
                    value: '2019-01-31',
                  });

                  if (format === 'long-localized') {
                    act(() => {
                      wrapper.findNativeInput()!.getElement().focus();
                    });
                    await waitFor(() => {
                      expect(wrapper!.getElement().classList).toContain(testStyles['long-localized-focused']);
                    });
                  }

                  act(() => {
                    wrapper.findNativeInput().getElement().setSelectionRange(6, 6);
                  });
                  act(() => {
                    wrapper.findNativeInput().keydown({ key: '4' });
                  });

                  expect(onChangeSpy).toHaveBeenCalledWith(
                    expect.objectContaining({ detail: { value: '2019-04-30' } })
                  );
                }
              );

              (granularity === 'day' ? test : test.skip)(
                'should autocorrect day if month is changed to one with fewer days - 28',
                async () => {
                  const { wrapper, onChangeSpy } = renderDateInput({
                    ...sharedProps,
                    value: '2019-01-31',
                  });

                  if (format === 'long-localized') {
                    act(() => {
                      wrapper.findNativeInput()!.getElement().focus();
                    });
                    await waitFor(() => {
                      expect(wrapper!.getElement().classList).toContain(testStyles['long-localized-focused']);
                    });
                  }

                  act(() => {
                    wrapper.findNativeInput().getElement().setSelectionRange(6, 6);
                  });
                  act(() => {
                    wrapper.findNativeInput().keydown({ key: '2' });
                  });

                  expect(onChangeSpy).toHaveBeenCalledWith(
                    expect.objectContaining({ detail: { value: '2019-02-28' } })
                  );
                }
              );
            }); // end entering value in middle of input
          }
        );
      });
    });
  });
});
