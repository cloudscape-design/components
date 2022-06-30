// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { OptionDefinition } from '~components/internal/components/option/interfaces';
import { SelectProps } from '~components/select';

const labels = ['monitor', 'speakers', 'keyboard', 'mouse', 'computer'];
const descriptions = ['Description', 'Short description', 'This is a long description'];
const tags = ['fast', 'fan', 'cpu', 'small', 'large', 'max'];
const icons = ['share', 'call', 'copy', 'edit'] as const;

let uid = 0;
let valueUid = 0;

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

const chance50 = () => getRandomInt(2) === 1;
const chance10 = () => getRandomInt(10) === 1;
const chance30 = () => getRandomInt(3) === 1;

const random = <T>(array: T[]) => {
  return array[getRandomInt(array.length)];
};

const generateValue = () => {
  return 'value' + valueUid++;
};

const generateLabel = () => {
  return random(labels) + '_' + uid++;
};

const generateDescription = () => {
  return chance50() ? random(descriptions) : undefined;
};

const generateTags = () => {
  return chance50() ? [...Array(getRandomInt(tags.length))].map(() => tags[getRandomInt(tags.length)]) : undefined;
};

const generateLabelTag = () => {
  return chance50() ? tags[getRandomInt(tags.length)] : undefined;
};

const generateIcon = () => (chance50() ? icons[getRandomInt(icons.length)] : undefined);

const randomOption = (): OptionDefinition => {
  count++;
  return {
    value: generateValue(),
    label: generateLabel(),
    disabled: chance10(),
    description: generateDescription(),
    iconName: generateIcon(),
    tags: generateTags(),
    labelTag: generateLabelTag(),
    filteringTags: generateTags(),
  };
};

const randomOptionGroup = (): SelectProps.OptionGroup => {
  const childCount = getRandomInt(8);
  return {
    label: 'group_' + generateLabel(),
    options: [...Array(childCount)].map(() => {
      return randomOption();
    }),
    disabled: chance10(),
  };
};

let count = 0;
const generateOptions = (n: number) => {
  count = 0;
  const options = [...Array(n)].reduce((acc: Array<SelectProps.Option | SelectProps.OptionGroup>) => {
    if (chance30()) {
      acc.push(randomOptionGroup());
    } else {
      acc.push(randomOption());
    }
    return acc;
  }, []);

  return { count, options };
};

export { generateOptions };
