// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { TagEditorProps } from '@cloudscape-design/components/tag-editor';

export const tagEditorI18nStrings: TagEditorProps.I18nStrings = {
  tagLimit: availableTags => `You can add up to ${availableTags} more tag${availableTags > 1 ? 's' : ''}.`,
};
