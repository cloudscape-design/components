// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { NonCancelableEventHandler } from '../../../types/events';

// [WIP / v0 — AWSUI-52880] Global GenAI context panel.
//
// This is an INTERNAL, opt-in composition and is intentionally NOT part of the
// public package API yet. It composes existing Cloudscape primitives to provide
// a reusable "context" surface for a generative-AI assistant (system prompt,
// model selection, and files currently in context), designed to live inside an
// AppLayout drawer.
export interface GenaiContextPanelProps {
  /**
   * The current system prompt / instructions given to the model.
   * The panel is fully controlled — provide `onSystemPromptChange` to update it.
   */
  systemPrompt?: string;

  /**
   * Placeholder shown in the system prompt editor when it is empty.
   */
  systemPromptPlaceholder?: string;

  /**
   * When set, the system prompt editor is read-only (view only).
   */
  systemPromptReadOnly?: boolean;

  /**
   * Minimum number of rows for the system prompt editor. Defaults to `3`.
   */
  systemPromptMinRows?: number;

  /**
   * Maximum number of rows for the system prompt editor. Defaults to `8`.
   */
  systemPromptMaxRows?: number;

  /**
   * Called when the user edits the system prompt.
   */
  onSystemPromptChange?: NonCancelableEventHandler<GenaiContextPanelProps.SystemPromptChangeDetail>;

  /**
   * The list of models the user can pick from for this conversation.
   */
  models?: ReadonlyArray<GenaiContextPanelProps.Model>;

  /**
   * The id of the currently selected model (matches `Model.id`).
   */
  selectedModelId?: string | null;

  /**
   * Called when the user selects a different model.
   */
  onSelectedModelChange?: NonCancelableEventHandler<GenaiContextPanelProps.ModelChangeDetail>;

  /**
   * Files that are currently part of the assistant's context. Rendered as a
   * dismissible list so the user can review and remove them.
   */
  contextFiles?: ReadonlyArray<File>;

  /**
   * Called when the user removes a file from context.
   */
  onContextFilesChange?: NonCancelableEventHandler<GenaiContextPanelProps.ContextFilesChangeDetail>;

  /**
   * An object containing all the localized strings required by the panel.
   */
  i18nStrings?: GenaiContextPanelProps.I18nStrings;
}

export namespace GenaiContextPanelProps {
  export interface Model {
    id: string;
    label: string;
    description?: string;
  }

  export interface SystemPromptChangeDetail {
    value: string;
  }

  export interface ModelChangeDetail {
    selectedModelId: string;
  }

  export interface ContextFilesChangeDetail {
    files: File[];
  }

  export interface I18nStrings {
    headerText?: string;
    headerDescription?: string;
    systemPromptLabel?: string;
    systemPromptDescription?: string;
    modelSelectorLabel?: string;
    modelSelectorDescription?: string;
    modelSelectorPlaceholder?: string;
    contextFilesLabel?: string;
    contextFilesDescription?: string;
    contextFilesEmptyText?: string;
    removeFileAriaLabel?: (fileIndex: number, fileName: string) => string;
  }
}
