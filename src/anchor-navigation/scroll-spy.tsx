// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useEffect, useState } from 'react';

const isBrowser = typeof window !== 'undefined';

export default function useScrollSpy({
  hrefs,
  scrollSpyOffset,
}: {
  hrefs: string[];
  scrollSpyOffset: number;
}): [
  string | undefined,
  React.Dispatch<React.SetStateAction<string | undefined>>,
  React.Dispatch<React.SetStateAction<boolean>>
] {
  const [currentHref, setCurrentHref] = useState<string>();
  const [scrollY, setScrollY] = useState(isBrowser ? window.pageYOffset : 0);
  const [disableTracking, setDisableTracking] = useState(false);

  // Scroll event handler
  const updateScroll = useCallback(() => {
    if (isBrowser) {
      setScrollY(window.pageYOffset);
    }
  }, []);

  // Get the bounding rectangle of an element by href
  const getRectByHref = useCallback(href => {
    const element = document.getElementById(href.slice(1));
    return element?.getBoundingClientRect();
  }, []);

  // Check if we're scrolled to the bottom of the page
  const isPageBottom = useCallback(() => {
    const lastAnchorId = hrefs[hrefs.length - 1]?.slice(1);
    const lastAnchorElementExists = document.getElementById(lastAnchorId);
    return !!lastAnchorElementExists && scrollY >= Math.floor(document.body.scrollHeight - window.innerHeight);
  }, [scrollY, hrefs]);

  // Find the href for which the element is within the viewport plus EXTRA_OFFSET
  const findHrefInView = useCallback(() => {
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

  useEffect(() => {
    if (isBrowser) {
      window.addEventListener('scroll', updateScroll, {
        capture: false,
        passive: true,
      });

      return () => {
        window.removeEventListener('scroll', updateScroll);
      };
    }
  }, [updateScroll]);

  useEffect(() => {
    if (disableTracking || !isBrowser) {
      return;
    }

    // Main logic to get the new active href
    let newCurrentHref;

    if (isPageBottom()) {
      newCurrentHref = hrefs[hrefs.length - 1];
    } else {
      newCurrentHref = findHrefInView() || (scrollY > 0 ? findLastHrefInView() : undefined);
    }

    if (newCurrentHref !== undefined) {
      setCurrentHref(newCurrentHref);
    }
  }, [findHrefInView, findLastHrefInView, isPageBottom, scrollY, hrefs, disableTracking]);

  return [currentHref, setCurrentHref, setDisableTracking];
}
