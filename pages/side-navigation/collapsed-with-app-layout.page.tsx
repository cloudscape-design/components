// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import { AppLayoutProps, AppLayoutToolbar, Icon } from '~components';
import Box from '~components/box';
import BreadcrumbGroup from '~components/breadcrumb-group';
import FormField from '~components/form-field';
import Header from '~components/header';
import Input from '~components/input';
import { useMobile } from '~components/internal/hooks/use-mobile';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';
import SpaceBetween from '~components/space-between';
import { applyTheme } from '~components/theming';
import Toggle from '~components/toggle';

import labels from '../app-layout/utils/labels';

const items: SideNavigationProps.Item[] = [
  { type: 'link', text: 'Dashboard', href: '#/dashboard', icon: <Icon name="grid-view" /> },
  { type: 'link', text: 'Events', href: '#/events', icon: <Icon name="calendar" /> },
  {
    type: 'expandable-link-group',
    text: 'Projects',
    href: '#/projects',
    icon: <Icon name="folder" />,
    items: [
      { type: 'link', text: 'Project 1', href: '#/projects/1' },
      { type: 'link', text: 'Project 2', href: '#/projects/2' },
      { type: 'link', text: 'Project 3', href: '#/projects/3' },
    ],
  },
  { type: 'link', text: 'Team', href: '#/team', icon: <Icon name="group" /> },
  { type: 'link', text: 'Settings', href: '#/settings', icon: <Icon name="settings" /> },
  { type: 'divider' },
  { type: 'link', text: 'Notifications', href: '#/notifications', icon: <Icon name="notification" /> },
  { type: 'link', text: 'Documentation', href: '#/docs', icon: <Icon name="file" />, external: true },
];

