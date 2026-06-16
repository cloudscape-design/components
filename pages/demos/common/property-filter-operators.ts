// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
export const stringOperators = [':', '!:', '=', '!=', '^', '!^'];

export const enumOperators = [
  { operator: '=', tokenType: 'enum' },
  { operator: '!=', tokenType: 'enum' },
  ':',
  '!:',
] as const;
