// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import MaskFormat from '../../../../../../lib/components/internal/components/masked-input/utils/mask-format';
import { MaskArgs } from '../../utils/mask-format';

describe('MaskFormat', () => {
  const mockDayMask = jest.fn().mockReturnValue(31);
  const yearMask = { min: 0, max: 9999, default: 2000, length: 4 };
  const monthMask = { min: 1, max: 12, length: 2 };
  const dayMask = { min: 1, max: mockDayMask, length: 2 };
  const hourMask = { min: 0, max: 23, length: 2 };
  const minuteMask = { min: 0, max: 59, length: 2 };
  const secondMask = { min: 0, max: 59, length: 2 };

  const maskTests: { description: string; mask: MaskArgs; maskType: string }[] = [
    {
      description: "time mask ':' to minutes",
      maskType: 'time',
      mask: {
        separator: ':',
        inputSeparators: ['/', '-'],
        segments: [hourMask, minuteMask],
      },
    },
    {
      description: "time mask '-' to minutes",
      maskType: 'time',
      mask: {
        separator: '-',
        inputSeparators: ['/', ':'],
        segments: [hourMask, minuteMask],
      },
    },
    {
      description: "time mask ':' to seconds",
      maskType: 'time',
      mask: {
        separator: ':',
        inputSeparators: ['/', '-'],
        segments: [hourMask, minuteMask, secondMask],
      },
    },
    {
      description: "time mask '-' to seconds",
      maskType: 'time',
      mask: {
        separator: '-',
        inputSeparators: ['/', ':'],
        segments: [hourMask, minuteMask, secondMask],
      },
    },
    {
      description: "date mask 'slashed' day only",
      maskType: 'date',
      mask: {
        separator: '/',
        inputSeparators: ['.', '-', ' '],
        segments: [yearMask, monthMask, dayMask],
      },
    },
    {
      description: "date mask 'slashed' month only",
      maskType: 'date',
      mask: {
        separator: '/',
        inputSeparators: ['.', '-', ' '],
        segments: [yearMask, monthMask],
      },
    },
    {
      description: "date mask 'iso' day only",
      maskType: 'date',
      mask: {
        separator: '-',
        inputSeparators: ['.', '/', ' '],
        segments: [yearMask, monthMask, dayMask],
      },
    },
    {
      description: "date mask 'iso' month only",
      maskType: 'date',
      mask: {
        separator: '/',
        inputSeparators: ['.', '-', ' '],
        segments: [yearMask, monthMask],
      },
    },
    //no requirement for year-only mask
    //no requirement for date-time mask
  ];

  maskTests.forEach(({ description, mask, maskType }) => {
    describe(description, () => {
      const maskFormat = new MaskFormat(mask);

      describe('tryAppendSeparator', () => {
        (maskType === 'time' ? test : test.skip)('returns correctly with time values', () => {
          expect(maskFormat.tryAppendSeparator('1')).toBe('1');
          expect(maskFormat.tryAppendSeparator('12')).toBe(`12${mask.segments.length > 1 ? mask.separator : ''}`);
          if (mask.segments.length > 1) {
            expect(maskFormat.tryAppendSeparator(`12${mask.separator}12`)).toBe(
              `12${mask.separator}12${mask.segments.length > 2 ? mask.separator : ''}`
            );
          }
          if (mask.segments.length > 2) {
            expect(maskFormat.tryAppendSeparator(`12${mask.separator}12${mask.separator}12`)).toBe(
              `12${mask.separator}12${mask.separator}12`
            );
          }
        });

        (maskType === 'date' ? test : test.skip)('returns correctly with date values', () => {
          expect(maskFormat.tryAppendSeparator('1')).toBe('1');
          expect(maskFormat.tryAppendSeparator('2025')).toBe(`2025${mask.segments.length > 1 ? mask.separator : ''}`);
          if (mask.segments.length > 1) {
            expect(maskFormat.tryAppendSeparator(`2025${mask.separator}12`)).toBe(
              `2025${mask.separator}12${mask.segments.length > 2 ? mask.separator : ''}`
            );
          }
          if (mask.segments.length > 2) {
            expect(maskFormat.tryAppendSeparator(`2025${mask.separator}12${mask.separator}31`)).toBe(
              `2025${mask.separator}12${mask.separator}31`
            );
          }
        });
      });

      describe('isSeparator', () => {
        test.each([...mask.separator, ...(mask.inputSeparators as string[])])(
          'returns true when given a separator character of "%s"',
          seperator => {
            expect(maskFormat.isSeparator(seperator)).toBe(true);
          }
        );

        test('returns false when given a non-separator character', () => {
          expect(maskFormat.isSeparator('a')).toBe(false);
          expect(maskFormat.isSeparator('0')).toBe(false);
          expect(maskFormat.isSeparator('!')).toBe(false);
        });
      });

      describe('isValid', () => {
        [...new Set([mask.inputSeparators || [], mask.separator])].forEach(validSeparator => {
          const isMatchingSeparator = validSeparator === mask.separator;
          test(`returns correct value with "${validSeparator}" separator in param string for first segment`, () => {
            expect(maskFormat.isValid('')).toBe(true);
            expect(maskFormat.isValid('1')).toBe(true);
            expect(maskFormat.isValid('01')).toBe(true);
            expect(maskFormat.isValid('12')).toBe(true);
            if (maskType === 'date') {
              expect(maskFormat.isValid('202')).toBe(true);
              expect(maskFormat.isValid('2025')).toBe(true);
              expect(maskFormat.isValid(`2025${validSeparator}`)).toBe(mask.segments.length > 1 && isMatchingSeparator);
              expect(maskFormat.isValid(`2025${validSeparator}${validSeparator}`)).toBe(false);
            } else {
              expect(maskFormat.isValid(`12${validSeparator}`)).toBe(mask.segments.length > 1 && isMatchingSeparator);
              expect(maskFormat.isValid(`12${validSeparator}${validSeparator}`)).toBe(false);
            }
          });

          (mask.segments.length > 1 ? test : test.skip)(
            `returns correct value with "${validSeparator}" separator in param string for second segment`,
            () => {
              if (maskType === 'date') {
                expect(maskFormat.isValid(`2025${validSeparator}`)).toBe(isMatchingSeparator);
                expect(maskFormat.isValid(`2025${validSeparator}1`)).toBe(isMatchingSeparator);
                expect(maskFormat.isValid(`2025${validSeparator}12`)).toBe(isMatchingSeparator);
                expect(maskFormat.isValid(`2025${validSeparator}01${validSeparator}`)).toBe(
                  mask.segments.length > 2 && isMatchingSeparator
                );
                expect(maskFormat.isValid(`2025${validSeparator}01${validSeparator}${validSeparator}`)).toBe(false);
              } else {
                expect(maskFormat.isValid(`12${validSeparator}`)).toBe(isMatchingSeparator);
                expect(maskFormat.isValid(`12${validSeparator}0`)).toBe(isMatchingSeparator);
                expect(maskFormat.isValid(`12${validSeparator}00`)).toBe(isMatchingSeparator);
                expect(maskFormat.isValid(`12${validSeparator}59`)).toBe(isMatchingSeparator);
                expect(maskFormat.isValid(`12${validSeparator}00${validSeparator}`)).toBe(
                  mask.segments.length > 2 && isMatchingSeparator
                );
                expect(maskFormat.isValid(`12${validSeparator}00${validSeparator}${validSeparator}`)).toBe(false);
              }
            }
          );

          (mask.segments.length > 2 ? test : test.skip)(
            `returns correct value with "${validSeparator}" separator in param string for third segment`,
            () => {
              if (maskType === 'date') {
                expect(maskFormat.isValid(`2025${validSeparator}01${validSeparator}`)).toBe(isMatchingSeparator);
                expect(maskFormat.isValid(`2025${validSeparator}01${validSeparator}1`)).toBe(isMatchingSeparator);
                expect(maskFormat.isValid(`2025${validSeparator}01${validSeparator}01`)).toBe(isMatchingSeparator);
                expect(maskFormat.isValid(`2025${validSeparator}12${validSeparator}31`)).toBe(isMatchingSeparator);
                expect(maskFormat.isValid(`2025${validSeparator}12${validSeparator}31${validSeparator}`)).toBe(false);
                expect(
                  maskFormat.isValid(`2025${validSeparator}12${validSeparator}31${validSeparator}${validSeparator}`)
                ).toBe(false);
              } else {
                expect(maskFormat.isValid(`12${validSeparator}00${validSeparator}`)).toBe(isMatchingSeparator);
                expect(maskFormat.isValid(`12${validSeparator}00${validSeparator}0`)).toBe(isMatchingSeparator);
                expect(maskFormat.isValid(`12${validSeparator}00${validSeparator}00`)).toBe(isMatchingSeparator);
                expect(maskFormat.isValid(`12${validSeparator}00${validSeparator}59${validSeparator}`)).toBe(false);
                expect(
                  maskFormat.isValid(`12${validSeparator}00${validSeparator}59${validSeparator}${validSeparator}`)
                ).toBe(false);
              }
            }
          );
        });
      });

      describe('getValidValue', () => {
        mask.segments.forEach((segment, segmentIndex) => {
          const overMaxTests: {
            [maskType: string]: { [segmentIndex: string]: { input: string; expectedResult: string } };
          } = {
            time: {
              '0': {
                //uses the hourMask
                input: `24`,
                expectedResult: `2`,
              },
              '1': {
                //using minuteMask
                input: `23${mask.separator}60`,
                expectedResult: `23${mask.separator}6`,
              },
              '2': {
                //using secondMask
                input: `23${mask.separator}59${mask.separator}60`,
                expectedResult: `23${mask.separator}59${mask.separator}6`,
              },
            },
            date: {
              '0': {
                //using year mask
                input: '10000',
                expectedResult: `1000${mask.separator}`, //always another segment
              },
              '1': {
                //using month mask
                input: `9999${mask.separator}13`,
                expectedResult: `9999${mask.separator}1`,
              },
              '2': {
                //using day mask
                input: `9999${mask.separator}12${mask.separator}31`,
                expectedResult: `9999${mask.separator}12${mask.separator}31`,
              },
            },
          };

          test(`does not allow for a value greater than max in ${segmentIndex + 1} segment`, () => {
            const { input, expectedResult } = overMaxTests[maskType][segmentIndex];
            expect(maskFormat.getValidValue(input)).toBe(expectedResult);
          });

          const anotherCharTests: { [maskType: string]: { [segmentIndex: string]: string } } = {
            time: {
              '0': `23`,
              '1': `23${mask.separator}59`,
              '2': `23${mask.separator}59${mask.separator}59`,
            },
            date: {
              '0': `9999`,
              '1': `9999${mask.separator}12`,
              '2': `9999${mask.separator}12${mask.separator}31`,
            },
          };
          const endOfSegment = anotherCharTests[maskType][segmentIndex];

          (segmentIndex === mask.segments.length - 1 ? test : test.skip)(
            'does not allow for more another character when at the end of final segment length',
            () => {
              expect(maskFormat.getValidValue(`${endOfSegment}1`)).toBe(endOfSegment);
            }
          );
          (segmentIndex < mask.segments.length - 1 ? test : test.skip)(
            `adds a separator when text is longer than the segment length when at segment number ${segmentIndex + 1} out of ${mask.segments.length} total`,
            () => {
              expect(maskFormat.getValidValue(`${endOfSegment}1`)).toBe(`${endOfSegment}${mask.separator}`);
            }
          );
        });

        test('returns an empty string if no valid value is possible', () => {
          expect(maskFormat.getValidValue(`${mask.separator}${maskType === 'time' ? '99' : '10000'}`)).toBe('');
        });
      });

      describe('autoComplete', () => {
        const expectedResultZero: { [maskType: string]: { [segmentIndex: string]: string } } = {
          date: {
            '1': `2000`,
            '2': `2000${maskFormat.separator}01`,
            '3': `2000${maskFormat.separator}01${maskFormat.separator}01`,
          },
          time: {
            '1': `00`,
            '2': `00${maskFormat.separator}00`,
            '3': `00${maskFormat.separator}00${maskFormat.separator}00`,
          },
        };

        test('should autocomplete an empty value', () => {
          expect(maskFormat.autoComplete('')).toBe(expectedResultZero[maskType][`${mask.segments.length}` as string]);
        });

        test(`should autocomplete a partial value for 0`, () => {
          expect(maskFormat.autoComplete('0')).toBe(expectedResultZero[maskType][`${mask.segments.length}` as string]);
        });

        test(`should autocomplete a partial value for 1, 01, ${maskType === 'date' ? '001' : ''}`, () => {
          const expectedResultOne: { [maskType: string]: { [segmentIndex: string]: string } } = {
            date: {
              '1': `2001`,
              '2': `2001${maskFormat.separator}01`,
              '3': `2001${maskFormat.separator}01${maskFormat.separator}01`,
            },
            time: {
              '1': `01`,
              '2': `01${maskFormat.separator}00`,
              '3': `01${maskFormat.separator}00${maskFormat.separator}00`,
            },
          };

          expect(maskFormat.autoComplete('1')).toBe(expectedResultOne[maskType][`${mask.segments.length}` as string]);
          expect(maskFormat.autoComplete('01')).toBe(expectedResultOne[maskType][`${mask.segments.length}` as string]);
          if (maskType === 'date') {
            expect(maskFormat.autoComplete('001')).toBe(
              expectedResultOne[maskType][`${mask.segments.length}` as string]
            );
          }
        });

        test(`should autocomplete a partial value with separator`, () => {
          const expectedResultOne: { [maskType: string]: { [segmentIndex: string]: string } } = {
            date: {
              '1': `2001`,
              '2': `2001${maskFormat.separator}01`,
              '3': `2001${maskFormat.separator}01${maskFormat.separator}01`,
            },
            time: {
              '1': `01`,
              '2': `01${maskFormat.separator}00`,
              '3': `01${maskFormat.separator}00${maskFormat.separator}00`,
            },
          };
          const resultString = expectedResultOne[maskType][`${mask.segments.length}` as string];
          expect(maskFormat.autoComplete(resultString.slice(0, resultString.length - 1))).toBe(resultString);
        });

        test('should not change a complete value', () => {
          const expectedResult: { [maskType: string]: { [segmentIndex: string]: string } } = {
            date: {
              '1': `1999`,
              '2': `2014${maskFormat.separator}01`,
              '3': `3455${maskFormat.separator}01${maskFormat.separator}01`,
            },
            time: {
              '1': `11`,
              '2': `03${maskFormat.separator}15`,
              '3': `09${maskFormat.separator}50${maskFormat.separator}40`,
            },
          };
          const resultString = expectedResult[maskType][`${mask.segments.length}` as string];
          expect(maskFormat.autoComplete(resultString)).toBe(resultString);
        });
      });

      describe('getSegmentValueWithAddition', () => {
        test('should overwrite the character at a given position in a segment', () => {
          const tests: {
            [maskType: string]: {
              [segmentIndex: string]: {
                position: number;
                value: string;
                enteredDigit: string;
                result: number;
              };
            };
          } = {
            date: {
              '1': {
                position: 0,
                value: `1999`,
                enteredDigit: '1',
                result: 10,
              },
              '2': {
                position: 0,
                value: `2014${maskFormat.separator}01`,
                enteredDigit: '1',
                result: 1014,
              },
              '3': {
                position: 0,
                value: `3455${maskFormat.separator}01${maskFormat.separator}01`,
                enteredDigit: '1',
                result: 1455,
              },
            },
            time: {
              '1': {
                position: 0,
                value: `11`,
                enteredDigit: '1',
                result: 10,
              },
              '2': {
                position: 0,
                value: `03${maskFormat.separator}15`,
                enteredDigit: '1',
                result: 13,
              },
              '3': {
                position: 0,
                value: `09${maskFormat.separator}50${maskFormat.separator}40`,
                enteredDigit: '1',
                result: 19,
              },
            },
          };

          const { position, value, enteredDigit, result } = tests[maskType][`${mask.segments.length}` as string];
          expect(maskFormat.getSegmentValueWithAddition(position, value, enteredDigit)).toBe(result);
        });
      });

      describe('replaceDigitsWithZeroes', () => {
        test('replaces selected digits with zeroes', () => {
          const tests: {
            [maskType: string]: {
              [segmentIndex: string]: {
                cursorStart: number;
                value: string;
                cursorEnd: number;
                result: {
                  position: number;
                  value: string;
                };
              };
            };
          } = {
            date: {
              '1': {
                cursorStart: 0,
                value: `1999`,
                cursorEnd: 1,
                result: {
                  position: 0,
                  value: `1000`,
                },
              },
              '2': {
                cursorStart: 0,
                value: `2014${maskFormat.separator}01`,
                cursorEnd: 1,
                result: {
                  position: 0,
                  value: `0014${maskFormat.separator}01`,
                },
              },
              '3': {
                cursorStart: 0,
                value: `3455${maskFormat.separator}01${maskFormat.separator}01`,
                cursorEnd: 1,
                result: {
                  position: 0,
                  value: `0455${maskFormat.separator}01${maskFormat.separator}01`,
                },
              },
            },
            time: {
              '1': {
                cursorStart: 0,
                value: `11`,
                cursorEnd: 1,
                result: {
                  position: 0,
                  value: `10`,
                },
              },
              '2': {
                cursorStart: 0,
                value: `11${maskFormat.separator}15`,
                cursorEnd: 1,
                result: {
                  position: 0,
                  value: `01${maskFormat.separator}15`,
                },
              },
              '3': {
                cursorStart: 1,
                value: `09${maskFormat.separator}50${maskFormat.separator}40`,
                cursorEnd: 0,
                result: {
                  position: 1,
                  value: `00${maskFormat.separator}50${maskFormat.separator}40`,
                },
              },
            },
          };

          const {
            cursorStart,
            value,
            cursorEnd,
            result: { position: expectedPosition, value: expectedValue },
          } = tests[maskType][`${mask.segments.length}` as string];
          expect(maskFormat.replaceDigitsWithZeroes(value, cursorStart, cursorEnd)).toEqual({
            position: expectedPosition,
            value: expectedValue,
          });
        });
      });
    });
  });
});