const AwsSvg = (
  <svg width="28" height="16" viewBox="0 0 28 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.80429 5.81453C7.80429 6.14399 7.84113 6.41112 7.9056 6.60702C7.97928 6.80291 8.07138 7.01662 8.20033 7.24813C8.24638 7.31936 8.2648 7.3906 8.2648 7.45293C8.2648 7.54197 8.20954 7.63102 8.0898 7.72006L7.50956 8.09404C7.42667 8.14747 7.34378 8.17418 7.2701 8.17418C7.178 8.17418 7.0859 8.12966 6.99379 8.04952C6.86485 7.91595 6.75433 7.77349 6.66223 7.63102C6.57013 7.47964 6.47803 7.31046 6.37671 7.10566C5.65832 7.92486 4.75573 8.33446 3.66893 8.33446C2.89527 8.33446 2.27819 8.12075 1.82689 7.69335C1.3756 7.26594 1.14534 6.69606 1.14534 5.98371C1.14534 5.22685 1.42165 4.61245 1.98347 4.14942C2.54529 3.68639 3.29131 3.45488 4.23996 3.45488C4.5531 3.45488 4.87546 3.4816 5.21623 3.52612C5.55701 3.57064 5.907 3.64187 6.2754 3.72201V3.072C6.2754 2.39527 6.12804 1.92334 5.84252 1.6473C5.5478 1.37127 5.05045 1.2377 4.34127 1.2377C4.01891 1.2377 3.68735 1.27332 3.34657 1.35346C3.00579 1.4336 2.67423 1.53155 2.35187 1.65621C2.20451 1.71854 2.09399 1.75415 2.02952 1.77196C1.96505 1.78977 1.919 1.79868 1.88215 1.79868C1.75321 1.79868 1.68874 1.70963 1.68874 1.52264V1.08633C1.68874 0.94386 1.70716 0.837008 1.75321 0.774677C1.79926 0.712347 1.88215 0.650016 2.0111 0.587686C2.33345 0.427408 2.72028 0.293843 3.17158 0.186991C3.62288 0.0712347 4.1018 0.0178087 4.60836 0.0178087C5.70437 0.0178087 6.50566 0.258226 7.02142 0.73906C7.52798 1.21989 7.78587 1.95005 7.78587 2.92953V5.81453H7.80429ZM4.06496 7.16799C4.3689 7.16799 4.68204 7.11456 5.01361 7.00771C5.34518 6.90086 5.6399 6.70497 5.88858 6.43784C6.03594 6.26865 6.14646 6.08166 6.20172 5.86796C6.25698 5.65425 6.29382 5.39603 6.29382 5.09328V4.7193C6.02673 4.65697 5.74121 4.60354 5.44649 4.56792C5.15176 4.53231 4.86625 4.5145 4.58073 4.5145C3.96365 4.5145 3.51235 4.63025 3.20842 4.87067C2.90448 5.11109 2.75712 5.44945 2.75712 5.89467C2.75712 6.31317 2.86764 6.62483 3.0979 6.83853C3.31894 7.06114 3.6413 7.16799 4.06496 7.16799ZM11.4607 8.12966C11.2949 8.12966 11.1844 8.10295 11.1107 8.04062C11.0371 7.98719 10.9726 7.86253 10.9173 7.69335L8.75293 0.810294C8.69767 0.632208 8.67004 0.516451 8.67004 0.454121C8.67004 0.311652 8.74372 0.231513 8.89109 0.231513H9.79368C9.96868 0.231513 10.0884 0.258226 10.1529 0.320556C10.2266 0.373982 10.2818 0.498643 10.3371 0.667825L11.8844 6.5625L13.3212 0.667825C13.3672 0.489738 13.4225 0.373982 13.4962 0.320556C13.5698 0.26713 13.6988 0.231513 13.8646 0.231513H14.6014C14.7764 0.231513 14.8961 0.258226 14.9698 0.320556C15.0435 0.373982 15.1079 0.498643 15.1448 0.667825L16.6 6.63373L18.1933 0.667825C18.2486 0.489738 18.3131 0.373982 18.3776 0.320556C18.4512 0.26713 18.571 0.231513 18.7367 0.231513H19.5933C19.7407 0.231513 19.8235 0.302747 19.8235 0.454121C19.8235 0.498643 19.8143 0.543164 19.8051 0.59659C19.7959 0.650016 19.7775 0.721251 19.7407 0.819199L17.521 7.70225C17.4657 7.88034 17.4013 7.99609 17.3276 8.04952C17.2539 8.10294 17.1342 8.13856 16.9776 8.13856H16.1855C16.0105 8.13856 15.8908 8.11185 15.8171 8.04952C15.7434 7.98719 15.679 7.87143 15.6421 7.69335L14.2146 1.95005L12.7962 7.68444C12.7501 7.86253 12.6949 7.97828 12.6212 8.04062C12.5475 8.10295 12.4186 8.12966 12.2528 8.12966H11.4607ZM23.2958 8.37007C22.8169 8.37007 22.3379 8.31665 21.8774 8.2098C21.4169 8.10295 21.0577 7.98719 20.8182 7.85362C20.6709 7.77349 20.5696 7.68444 20.5327 7.6043C20.4959 7.52416 20.4775 7.43512 20.4775 7.35498V6.90086C20.4775 6.71387 20.5512 6.62483 20.6893 6.62483C20.7446 6.62483 20.7998 6.63373 20.8551 6.65154C20.9103 6.66935 20.9932 6.70496 21.0853 6.74058C21.3985 6.87415 21.7393 6.981 22.0985 7.05223C22.4669 7.12347 22.8261 7.15909 23.1945 7.15909C23.7747 7.15909 24.226 7.06114 24.5392 6.86524C24.8523 6.66935 25.0181 6.38441 25.0181 6.01933C25.0181 5.77001 24.9352 5.56521 24.7694 5.39603C24.6036 5.22685 24.2905 5.07547 23.8392 4.933L22.5037 4.53231C21.8314 4.32751 21.334 4.02476 21.0301 3.62406C20.7261 3.23227 20.5696 2.79596 20.5696 2.33294C20.5696 1.95895 20.6525 1.62949 20.8182 1.34455C20.984 1.05962 21.2051 0.810295 21.4814 0.614399C21.7577 0.409599 22.0708 0.258226 22.4392 0.151374C22.8076 0.0445217 23.1945 0 23.5997 0C23.8023 0 24.0142 0.00890433 24.2168 0.0356173C24.4286 0.0623303 24.622 0.0979477 24.8155 0.133565C24.9997 0.178087 25.1747 0.222608 25.3404 0.276034C25.5062 0.32946 25.6352 0.382886 25.7273 0.436312C25.8562 0.507547 25.9483 0.578782 26.0036 0.658921C26.0588 0.730156 26.0865 0.828103 26.0865 0.952764V1.37127C26.0865 1.55826 26.0128 1.65621 25.8746 1.65621C25.8009 1.65621 25.6812 1.62059 25.5246 1.54935C24.9997 1.31784 24.4102 1.20209 23.7563 1.20209C23.2313 1.20209 22.8169 1.28222 22.5313 1.45141C22.2458 1.62059 22.0985 1.87881 22.0985 2.24389C22.0985 2.49321 22.1906 2.70692 22.3748 2.8761C22.559 3.04528 22.8997 3.21447 23.3879 3.36584L24.6957 3.76653C25.3589 3.97133 25.8378 4.25627 26.1233 4.62135C26.4088 4.98643 26.547 5.40493 26.547 5.86796C26.547 6.25084 26.4641 6.59811 26.3075 6.90086C26.1417 7.20361 25.9207 7.47074 25.6352 7.68444C25.3496 7.90705 25.0089 8.06733 24.6128 8.18308C24.1984 8.30774 23.7655 8.37007 23.2958 8.37007Z"
      fill="currentColor"
    />
    <path
      d="M22.7521 11.1828C23.7376 11.067 25.9112 10.8177 26.298 11.2985C26.6848 11.7704 25.8651 13.7561 25.4967 14.6376C25.3862 14.9048 25.6256 15.0116 25.8743 14.8068C27.4953 13.489 27.919 10.7375 27.5874 10.3368C27.2558 9.94505 24.4099 9.60669 22.6784 10.7821C22.4113 10.9691 22.4573 11.2184 22.7521 11.1828Z"
      fill="currentColor"
    />
    <path
      d="M13.8182 16C17.6036 16 22.006 14.8513 25.0362 12.6876C25.5335 12.3314 25.1006 11.7882 24.5941 12.0109C21.1955 13.3999 17.5023 14.0767 14.1405 14.0767C9.15785 14.0767 4.34094 12.7499 0.435826 10.5595C0.0950504 10.3636 -0.162834 10.7019 0.122681 10.9512C3.73306 14.1034 8.51314 16 13.8182 16Z"
      fill="currentColor"
    />
  </svg>
);

