// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { VirtualScrollModel } from './virtual-scroll';
import { useEffectOnUpdate } from '../use-effect-on-update';
import { InternalVirtualItem, Virtualizer } from './interfaces';

interface VirtualScrollProps<Item extends object> {
  items: readonly Item[];
  defaultItemSize: number;
  containerRef: React.RefObject<HTMLElement>;
}

export function useVirtualScroll<Item extends object>(props: VirtualScrollProps<Item>): Virtualizer {
  const [frame, setFrame] = useState<readonly InternalVirtualItem[]>([]);
  const [totalSize, setTotalSize] = useState(0);

  const [model, setModel] = useState<null | VirtualScrollModel<Item>>(null);
  useLayoutEffect(() => {
    if (props.containerRef.current) {
      setModel(
        new VirtualScrollModel({
          ...props,
          scrollContainer: props.containerRef.current,
          onFrameChange: ({ frame, totalSize }) => {
            frame && setFrame(frame);
            setTotalSize(totalSize);
          },
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.containerRef]);

  useEffect(() => {
    return () => {
      model && model.cleanup();
    };
  }, [model]);

  const itemRefs = useRef<{ [index: number]: null | HTMLElement }>({});
  const setItemRef = useCallback(
    (index: number, node: null | HTMLElement) => {
      itemRefs.current[index] = node;
      if (node && model) {
        model.setItemSize(index, node.getBoundingClientRect().height || props.defaultItemSize);
      }
    },
    [model, props.defaultItemSize]
  );

  // TODO: use model.update on every render
  // inside model check item identity. If in cache - use available size
  // if not - use default size and request measurement
  // for every measurement arriving request update
  // batch update requests with a small time interval
  // execute updates if needed -> compare if the values are actually different

  // TODO: use model in ref
  useEffect(() => {
    model && model.setItems(props.items);
  }, [model, props.items]);

  // TODO: use model in ref
  useEffectOnUpdate(() => {
    model && model.setDefaultItemSize(props.defaultItemSize);
  }, [model, props.defaultItemSize]);

  // TODO: is there a better way to achieve the same?
  // Can't rely on setFrame because the items and frame can become out of sync in case items shrink.
  const safeFrame =
    frame[frame.length - 1]?.index >= props.items.length
      ? frame.filter(item => item.index < props.items.length)
      : frame;
  const decoratedFrame = safeFrame.map(item => ({
    ...item,
    measureRef: (node: null | HTMLElement) => setItemRef(item.index, node),
  }));

  return {
    frame: decoratedFrame,
    totalSize,
    scrollToIndex: (index: number) => model?.scrollToIndex(index),
  };
}

export function VirtualItemMeasure({
  children,
  measure,
}: {
  children: (ref: React.RefObject<HTMLDivElement>) => React.ReactElement;
  measure: (node: null | HTMLElement) => void;
}): React.ReactElement {
  const itemRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  useEffect(() => {
    if (itemRef.current) {
      measure(itemRef.current);
    }
    return () => measure(null);
  });
  return children(itemRef);
}
