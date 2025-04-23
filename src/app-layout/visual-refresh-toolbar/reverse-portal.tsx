// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Internally, the portalNode must be for either HTML or SVG elements
const ELEMENT_TYPE_HTML = 'html';
const ELEMENT_TYPE_SVG = 'svg';

interface BaseOptions {
  attributes?: { [key: string]: string };
}

type HtmlOptions = BaseOptions & {
  containerElement?: keyof HTMLElementTagNameMap;
};

type SvgOptions = BaseOptions & {
  containerElement?: keyof SVGElementTagNameMap;
};

type Options = HtmlOptions | SvgOptions;

type Component<P> = React.Component<P> | React.ComponentType<P>;

type ComponentProps<C extends Component<any>> = C extends Component<infer P> ? P : never;

interface PortalNodeBase<C extends Component<any>> {
  // Used by the out portal to send props back to the real element
  // Hooked by InPortal to become a state update (and thus rerender)
  setPortalProps(p: ComponentProps<C>): void;
  // Used to track props set before the InPortal hooks setPortalProps
  getInitialPortalProps(): ComponentProps<C>;
  // Move the node from wherever it is, to this parent, replacing the placeholder
  mount(newParent: Node, placeholder: Node): void;
  // If mounted, unmount the node and put the initial placeholder back
  // If an expected placeholder is provided, only unmount if that's still that was the
  // latest placeholder we replaced. This avoids some race conditions.
  unmount(expectedPlaceholder?: Node): void;
}
export interface HtmlPortalNode<C extends Component<any> = Component<any>> extends PortalNodeBase<C> {
  element: HTMLElement;
  elementType: typeof ELEMENT_TYPE_HTML;
}
export interface SvgPortalNode<C extends Component<any> = Component<any>> extends PortalNodeBase<C> {
  element: SVGElement;
  elementType: typeof ELEMENT_TYPE_SVG;
}
type AnyPortalNode<C extends Component<any> = Component<any>> = HtmlPortalNode<C> | SvgPortalNode<C>;

const validateElementType = (domElement: Element, elementType: typeof ELEMENT_TYPE_HTML | typeof ELEMENT_TYPE_SVG) => {
  const ownerDocument = (domElement.ownerDocument ?? document) as any;
  // Cast document to `any` because Typescript doesn't know about the legacy `Document.parentWindow` field, and also
  // doesn't believe `Window.HTMLElement`/`Window.SVGElement` can be used in instanceof tests.
  const ownerWindow = ownerDocument.defaultView ?? ownerDocument.parentWindow ?? window; // `parentWindow` for IE8 and earlier

  switch (elementType) {
    case ELEMENT_TYPE_HTML:
      return domElement instanceof ownerWindow.HTMLElement;
    case ELEMENT_TYPE_SVG:
      return domElement instanceof ownerWindow.SVGElement;
    default:
      throw new Error(`Unrecognized element type "${elementType}" for validateElementType.`);
  }
};

// This is the internal implementation: the public entry points set elementType to an appropriate value
const createPortalNode = <C extends Component<any>>(
  elementType: typeof ELEMENT_TYPE_HTML | typeof ELEMENT_TYPE_SVG,
  options?: Options
): AnyPortalNode<C> => {
  let initialProps = {} as ComponentProps<C>;

  let parent: Node | undefined;
  let lastPlaceholder: Node | undefined;

  const element = document.createElement(options?.containerElement ?? 'div');

  if (options && typeof options === 'object' && options.attributes) {
    for (const [key, value] of Object.entries(options.attributes)) {
      element.setAttribute(key, value);
    }
  }

  const portalNode: AnyPortalNode<C> = {
    element,
    elementType,
    setPortalProps: (props: ComponentProps<C>) => {
      initialProps = props;
    },
    getInitialPortalProps: () => {
      return initialProps;
    },
    mount: (newParent: HTMLElement, newPlaceholder: HTMLElement) => {
      if (newPlaceholder === lastPlaceholder) {
        // Already mounted - noop.
        return;
      }
      portalNode.unmount();

      // To support SVG and other non-html elements, the portalNode's elementType needs to match
      // the elementType it's being rendered into
      if (newParent !== parent) {
        if (!validateElementType(newParent, elementType)) {
          throw new Error(
            `Invalid element type for portal: "${elementType}" portalNodes must be used with ${elementType} elements, but OutPortal is within <${newParent.tagName}>.`
          );
        }
      }

      newParent.replaceChild(portalNode.element, newPlaceholder);

      parent = newParent;
      lastPlaceholder = newPlaceholder;
    },
    unmount: (expectedPlaceholder?: Node) => {
      if (expectedPlaceholder && expectedPlaceholder !== lastPlaceholder) {
        // Skip unmounts for placeholders that aren't currently mounted
        // They will have been automatically unmounted already by a subsequent mount()
        return;
      }

      if (parent && lastPlaceholder) {
        parent.replaceChild(lastPlaceholder, portalNode.element);

        parent = undefined;
        lastPlaceholder = undefined;
      }
    },
  } as AnyPortalNode<C>;

  return portalNode;
};

