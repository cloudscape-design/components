// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useEffect, useState } from 'react';

export default function useScrollSpy({
  hrefs,
}: {
  hrefs: string[];
}): [
  string | undefined,
  React.Dispatch<React.SetStateAction<string | undefined>>,
  React.Dispatch<React.SetStateAction<boolean>>
] {
  const [currentHref, setCurrentHref] = useState<string>();
  const [scrollY, setScrollY] = useState(window.pageYOffset);
  const [disableTracking, setDisableTracking] = useState(false);

  // Value, in pixels, accounting for some padding in the scroll spy logic
  const EXTRA_OFFSET = 200;

  // Scroll event handler
  const updateScroll = useCallback(() => {
    setScrollY(window.pageYOffset);
  }, []);

  // Get the bounding rectangle of an element by href
  const getRectByHref = useCallback(href => {
    const element = document.getElementById(href.slice(1));
    return element?.getBoundingClientRect();
  }, []);

  // Check if we're scrolled to the bottom of the page
  const isPageBottom = useCallback(() => {
    return scrollY === document.body.scrollHeight - window.innerHeight;
  }, [scrollY]);

  // Find the href for which the element is within the viewport plus EXTRA_OFFSET
  const findHrefInView = useCallback(() => {
    return hrefs.find(href => {
      const rect = getRectByHref(href);
      return rect && rect.bottom <= window.innerHeight && rect.bottom - EXTRA_OFFSET >= 0;
    });
  }, [getRectByHref, hrefs]);

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
    window.addEventListener('scroll', updateScroll, {
      capture: false,
      passive: true,
    });
    return () => {
      window.removeEventListener('scroll', updateScroll);
    };
  }, [updateScroll, scrollY]);

  useEffect(() => {
    if (disableTracking) {
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
  }, [findHrefInView, findLastHrefInView, isPageBottom, scrollY, hrefs, EXTRA_OFFSET, disableTracking]);

  return [currentHref, setCurrentHref, setDisableTracking];
}
