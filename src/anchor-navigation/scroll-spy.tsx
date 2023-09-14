// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useEffect, useState } from 'react';

const isBrowser = typeof window !== 'undefined';

export default function useScrollSpy({
  hrefs,
  scrollSpyOffset,
  activeHref,
}: {
  hrefs: string[];
  scrollSpyOffset: number;
  activeHref?: string;
}): string | undefined {
  const [currentHref, setCurrentHref] = useState<string | undefined>(activeHref);
  const [lastAnchorExists, setLastAnchorExists] = useState(false);

  useEffect(() => {
    setLastAnchorExists(isBrowser && !!document.getElementById(hrefs[hrefs.length - 1]?.slice(1)));
  }, [hrefs]);

  // Get the bounding rectangle of an element by href
  const getRectByHref = useCallback(href => {
    return document.getElementById(href.slice(1))?.getBoundingClientRect();
  }, []);

  // Check if we're scrolled to the bottom of the page
  const isPageBottom = useCallback(() => {
    return lastAnchorExists && Math.ceil(window.scrollY) >= Math.floor(document.body.scrollHeight - window.innerHeight);
  }, [lastAnchorExists]);

  // Find the href for which the element is within the viewport
  const findHrefInView = useCallback(() => {
    return hrefs.find(href => {
      const rect = getRectByHref(href);
      return rect && rect.bottom <= window.innerHeight && rect.top >= scrollSpyOffset;
    });
  }, [getRectByHref, scrollSpyOffset, hrefs]);

  // Find the last href where its element is above or within the viewport
  const findLastHrefInView = useCallback(() => {
    return [...hrefs].reverse().find(href => {
      const rect = getRectByHref(href);
      return rect && rect.bottom <= window.innerHeight;
    });
  }, [getRectByHref, hrefs]);

  // Scroll event handler
  const handleScroll = useCallback(() => {
    if (activeHref || !isBrowser) {
      return;
    }

    const { scrollY } = window;

    if (document.body.scrollHeight > window.innerHeight && isPageBottom()) {
      setCurrentHref(hrefs[hrefs.length - 1]);
    } else {
      setCurrentHref(findHrefInView() || (scrollY > 0 ? findLastHrefInView() : undefined));
    }
  }, [activeHref, isPageBottom, findHrefInView, findLastHrefInView, hrefs]);

  useEffect(() => {
    if (isBrowser) {
      handleScroll();
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  return currentHref;
}
