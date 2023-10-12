// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import { AppLayout, ContentLayout, Header, HelpPanel, Link } from '~components';
import appLayoutLabels from './utils/labels';
import { AppLayoutProps } from '~components/app-layout';
import { Breadcrumbs, Containers } from './utils/content-blocks';
import './utils/external-widget';

export default function WithDrawers() {
  const appLayoutRef = useRef<AppLayoutProps.Ref>(null);

  return (
    <AppLayout
      ref={appLayoutRef}
      ariaLabels={appLayoutLabels}
      breadcrumbs={<Breadcrumbs />}
      content={
        <ContentLayout
          header={
            <Header
              variant="h1"
              description="Sometimes you need custom drawers to get the job done."
              info={<InfoLink data-testid="info-link-header" pathSlug="header" />}
            >
              Testing Custom Drawers!
            </Header>
          }
          disableOverlap={true}
        >
          <Header info={<InfoLink data-testid="info-link-content" pathSlug="content" />}>Content</Header>
          <Containers />
        </ContentLayout>
      }
      tools={<HelpPanelContent appLayoutRef={appLayoutRef} />}
    />
  );
}

function InfoLink({ pathSlug, ...rest }: { pathSlug: string }) {
  function notifyInfoLinkClick() {
    document.body.dispatchEvent(new CustomEvent('info-link-click', { detail: { pathSlug } }));
  }

  return (
    <Link variant="info" onFollow={notifyInfoLinkClick} {...rest}>
      Info
    </Link>
  );
}

function HelpPanelContent({ appLayoutRef }: { appLayoutRef: React.RefObject<AppLayoutProps.Ref> }) {
  const [helpPathSlug, setHelpPathSlug] = useState('default');
  useEffect(() => {
    function handleInfoLinkClick(event: Event) {
      appLayoutRef.current!.openTools();
      setHelpPathSlug((event as CustomEvent).detail.pathSlug);
    }

    document.body.addEventListener('info-link-click', handleInfoLinkClick);
    return () => document.body.removeEventListener('info-link-click', handleInfoLinkClick);
  }, [appLayoutRef]);

  return <HelpPanel header={<h2>Info</h2>}>Here is some info for you: {helpPathSlug}</HelpPanel>;
}
