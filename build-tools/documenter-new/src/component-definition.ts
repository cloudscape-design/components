// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ts from 'typescript';

import type { ExpandedProp } from './extractor';
import type {
  ComponentDefinition,
  ComponentFunction,
  ComponentProperty,
  ComponentRegion,
  EventHandler,
} from './interfaces';
import { getObjectDefinition } from './object-definition';
import { extractDeclaration, stringifyType } from './type-utils';

function getCommentTag(property: ExpandedProp, name: string) {
  const tag = property.description.tags.find(tag => tag.name === name);
  return tag ? tag.text ?? '' : undefined;
}

function castI18nTag(tag: string | undefined) {
  return tag === undefined ? undefined : true;
}

export function buildComponentDefinition(
  name: string,
  props: Array<ExpandedProp>,
  functions: Array<ExpandedProp>,
  defaultValues: Record<string, string>,
  checker: ts.TypeChecker
): ComponentDefinition {
  const regions = props.filter(prop => prop.type === 'React.ReactNode');
  const events = props.filter(prop => prop.name.match(/^on[A-Z]/));
  const onlyProps = props.filter(prop => !events.includes(prop) && !regions.includes(prop));

  return {
    name,
    releaseStatus: 'stable',
    regions: regions.map(
      (region): ComponentRegion => ({
        name: region.name,
        displayName: getCommentTag(region, 'displayname'),
        description: region.description.text,
        isDefault: region.name === 'children',
        visualRefreshTag: getCommentTag(region, 'visualrefresh'),
        deprecatedTag: getCommentTag(region, 'deprecated'),
        i18nTag: castI18nTag(getCommentTag(region, 'i18n')),
      })
    ),
    functions: functions.map(
      (func): ComponentFunction => ({
        name: func.name,
        description: func.description.text,
        returnType: stringifyType(func.rawType.getNonNullableType().getCallSignatures()[0].getReturnType(), checker),
        parameters: func.rawType
          .getNonNullableType()
          .getCallSignatures()[0]
          .getParameters()
          .map((param): ComponentFunction['parameters'][0] => {
            const paramType = checker.getTypeAtLocation(extractDeclaration(param));
            return {
              name: param.name,
              type: stringifyType(paramType, checker),
            };
          }),
      })
    ),
    properties: onlyProps.map(
      (property): ComponentProperty => ({
        name: property.name,
        type: property.type,
        inlineType: getObjectDefinition(property.rawType, checker),
        optional: property.isOptional,
        description: property.description.text,
        defaultValue: defaultValues[property.name],
        visualRefreshTag: getCommentTag(property, 'visualrefresh'),
        deprecatedTag: getCommentTag(property, 'deprecated'),
        analyticsTag: getCommentTag(property, 'analytics'),
        i18nTag: castI18nTag(getCommentTag(property, 'i18n')),
      })
    ),
    events: events.map((event): EventHandler => {
      const { detailType, detailInlineType, cancelable } = extractEventDetails(event.rawType, checker);
      return {
        name: event.name,
        description: event.description.text,
        cancelable,
        detailType,
        detailInlineType,
        deprecatedTag: getCommentTag(event, 'deprecated'),
      };
    }),
  };
}

function extractEventDetails(type: ts.Type, checker: ts.TypeChecker) {
  const realType = type.getNonNullableType();
  const handlerName = realType.aliasSymbol?.getName();
  if (handlerName !== 'CancelableEventHandler' && handlerName !== 'NonCancelableEventHandler') {
    throw new Error(`Unknown event handler type: ${checker.typeToString(realType)}`);
  }
  const cancelable = handlerName === 'CancelableEventHandler';
  const detailType = realType.aliasTypeArguments?.[0];
  if (detailType && detailType.getProperties().length > 0) {
    return {
      detailType: stringifyType(detailType, checker),
      detailInlineType: getObjectDefinition(detailType, checker),
      cancelable,
    };
  }
  return { cancelable };
}
