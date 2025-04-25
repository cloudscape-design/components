// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.buildComponentDefinition = void 0;
const type_utils_1 = require('./type-utils');
const extractor_1 = require('./extractor');
const object_definition_1 = require('./object-definition');
function getCommentTag(description, name) {
  var _a;
  const tag = description.tags.find(tag => tag.name === name);
  return tag ? ((_a = tag.text) !== null && _a !== void 0 ? _a : '') : undefined;
}
function getCommentTags(description, name) {
  const tags = description.tags
    .filter(tag => tag.name === name)
    .map(tag => {
      if (!tag.text) {
        throw new Error(`Tag ${name} is missing text`);
      }
      return tag.text;
    });
  return tags.length > 0 ? tags : undefined;
}
function castI18nTag(tag) {
  return tag === undefined ? undefined : true;
}
function buildComponentDefinition(name, dashCaseName, propsSymbol, defaultValues, componentDescription, checker) {
  const props = (0, extractor_1.extractProps)(propsSymbol, checker);
  const types = (0, extractor_1.extractTypes)(propsSymbol, checker);
  const functions = (0, extractor_1.extractFunctions)(
    name,
    types.find(typeNode => typeNode.name.text === 'Ref'),
    checker
  );
  const regions = props.filter(prop => prop.type === 'React.ReactNode');
  const events = props.filter(prop => prop.name.match(/^on[A-Z]/));
  const onlyProps = props.filter(prop => !events.includes(prop) && !regions.includes(prop));
  return {
    name,
    dashCaseName,
    releaseStatus: 'stable',
    description: componentDescription.text,
    systemTags: getCommentTags(componentDescription, 'awsuiSystem'),
    regions: regions.map(region => ({
      name: region.name,
      displayName: getCommentTag(region.description, 'displayname'),
      description: region.description.text,
      isDefault: region.name === 'children',
      systemTags: getCommentTags(region.description, 'awsuiSystem'),
      visualRefreshTag: getCommentTag(region.description, 'visualrefresh'),
      deprecatedTag: getCommentTag(region.description, 'deprecated'),
      i18nTag: castI18nTag(getCommentTag(region.description, 'i18n')),
    })),
    functions: functions.map(func => ({
      name: func.name,
      description: func.description.text,
      returnType: (0, type_utils_1.stringifyType)(
        func.rawType.getNonNullableType().getCallSignatures()[0].getReturnType(),
        checker
      ),
      parameters: func.rawType
        .getNonNullableType()
        .getCallSignatures()[0]
        .getParameters()
        .map(param => {
          const paramType = checker.getTypeAtLocation((0, type_utils_1.extractDeclaration)(param));
          return {
            name: param.name,
            type: (0, type_utils_1.stringifyType)(paramType, checker),
          };
        }),
    })),
    properties: onlyProps.map(property => {
      const { type, inlineType } = (0, object_definition_1.getObjectDefinition)(
        property.type,
        property.rawType,
        property.rawTypeNode,
        checker
      );
      return {
        name: property.name,
        type: type,
        inlineType: inlineType,
        optional: property.isOptional,
        description: property.description.text,
        defaultValue: defaultValues[property.name],
        systemTags: getCommentTags(property.description, 'awsuiSystem'),
        visualRefreshTag: getCommentTag(property.description, 'visualrefresh'),
        deprecatedTag: getCommentTag(property.description, 'deprecated'),
        analyticsTag: getCommentTag(property.description, 'analytics'),
        i18nTag: castI18nTag(getCommentTag(property.description, 'i18n')),
      };
    }),
    events: events.map(event => {
      const { detailType, detailInlineType, cancelable } = extractEventDetails(
        event.rawType,
        event.rawTypeNode,
        checker
      );
      return {
        name: event.name,
        description: event.description.text,
        cancelable,
        detailType,
        detailInlineType,
        systemTags: getCommentTags(event.description, 'awsuiSystem'),
        deprecatedTag: getCommentTag(event.description, 'deprecated'),
      };
    }),
    types: Object.fromEntries(types.map(type => [type.name.text, {}])),
  };
}
exports.buildComponentDefinition = buildComponentDefinition;
function extractEventDetails(type, typeNode, checker) {
  var _a, _b;
  const realType = type.getNonNullableType();
  const handlerName = (_a = realType.aliasSymbol) === null || _a === void 0 ? void 0 : _a.getName();
  if (handlerName !== 'CancelableEventHandler' && handlerName !== 'NonCancelableEventHandler') {
    throw new Error(`Unknown event handler type: ${checker.typeToString(realType)}`);
  }
  const cancelable = handlerName === 'CancelableEventHandler';
  const detailType = (_b = realType.aliasTypeArguments) === null || _b === void 0 ? void 0 : _b[0];
  if (detailType && detailType.getProperties().length > 0) {
    const { type, inlineType } = (0, object_definition_1.getObjectDefinition)(
      (0, type_utils_1.stringifyType)(detailType, checker),
      detailType,
      typeNode,
      checker
    );
    return {
      detailType: type,
      detailInlineType: inlineType,
      cancelable,
    };
  }
  return { cancelable };
}
//# sourceMappingURL=component-definition.js.map
