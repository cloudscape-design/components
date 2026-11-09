// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

interface MatchableOption {
  label?: unknown;
  value?: string;
  disabled?: boolean;
  options?: ReadonlyArray<MatchableOption>;
}

function selectableOptions<T extends MatchableOption>(options: ReadonlyArray<T>): T[] {
  const result: T[] = [];
  for (const option of options) {
    if (option.options) {
      if (!option.disabled) {
        result.push(...(option.options as ReadonlyArray<T>).filter(child => !child.disabled));
      }
    } else if (!option.disabled) {
      result.push(option);
    }
  }
  return result;
}

const labelOf = (option: MatchableOption) => (typeof option.label === 'string' ? option.label : undefined);

export function matchOption<T extends MatchableOption>(
  options: ReadonlyArray<T> | undefined,
  wanted: unknown
): T | null {
  const candidates = selectableOptions(options ?? []);
  const text = String(wanted);
  const lower = text.toLowerCase();
  const steps: Array<(option: T) => boolean> = [
    option => option.value === text,
    option => labelOf(option) === text,
    option => labelOf(option)?.toLowerCase() === lower,
    option => option.value?.toLowerCase() === lower,
  ];
  for (const step of steps) {
    const matches = candidates.filter(step);
    if (matches.length === 1) {
      return matches[0];
    }
    if (matches.length > 1) {
      return null;
    }
  }
  return null;
}

export function parseBoolean(next: unknown): boolean | null {
  if (next === true || next === 'true' || next === 1 || next === '1') {
    return true;
  }
  if (next === false || next === 'false' || next === 0 || next === '0') {
    return false;
  }
  return null;
}
