// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { AppLayoutProps } from '../../../app-layout/interfaces';
import InternalBox from '../../../box/internal';
import InternalFileTokenGroup from '../../../file-token-group/internal';
import InternalFormField from '../../../form-field/internal';
import InternalHeader from '../../../header/internal';
import InternalPromptInput from '../../../prompt-input/internal';
import { SelectProps } from '../../../select/interfaces';
import InternalSelect from '../../../select/internal';
import InternalSpaceBetween from '../../../space-between/internal';
import { fireNonCancelableEvent } from '../../events';
import { GenaiContextPanelProps } from './interfaces';

export { GenaiContextPanelProps };

const DEFAULT_MIN_ROWS = 3;
const DEFAULT_MAX_ROWS = 8;

/**
 * [WIP / v0 — AWSUI-52880] Global GenAI context panel.
 *
 * A controlled, opt-in composition of existing Cloudscape primitives that gives a
 * generative-AI assistant a single place to surface and edit its "context":
 * the system prompt, the active model, and the files currently in scope.
 *
 * It renders plain content and is meant to be dropped into the `content` slot of
 * an AppLayout drawer. Use {@link createGenaiContextPanelDrawer} to build a ready
 * to use `AppLayoutProps.Drawer` item.
 */
export default function GenaiContextPanel({
  systemPrompt = '',
  systemPromptPlaceholder,
  systemPromptReadOnly,
  systemPromptMinRows = DEFAULT_MIN_ROWS,
  systemPromptMaxRows = DEFAULT_MAX_ROWS,
  onSystemPromptChange,
  models = [],
  selectedModelId = null,
  onSelectedModelChange,
  contextFiles = [],
  onContextFilesChange,
  i18nStrings = {},
}: GenaiContextPanelProps) {
  const modelOptions: Array<SelectProps.Option> = models.map(model => ({
    value: model.id,
    label: model.label,
    description: model.description,
  }));
  const selectedOption = modelOptions.find(option => option.value === selectedModelId) ?? null;

  const handleDismissFile = (fileIndex: number) => {
    const nextFiles = contextFiles.filter((_, index) => index !== fileIndex);
    fireNonCancelableEvent(onContextFilesChange, { files: nextFiles });
  };

  return (
    <InternalSpaceBetween size="l">
      <InternalHeader variant="h2" description={i18nStrings.headerDescription}>
        {i18nStrings.headerText ?? 'Context'}
      </InternalHeader>

      <InternalFormField
        label={i18nStrings.systemPromptLabel ?? 'System prompt'}
        description={i18nStrings.systemPromptDescription}
        stretch={true}
      >
        <InternalPromptInput
          value={systemPrompt}
          placeholder={systemPromptPlaceholder}
          readOnly={systemPromptReadOnly}
          minRows={systemPromptMinRows}
          maxRows={systemPromptMaxRows}
          ariaLabel={i18nStrings.systemPromptLabel ?? 'System prompt'}
          onChange={({ detail }) => fireNonCancelableEvent(onSystemPromptChange, { value: detail.value })}
        />
      </InternalFormField>

      {models.length > 0 && (
        <InternalFormField
          label={i18nStrings.modelSelectorLabel ?? 'Model'}
          description={i18nStrings.modelSelectorDescription}
          stretch={true}
        >
          <InternalSelect
            selectedOption={selectedOption}
            options={modelOptions}
            placeholder={i18nStrings.modelSelectorPlaceholder ?? 'Select a model'}
            onChange={({ detail }) =>
              fireNonCancelableEvent(onSelectedModelChange, {
                selectedModelId: detail.selectedOption.value ?? '',
              })
            }
          />
        </InternalFormField>
      )}

      <InternalFormField
        label={i18nStrings.contextFilesLabel ?? 'Files in context'}
        description={i18nStrings.contextFilesDescription}
        stretch={true}
      >
        {contextFiles.length === 0 ? (
          <InternalBox color="text-body-secondary">
            {i18nStrings.contextFilesEmptyText ?? 'No files added to the assistant context yet.'}
          </InternalBox>
        ) : (
          <InternalFileTokenGroup
            alignment="vertical"
            items={contextFiles.map(file => ({ file }))}
            showFileSize={true}
            showFileLastModified={true}
            onDismiss={({ detail }) => handleDismissFile(detail.fileIndex)}
            i18nStrings={{
              removeFileAriaLabel:
                i18nStrings.removeFileAriaLabel ??
                ((fileIndex, fileName) => `Remove ${fileName} (file ${fileIndex + 1})`),
            }}
          />
        )}
      </InternalFormField>
    </InternalSpaceBetween>
  );
}

export interface CreateGenaiContextPanelDrawerOptions extends GenaiContextPanelProps {
  /**
   * The id of the drawer. Defaults to `genai-context-panel`.
   */
  id?: string;

  /**
   * ARIA labels for the drawer. When omitted, the header text (or a sensible
   * default) is used for the drawer name.
   */
  ariaLabels?: AppLayoutProps.DrawerAriaLabels;

  /**
   * Adds a badge to the drawer trigger.
   */
  badge?: boolean;

  /**
   * Whether the drawer is resizable. Defaults to `true`.
   */
  resizable?: boolean;

  /**
   * The starting width of the drawer in pixels. Defaults to `360`.
   */
  defaultSize?: number;
}

/**
 * Builds an `AppLayoutProps.Drawer` item that renders the GenAI context panel.
 * Spread the result into the AppLayout `drawers` array — this keeps the feature
 * fully additive and opt-in.
 */
export function createGenaiContextPanelDrawer(
  options: CreateGenaiContextPanelDrawerOptions = {}
): AppLayoutProps.Drawer {
  const { id = 'genai-context-panel', ariaLabels, badge, resizable = true, defaultSize = 360, ...panelProps } = options;

  const drawerName = panelProps.i18nStrings?.headerText ?? 'GenAI context';

  return {
    id,
    badge,
    resizable,
    defaultSize,
    trigger: { iconName: 'gen-ai' },
    ariaLabels: ariaLabels ?? { drawerName, closeButton: 'Close', triggerButton: drawerName, resizeHandle: 'Resize' },
    content: <GenaiContextPanel {...panelProps} />,
  };
}
