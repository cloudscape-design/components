// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { padLeftZeros } from '../../../utils/strings';
import { insertAt } from './strings';

interface FormatSegment {
  min: number;
  max: number | ((value: string) => number);
  length: number;
  default?: number;
}

interface FormatSegmentFull extends FormatSegment {
  start: number;
  max(value: string): number;
  end: number;
}

export interface MaskArgs {
  separator: string;
  inputSeparators?: Array<string>;
  segments: Array<FormatSegment>;
}

export interface ChangeResult {
  value: string;
  position: number;
}

class MaskFormat {
  separator: string;
  private inputSeparators: Array<string>;
  private segments: Array<FormatSegmentFull>;
  private positionFormats = new Map<number, FormatSegmentFull>();

  constructor({ separator, inputSeparators = [], segments }: MaskArgs) {
    this.segments = [];
    this.separator = separator;

    this.inputSeparators = [...inputSeparators, separator];
    this.enrichSegmentDefinitions(segments);
  }

  tryAppendSeparator(value: string) {
    const withSeparator = `${value}${this.separator}`;
    return this.isValid(withSeparator) ? withSeparator : value;
  }

  isSeparator(key: string): boolean {
    return this.inputSeparators.indexOf(key) !== -1;
  }

  isValid(value: string): boolean {
    const inputSegments = value.split(this.separator);

    if (inputSegments.length > this.segments.length) {
      return false;
    }

    return inputSegments.every((segmentValue, i) => {
      const segment = this.segments[i];

      // disallow empty segments
      if (segmentValue === '') {
        // except empty last segment (e.g. trailing separator "12:")
        if (i === inputSegments.length - 1) {
          return true;
        } else {
          return false;
        }
      }
      // only allow numerals
      if (!segmentValue.match(/^\d+$/)) {
        return false;
      }
      // disallow incomplete segments, except at end
      if (segmentValue.length < segment.length && i !== inputSegments.length - 1) {
        return false;
      }
      // limit numerical value
      const intValue = parseInt(segmentValue, 10);

      // Handles values padded with 0s that are lost during parsing
      if (segmentValue.length > segment.length) {
        return false;
      }

      if (intValue < segment.min || intValue > segment.max(value)) {
        // allow incomplete segments in final position
        if (i === inputSegments.length - 1 && segmentValue.length < segment.length) {
          return true;
        }
        return false;
      }
      return true;
    });
  }

  getValidValue(value: string): string {
    let validValue = value;

    do {
      if (this.isValid(validValue)) {
        return this.tryAppendSeparator(validValue);
      }

      validValue = validValue.substring(0, validValue.length - 1);
    } while (validValue.length > 0);

    return '';
  }

  autoComplete(value: string): string {
    // aka [...completeSegments, lastSegment] = value.split(':')
    // but that's not valid :/
    const [lastSegmentValue, ...completeSegmentValues] = value.split(this.separator).reverse();
    const lastSegment = this.segments[completeSegmentValues.length];

    // if the last segment isn't complete, pad it with a preceding 0
    // e.g. 10:1 -> 10:01
    const paddedLastSegmentValue = this.padWithDefaultValue(lastSegmentValue, lastSegment);

    // recombine, and pad with extra segments for the full format
    const partial = [...completeSegmentValues.reverse(), paddedLastSegmentValue];
    while (partial.length < this.segments.length) {
      const nextSegment = this.segments[partial.length];
      const segmentValue = this.padWithDefaultValue('', nextSegment);
      partial.push(segmentValue);
    }
    value = partial.join(this.separator);
    value = this.correctMinMaxValues(value);
    return value;
  }

  getSegmentValueWithAddition(position: number, value: string, enteredDigit: string) {
    const segment = this.positionFormats.get(position)!;
    const segmentValue = value.substr(segment.start, segment.length);
    const segmentPosition = position - segment.start;
    const newValue = insertAt(segmentValue, enteredDigit, segmentPosition, segmentPosition + 1);
    return parseInt(newValue, 10);
  }

  replaceDigitsWithZeroes(value: string, cursorStart: number, cursorEnd: number): ChangeResult {
    const position = this.isCursorAtSeparator(cursorStart) ? cursorStart + 1 : cursorStart;

    // move selection forwards if it starts with a separator
    if (this.isCursorAtSeparator(cursorStart)) {
      cursorStart++;
    }

    // first, insert zeros in a partial segment at beginning of selection
    if (!this.isSegmentStart(cursorStart)) {
      const segment = this.positionFormats.get(cursorStart)!;
      value = insertAt(value, padLeftZeros('', segment.end - cursorStart), cursorStart, segment.end);
      cursorStart = segment.end + 1;
    }

    // then loop through remaining segments, filling with zeros
    let currentSegment: FormatSegmentFull;
    while (cursorStart < cursorEnd && (currentSegment = this.positionFormats.get(cursorStart + 1)!)) {
      const insertionEnd = Math.min(cursorEnd, currentSegment.end);
      value = insertAt(
        value,
        padLeftZeros('', insertionEnd - currentSegment.start),
        currentSegment.start,
        insertionEnd
      );
      cursorStart = insertionEnd + 1;
    }

    value = this.correctMinMaxValues(value);

    return {
      value,
      position,
    };
  }

  handleSeparatorInput(value: string, position: number): ChangeResult | void {
    if (position === value.length && !this.isSegmentStart(position)) {
      const segment = this.positionFormats.get(position)!;
      let segmentValue = value.substr(segment.start, segment.length);
      segmentValue = this.padWithDefaultValue(segmentValue, segment);
      value = insertAt(value, segmentValue, segment.start, segment.end);
      value = this.correctMinMaxValues(value);
      return {
        value,
        position: value.length,
      };
    }
  }

