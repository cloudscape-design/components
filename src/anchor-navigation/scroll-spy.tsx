// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useEffect, useMemo, useState } from 'react';

const isBrowser = typeof window !== 'undefined';

export default function useScrollSpy({
  hrefs,
  scrollSpyOffset,
  disableScrollSpy = false,
}: {
  hrefs: string[];
  scrollSpyOffset: number;
  disableScrollSpy?: boolean;
}): [string | undefined, React.Dispatch<React.SetStateAction<string | undefined>>] {
  const [currentHref, setCurrentHref] = useState<string>();

  const lastAnchorElementExists = useMemo(() => !!document.getElementById(hrefs[hrefs.length - 1]?.slice(1)), [hrefs]);

  // Get the bounding rectangle of an element by href
  const getRectByHref = useCallback(href => {
    const element = document.getElementById(href.slice(1));
    return element?.getBoundingClientRect();
  }, []);

  // Check if we're scrolled to the bottom of the page
  const isPageBottom = useCallback(() => {
    return lastAnchorElementExists && window.scrollY >= Math.floor(document.body.scrollHeight - window.innerHeight);
  }, [lastAnchorElementExists]);

  // Find the href for which the element is within the viewport
  const findHrefInView = useCallback(() => {
    console.log('Here');
    return hrefs.find(href => {
      const rect = getRectByHref(href);
      return rect && rect.bottom <= window.innerHeight && rect.bottom - scrollSpyOffset >= 0;
    });
  }, [getRectByHref, scrollSpyOffset, hrefs]);

  // Find the last href where its element is above or within the viewport
  const findLastHrefInView = useCallback(() => {
    return hrefs
      .slice()
      .reverse()
      .find(href => {
        const rect = getRectByHref(href);
        return rect && rect.bottom <= window.innerHeight;
      });
  }, [getRectByHref, hrefs]);

  // Scroll event handler
  const handleScroll = useCallback(() => {
    if (disableScrollSpy || !isBrowser) {
      return;
    }

    const scrollY = window.scrollY;

    if (isPageBottom()) {
      setCurrentHref(hrefs[hrefs.length - 1]);
    } else {
      setCurrentHref(findHrefInView() || (scrollY > 0 ? findLastHrefInView() : undefined));
    }
  }, [disableScrollSpy, isPageBottom, findHrefInView, findLastHrefInView, hrefs]);

  useEffect(() => {
    if (isBrowser) {
      handleScroll();
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  return [currentHref, setCurrentHref];
}