export default function CollapsedWithAppLayoutPage() {
  const appLayoutRef = useRef<AppLayoutProps.Ref>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [activeHref, setActiveHref] = useState('#/dashboard');
  const [collapseBehavior, setCollapseBehavior] = useState<'collapse' | 'hide'>('collapse');
  const [navigationSideBorderHide, setNavigationSideBorderHide] = useState(false);
  const [navigationCollapsedWidth, setNavigationCollapsedWidth] = useState(54);
  const [hideToolbar, setHideToolbar] = useState(true);
  const [hideTools, setHideTools] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const [headerIcon, setHeaderIcon] = useState(true);
  const isMobile = useMobile();

  const header = { text: 'Project 3', href: '#/projects/3' };
  const headerWithIcon = { ...header, logo: { svg: AwsSvg } };
  const resolvedNavigationTriggerHide = isMobile && collapseBehavior === 'collapse' ? false : hideToolbar;

  useEffect(() => {
    const { reset } = applyTheme({
      baseThemeId: 'visual-refresh',
      theme: {
        tokens: navigationSideBorderHide
          ? {
              colorBorderLayoutSideNavigation: 'transparent',
            }
          : {},
      },
    });

    return () => reset();
  }, [navigationSideBorderHide]);

  return (
    <AppLayoutToolbar
      ref={appLayoutRef}
      toolsHide={hideTools}
      navigationTriggerHide={resolvedNavigationTriggerHide}
      navigationOpen={navOpen}
      navigationCloseBehavior={collapseBehavior}
      navigationCollapsedWidth={navigationCollapsedWidth}
      onNavigationChange={({ detail }) => setNavOpen(detail.open)}
      ariaLabels={labels}
      breadcrumbs={
        isMobile ? (
          <BreadcrumbGroup
            items={[
              { text: 'Home', href: '#/' },
              { text: 'Projects', href: '#/projects' },
              { text: 'Project 3', href: '#/projects/3' },
            ]}
          />
        ) : undefined
      }
      navigation={
        <SideNavigation
          header={showHeader ? (!headerIcon ? header : headerWithIcon) : undefined}
          activeHref={activeHref}
          collapsed={!navOpen && collapseBehavior === 'collapse'}
          items={items}
          onFollow={e => {
            e.preventDefault();
            setActiveHref(e.detail.href);
          }}
        />
      }
      content={
        <SpaceBetween size="l">
          <Header variant="h1">Collapsed Navigation with AppLayout</Header>
          <Box>
            <SpaceBetween size="m">
              <Box variant="p">
                This page demonstrates the <code>navigationCloseBehavior</code> prop on AppLayoutToolbar. When set to{' '}
                <code>&quot;collapse&quot;</code>, the navigation shows a collapsed icon rail instead of disappearing
                completely when closed.
              </Box>
              <Box>Current page: {activeHref}</Box>
              <Toggle
                checked={collapseBehavior === 'collapse'}
                onChange={({ detail }) => setCollapseBehavior(detail.checked ? 'collapse' : 'hide')}
              >
                navigationCloseBehavior = &quot;collapse&quot;
              </Toggle>
              <Toggle
                checked={navigationSideBorderHide}
                onChange={({ detail }) => setNavigationSideBorderHide(detail.checked)}
              >
                Hide navigation side border (theme token)
              </Toggle>
              <Toggle checked={hideToolbar} onChange={({ detail }) => setHideToolbar(detail.checked)}>
                Set navigationTriggerHide
              </Toggle>
              <Toggle checked={hideTools} onChange={({ detail }) => setHideTools(detail.checked)}>
                Hide tools
              </Toggle>
              <FormField label="navigationCollapsedWidth">
                <Input
                  value={String(navigationCollapsedWidth)}
                  type="number"
                  onChange={event => setNavigationCollapsedWidth(parseInt(event.detail.value))}
                />
              </FormField>
              <Toggle checked={showHeader} onChange={({ detail }) => setShowHeader(detail.checked)}>
                Show side nav header
              </Toggle>
              {showHeader && (
                <Box padding={{ left: 'xxl' }}>
                  <Toggle checked={headerIcon} onChange={({ detail }) => setHeaderIcon(detail.checked)}>
                    Include icon
                  </Toggle>
                </Box>
              )}
              <Box color="text-status-inactive">
                Current state: navigation is{' '}
                {navOpen ? 'open' : collapseBehavior === 'collapse' ? 'collapsed (rail)' : 'closed (hidden)'}
              </Box>
            </SpaceBetween>
          </Box>
        </SpaceBetween>
      }
    />
  );
}
