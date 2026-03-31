// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * PostCSS plugin that wraps all rules in a @layer.
 * This allows consumer-defined styles to override component styles without !important.
 *
 * Usage in postcss config:
 *   require('./postcss-layer-wrap.cjs')({ layerName: 'awsui-components' })
 */
const PLUGIN_NAME = 'postcss-layer-wrap';

/** @type {import('postcss').PluginCreator} */
module.exports = ({ layerName = 'awsui-components' } = {}) => ({
  postcssPlugin: PLUGIN_NAME,
  OnceExit(root, { AtRule }) {
    // Skip if the file already has a @layer wrapping all content
    if (root.nodes.length === 1 && root.nodes[0].type === 'atrule' && root.nodes[0].name === 'layer') {
      return;
    }

    const layer = new AtRule({ name: 'layer', params: layerName });
    // Move all existing nodes into the layer
    layer.append(root.nodes);
    root.removeAll();
    root.append(layer);
  },
});

module.exports.postcss = true;
