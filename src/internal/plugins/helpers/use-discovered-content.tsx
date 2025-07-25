// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import {
  AlertFlashContentApiInternal,
  AlertFlashContentResult,
  ReplacementType,
} from '../controllers/alert-flash-content';
import { reportRuntimeApiWarning } from './metrics';

export function createUseDiscoveredContent(componentName: string, controller: AlertFlashContentApiInternal) {
  return function useDiscoveredContent({
    type,
    header,
    children,
  }: {
    type: string;
    header: React.ReactNode;
    children: React.ReactNode;
  }) {
    const instanceId = useUniqueId(`${componentName}-discovered-content`);
    const headerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const replacementHeaderRef = useRef<HTMLDivElement>(null);
    const replacementContentRef = useRef<HTMLDivElement>(null);
    const [initialHidden, setInitialHidden] = useState(() =>
      controller.initialCheck({
        instanceId,
        type,
        header,
        content: children,
      })
    );
    const [headerReplacementType, setFoundHeaderReplacement] = useState<ReplacementType>('original');
    const [contentReplacementType, setFoundContentReplacement] = useState<ReplacementType>('original');
    const mountedProvider = useRef<AlertFlashContentResult | undefined>();

    useEffect(() => {
      const context = { instanceId, type, headerRef, contentRef };

      setInitialHidden(false);

      return controller.onContentRegistered(provider => {
        let mounted = true;

        function checkMounted(methodName: string) {
          if (!mounted) {
            reportRuntimeApiWarning(
              `${componentName}-content-replacer`,
              `"${methodName}" called after component unmounted`
            );
            return false;
          }
          return true;
        }

        mountedProvider.current = provider.runReplacer(context, {
          hideHeader() {
            if (checkMounted('hideHeader')) {
              setFoundHeaderReplacement('remove');
            }
          },
          restoreHeader() {
            if (checkMounted('restoreHeader')) {
              setFoundHeaderReplacement('original');
            }
          },
          replaceHeader(replacer: (container: HTMLElement) => void) {
            if (checkMounted('replaceHeader')) {
              replacer(replacementHeaderRef.current!);
              setFoundHeaderReplacement('replaced');
            }
          },
          hideContent() {
            if (checkMounted('hideContent')) {
              setFoundContentReplacement('remove');
            }
          },
          restoreContent() {
            if (checkMounted('restoreContent')) {
              setFoundContentReplacement('original');
            }
          },
          replaceContent(replacer: (container: HTMLElement) => void) {
            if (checkMounted('replaceContent')) {
              replacer(replacementContentRef.current!);
              setFoundContentReplacement('replaced');
            }
          },
        });

        return () => {
          mountedProvider.current?.unmount({
            replacementHeaderContainer: replacementHeaderRef.current!,
            replacementContentContainer: replacementContentRef.current!,
          });
          mounted = false;
        };
      });
    }, [instanceId, type]);

    useEffect(() => {
      mountedProvider.current?.update();
    }, [type, header, children]);

    return {
      initialHidden,
      headerReplacementType,
      contentReplacementType,
      headerRef: headerRef as React.Ref<HTMLDivElement>,
      replacementHeaderRef: replacementHeaderRef as React.Ref<HTMLDivElement>,
      contentRef: contentRef as React.Ref<HTMLDivElement>,
      replacementContentRef: replacementContentRef as React.Ref<HTMLDivElement>,
    };
  };
}