  isCursorAtSeparator(position: number) {
    return 0 < position && position < this.getMaxLength() && this.positionFormats.get(position) === undefined;
  }

  isSegmentStart(position: number) {
    return position === 0 || this.isCursorAtSeparator(position - 1);
  }

  getSegmentMaxValue(value: string, position: number): number {
    return this.positionFormats.get(position)!.max(value);
  }

  getSegmentMinValue(value: string, position: number): number {
    return this.positionFormats.get(position)!.min;
  }

  getMaxLength() {
    const last = this.segments[this.segments.length - 1];
    return last.start + last.length;
  }

  deleteSeparator(value: string, position: number): ChangeResult {
    value = insertAt(value, '0', position - 2, position - 1);

    return {
      value: this.correctMinMaxValues(value),
      position: position - 2,
    };
  }

  deleteDigit(value: string, position: number): ChangeResult {
    value = insertAt(value, '0', position - 1, position);

    // 23:59|: => backspace => 23:5|
    const length = value.length;
    if (value.slice(length - 2) === '0:') {
      value = value.slice(0, length - 2);
    }

    return {
      value: this.correctMinMaxValues(value),
      position: position - 1,
    };
  }

  correctMinMaxValues(value: string): string {
    let segment = this.positionFormats.get(0);
    while (segment && value.length >= segment.end) {
      const segmentValue = parseInt(value.substr(segment.start, segment.length), 10);
      const segmentMax = segment.max(value);
      if (segmentValue < segment.min) {
        let toInsert = segment.min.toFixed();
        toInsert = padLeftZeros(toInsert, segment.length);
        value = insertAt(value, toInsert, segment.start, segment.end);
      }
      if (segmentValue > segmentMax) {
        value = insertAt(value, segmentMax.toFixed(), segment.start, segment.end);
      }
      segment = this.positionFormats.get(segment.end + 1);
    }
    return value.substr(0, this.segments[this.segments.length - 1].end);
  }

  formatPastedText(text: string, value: string, cursorStart: number, cursorEnd: number): string {
    const keyArr = text.trim().split('');

    let position = cursorStart;

    let formattedValue = value;
    // if a selection range captures the end of the current value
    // we replace it with the value in buffer even if the value in buffer is shorter
    if (cursorEnd > cursorStart && cursorEnd === value.length) {
      formattedValue = value.slice(0, cursorStart);
    }

    for (const key of keyArr) {
      if (position >= this.getMaxLength()) {
        break;
      }

      const result = this.processKey(formattedValue, key, position);
      formattedValue = result.value;
      position = result.position;
    }

    return this.tryAppendSeparator(formattedValue);
  }

  processKey(initialValue: string, key: string, initialPosition: number) {
    let value = initialValue;
    let position = initialPosition;

    if (this.isSeparator(key)) {
      const result = this.handleSeparatorInput(value, position);
      if (result) {
        value = result.value;
        position = result.position;
      }
    } else {
      const isCursorAtEnd = position === value.length;
      const segmentValue = this.getSegmentValueWithAddition(position, value, key);
      const segmentMaxValue = this.getSegmentMaxValue(value, position);
      const segmentMinValue = this.getSegmentMinValue(value, position);
      const firstDigitGreater = parseInt(key, 10) > parseInt(segmentMaxValue.toFixed()[0], 10);
      const isValidPosition = isCursorAtEnd || segmentValue.toFixed().length === 1;
      const exceedsMaxAtSegmentStart = this.isSegmentStart(position) && isValidPosition && firstDigitGreater;

      if (exceedsMaxAtSegmentStart) {
        // 22:| => Enter '9' => 22:09|
        // |1 => Enter '9' => 09|
        value = insertAt(value, `0${key}`, position, position + 2);
        position += 2;
      } else if (segmentValue > segmentMaxValue && this.isSegmentStart(position)) {
        // 22:|22 => Enter '9' => 22:59|
        value = insertAt(value, segmentMaxValue.toFixed(), position, position + segmentMaxValue.toFixed().length);
        position += segmentMaxValue.toFixed().length;
      } else if (segmentValue > segmentMaxValue) {
        // 2|2:22 => Enter '9' => 23:|22
        value = insertAt(value, segmentMaxValue.toFixed(), position - 1, position + 1);
        position += 1;
      } else if (segmentValue < segmentMinValue && !this.isSegmentStart(position)) {
        // 0| => enter '0' => 01:
        value = insertAt(value, segmentMinValue.toFixed(), position, position + 1);
        position += 1;
      } else {
        // 22:| => Enter '5' => 23:5|
        value = insertAt(value, key, position, position + 1);
        position += 1;
      }
    }

    value = this.tryAppendSeparator(value);

    // Move cursor in front of separator if behind after overwriting a character
    if (this.isCursorAtSeparator(position)) {
      position++;
    }

    return { value, position };
  }

  private padWithDefaultValue(segmentValue: string, segment: FormatSegmentFull) {
    let defaultValue = (segment.default || segment.min).toFixed();
    defaultValue = padLeftZeros(defaultValue, segment.length);
    return insertAt(defaultValue, segmentValue, segment.length - segmentValue.length, segment.length);
  }

  private enrichSegmentDefinitions(segments: FormatSegment[]) {
    this.positionFormats = new Map();
    this.segments = [];
    let position = 0;
    for (const segment of segments) {
      const max = segment.max;
      const fullSegment: FormatSegmentFull = {
        ...segment,
        max: typeof max === 'number' ? () => max : max,
        start: position,
        end: position + segment.length,
      };
      this.segments.push(fullSegment);
      // insert this format segment for every char in the max value
      for (let j = 0; j < fullSegment.length; j++) {
        this.positionFormats.set(position++, fullSegment);
      }
      // skip a position for separator
      position++;
    }
  }
}

export default MaskFormat;
