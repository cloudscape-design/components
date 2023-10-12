// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
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
              info={<InfoLink />}
            >
              Testing Custom Drawers!
            </Header>
          }
        >
          <Containers />
        </ContentLayout>
      }
      tools={<HelpPanelContent appLayoutRef={appLayoutRef} />}
    />
  );
}

function InfoLink() {
  function notifyInfoLinkClick() {
    document.body.dispatchEvent(new CustomEvent('info-link-click'));
  }

  return (
    <Link variant="info" onFollow={notifyInfoLinkClick}>
      Info
    </Link>
  );
}

function HelpPanelContent({ appLayoutRef }: { appLayoutRef: React.RefObject<AppLayoutProps.Ref> }) {
  useEffect(() => {
    function handleInfoLinkClick() {
      appLayoutRef.current!.openTools();
    }

    document.body.addEventListener('info-link-click', handleInfoLinkClick);
    return () => document.body.removeEventListener('info-link-click', handleInfoLinkClick);
  }, [appLayoutRef]);

  return <HelpPanel header={<h2>Info</h2>}>Here is some info for you!</HelpPanel>;
}
