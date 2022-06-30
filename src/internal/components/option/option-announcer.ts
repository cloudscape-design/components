// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { OptionDefinition, OptionGroup } from './interfaces';

function defaultOptionDescription(option: OptionDefinition, parentGroup: OptionGroup | undefined) {
  return [parentGroup && parentGroup.label, option.label || option.value, option.description, option.labelTag]
    .concat(option.tags)
    .filter(el => !!el)
    .join(' ');
}

export default defaultOptionDescription;
