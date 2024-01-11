// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import Icon, { IconProps } from '../../../lib/components/icon';
import createWrapper from '../../../lib/components/test-utils/dom';
import styles from '../../../lib/components/icon/styles.css.js';

let consoleWarnSpy: jest.SpyInstance;
afterEach(() => {
  consoleWarnSpy?.mockRestore();
});

describe('Icon Component', () => {
  test('renders with accessibility-related attributes', () => {
    const { container } = render(<Icon name="calendar" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('focusable', 'false');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  test('renders with normal size by default', () => {
    const { container } = render(<Icon name="calendar" />);
    expect(container.firstElementChild).toHaveClass(styles['size-normal']);
  });

  test('renders with proper size class correctly', () => {
    const { container } = render(<Icon name="calendar" size="large" />);
    expect(container.firstElementChild).toHaveClass(styles['size-large']);
  });

  test('renders with proper variant class correctly', () => {
    const { container } = render(<Icon name="calendar" variant="inverted" />);
    expect(container.firstElementChild).toHaveClass(styles['variant-inverted']);
  });

  describe('size = inherit', () => {
    test('renders with proper class name', () => {
      const { container } = render(<Icon size="inherit" name="settings" />);
      expect(container.firstElementChild).toHaveClass(styles['icon-flex-height']);
    });
  });

  describe('gen ai icon', () => {
    test('filled icon renders with accessibility-related attributes', () => {
      const { container } = render(<Icon name="gen-ai" size="small" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('data-testid', 'gen-ai-filled');
      expect(svg).toHaveAttribute('focusable', 'false');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    test('only renders filled icon only for small size', () => {
      const sizes: IconProps.Size[] = ['normal', 'medium', 'big', 'large', 'inherit'];

      sizes.forEach(size => {
        const { container } = render(<Icon name="gen-ai" size={size} />);
        const svg = container.querySelector('svg');
        expect(svg).not.toHaveAttribute('data-testid', 'gen-ai-filled');
      });
    });
  });

  describe('custom icons', () => {
    const url = 'data:image/png;base64,aaaa';
    const svg = (
      <svg className="test-svg">
        <circle className="test-svg-inner" cx="8" cy="8" r="7" />
      </svg>
    );

    test('should render a custom icon when a url is provided', () => {
      const { container } = render(<Icon url={url} />);
      const img = container.querySelector('img');
      expect(img).toHaveAttribute('src', url);
      expect(img).not.toHaveAttribute('alt');
    });

    test('should render a custom icon with alternate text when a url and alt are provided', () => {
      const { container } = render(<Icon url={url} alt="custom icon" />);
      const img = container.querySelector('img');
      expect(img).toHaveAttribute('src', url);
      expect(img).toHaveAttribute('alt', 'custom icon');
    });

    test('should render a custom icon when both name and url are provided', () => {
      const { container } = render(<Icon url={url} name="calendar" />);
      const img = container.querySelector('img');
      expect(img).toHaveAttribute('src', url);
    });

    test('should render an svg when provided', () => {
      const { container } = render(<Icon svg={svg} />);
      const wrapper = createWrapper(container);
      expect(wrapper.findByClassName('test-svg')).not.toBeNull();
    });

    test('should set aria-hidden="true" when svg is provided', () => {
      const { container } = render(<Icon svg={svg} />);
      const wrapper = createWrapper(container);
      expect(wrapper.findIcon()!.getElement()).toHaveAttribute('aria-hidden', 'true');
    });

    test('should raise a warning when both url and svg are provided', () => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      render(<Icon url={url} svg={svg} />);
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[AwsUi] [Icon] You have specified both `url` and `svg`. `svg` will take precedence and `url` will be ignored.'
      );
    });

    test('should render the svg if url, name, and svg are provided', () => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const { container } = render(<Icon url={url} svg={svg} name="calendar" />);
      const wrapper = createWrapper(container);
      expect(wrapper.find('img')).toBeNull();
      expect(wrapper.findByClassName('test-svg')).not.toBeNull();
    });
  });

  test('should not render anything when neither name, url, or svg are provided', () => {
    const { container } = render(<Icon />);
    expect(container.firstElementChild).toBeEmptyDOMElement();
  });

  describe('Prototype Pollution attack', () => {
    beforeEach(() => {
      (Object.prototype as any).attack = '<b>vulnerable</b>';
    });

    afterEach(() => {
      delete (Object.prototype as any).attack;
    });

    test('name property is not vulnerable', () => {
      const props = { name: 'attack' };
      const { container } = render(<Icon {...(props as any)} />);

      expect(container).not.toHaveTextContent('vulnerable');
    });
  });
});
