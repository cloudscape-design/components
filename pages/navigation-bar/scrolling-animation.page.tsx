// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import { Container, Header } from '~components';
import BreadcrumbGroup from '~components/breadcrumb-group';
import Button from '~components/button';
import ButtonGroup from '~components/button-group';
import Link from '~components/link';
import NavigationBar from '~components/navigation-bar';
import SpaceBetween from '~components/space-between';

const filler = Array.from({ length: 30 }, (_, i) => (
  <Container key={i} header={<Header variant="h2">Section {i + 1}</Header>}>
    <p>Content block {i + 1}. Scroll to observe navigation bar behavior.</p>
  </Container>
));

export default function NavigationBarScrollingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [showSecondary, setShowSecondary] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      // Hide secondary bar when scrolling down past 200px, show when scrolling up
      setShowSecondary(y < 200 || y < lastScrollY.current);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const primaryOpacity = Math.max(0.7, 1 - scrollY / 500);

  return (
    <article>
      <h1>Navigation Bar — Scrolling Animations</h1>
      <p>Demonstrates scroll-driven behaviors: opacity fade, show/hide secondary bar, and scroll-to-top.</p>

      <div style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        {/* Primary bar with opacity fade on scroll */}
        <div style={{ opacity: primaryOpacity, transition: 'opacity 0.15s ease' }}>
          <NavigationBar
            ariaLabel="Primary navigation"
            startContent={
              <Link href="#" fontSize="heading-m" color="inverted">
                Scroll Demo
              </Link>
            }
            centerContent={
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>scrollY: {Math.round(scrollY)}px</span>
            }
            endContent={
              <ButtonGroup
                variant="icon"
                ariaLabel="Actions"
                items={[
                  { type: 'icon-button', id: 'notifications', text: 'Notifications', iconName: 'notification' },
                  { type: 'icon-button', id: 'settings', text: 'Settings', iconName: 'settings' },
                ]}
                onItemClick={() => {}}
              />
            }
          />
        </div>

        {/* Secondary bar that hides on scroll-down, shows on scroll-up */}
        <div
          style={{
            maxHeight: showSecondary ? 50 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.25s ease',
          }}
        >
          <NavigationBar
            variant="secondary"
            ariaLabel="Page toolbar"
            startContent={
              <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                <Button iconName="menu" variant="icon" ariaLabel="Navigation" />
                <BreadcrumbGroup
                  items={[
                    { text: 'Home', href: '#' },
                    { text: 'Projects', href: '#' },
                    { text: 'Current', href: '#' },
                  ]}
                />
              </SpaceBetween>
            }
            endContent={
              <ButtonGroup
                variant="icon"
                ariaLabel="Tools"
                items={[
                  { type: 'icon-button', id: 'refresh', text: 'Refresh', iconName: 'refresh' },
                  { type: 'icon-button', id: 'info', text: 'Info', iconName: 'status-info' },
                ]}
                onItemClick={() => {}}
              />
            }
          />
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <SpaceBetween size="l">{filler}</SpaceBetween>
      </div>

      {/* Scroll-to-top FAB */}
      {scrollY > 300 && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1001 }}>
          <Button iconName="angle-up" variant="primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Top
          </Button>
        </div>
      )}
    </article>
  );
}