interface InPortalProps {
  node: AnyPortalNode;
  children: React.ReactNode;
}

class InPortal extends React.PureComponent<InPortalProps, { nodeProps: object }> {
  constructor(props: InPortalProps) {
    super(props);
    this.state = {
      nodeProps: this.props.node.getInitialPortalProps(),
    };
  }

  addPropsChannel = () => {
    Object.assign(this.props.node, {
      setPortalProps: (props: object) => {
        // Rerender the child node here if/when the out portal props change
        this.setState({ nodeProps: props });
      },
    });
  };

  componentDidMount() {
    this.addPropsChannel();
  }

  componentDidUpdate() {
    this.addPropsChannel();
  }

  render() {
    const { children, node } = this.props;

    return ReactDOM.createPortal(
      React.Children.map(children, child => {
        if (!React.isValidElement(child)) {
          return child;
        }
        return React.cloneElement(child, this.state.nodeProps);
      }),
      node.element
    );
  }
}

type OutPortalProps<C extends Component<any>> = {
  node: AnyPortalNode<C>;
} & Partial<ComponentProps<C>>;

class OutPortal<C extends Component<any>> extends React.PureComponent<OutPortalProps<C>> {
  private placeholderNode = React.createRef<HTMLElement>();
  private currentPortalNode?: AnyPortalNode<C>;

  constructor(props: OutPortalProps<C>) {
    super(props);
    this.passPropsThroughPortal();
  }

  passPropsThroughPortal() {
    const propsForTarget = Object.assign({}, this.props, { node: undefined });
    this.props.node.setPortalProps(propsForTarget);
  }

  componentDidMount() {
    const node = this.props.node as AnyPortalNode<C>;
    this.currentPortalNode = node;

    const placeholder = this.placeholderNode.current!;
    const parent = placeholder.parentNode!;
    node.mount(parent, placeholder);
    this.passPropsThroughPortal();
  }

  componentDidUpdate() {
    // We re-mount on update, just in case we were unmounted (e.g. by
    // a second OutPortal, which has now been removed)
    const node = this.props.node as AnyPortalNode<C>;

    // If we're switching portal nodes, we need to clean up the current one first.
    if (this.currentPortalNode && node !== this.currentPortalNode) {
      this.currentPortalNode.unmount(this.placeholderNode.current!);
      this.currentPortalNode.setPortalProps({} as ComponentProps<C>);
      this.currentPortalNode = node;
    }

    const placeholder = this.placeholderNode.current!;
    const parent = placeholder.parentNode!;
    node.mount(parent, placeholder);
    this.passPropsThroughPortal();
  }

  componentWillUnmount() {
    const node = this.props.node as AnyPortalNode<C>;
    node.unmount(this.placeholderNode.current!);
    node.setPortalProps({} as ComponentProps<C>);
  }

  render() {
    // Render a placeholder to the DOM, so we can get a reference into
    // our location in the DOM, and swap it out for the portaled node.
    const tagName = this.props.node.element.tagName;

    // SVG tagName is lowercase and case sensitive, HTML is uppercase and case insensitive.
    // React.createElement expects lowercase first letter to treat as non-component element.
    // (Passing uppercase type won't break anything, but React warns otherwise:)
    // https://github.com/facebook/react/blob/8039f1b2a05d00437cd29707761aeae098c80adc/CHANGELOG.md?plain=1#L1984
    const type = this.props.node.elementType === ELEMENT_TYPE_HTML ? tagName.toLowerCase() : tagName;

    return React.createElement(type, { ref: this.placeholderNode });
  }
}

const createHtmlPortalNode = createPortalNode.bind(null, ELEMENT_TYPE_HTML) as <
  C extends Component<any> = Component<any>,
>(
  options?: HtmlOptions
) => HtmlPortalNode<C>;

export { createHtmlPortalNode, InPortal, OutPortal };
