// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ts from 'typescript';

import { isOptional, stringifyType } from './type-utils.ts';
import type {
  ComponentDefinition,
  ComponentFunction,
  ComponentProperty,
  ComponentRegion,
  EventHandler,
  FunctionDefinition,
  ObjectDefinition,
  UnionTypeDefinition,
} from './types.ts';

export interface ExpandedProp {
  name: string;
  type: string;
  isOptional: boolean;
  rawType: ts.Type;
  // expandedType?: {
  //   name: string;
  //   description: string;
  // }[];
  description: {
    text: string;
    tags: Array<{ name: string; text: string | undefined }>;
  };
}

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
            const paramType = checker.getTypeAtLocation(param.getDeclarations()[0]);
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
        inlineType: getObjectDefinition(property.name, property.rawType, checker),
        optional: property.isOptional,
        description: property.description.text,
        defaultValue: undefined,
        visualRefreshTag: getCommentTag(property, 'visualrefresh'),
        deprecatedTag: getCommentTag(property, 'deprecated'),
        analyticsTag: getCommentTag(property, 'analytics'),
        i18nTag: castI18nTag(getCommentTag(property, 'i18n')),
      })
    ),
    events: events.map((event): EventHandler => {
      const { detailType, detailInlineType, cancelable } = extractEventDetails(event.name, event.rawType, checker);
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

function stringifyFlags(type: ts.Type) {
  const flags = [];
  for (const [key, value] of Object.entries(ts.TypeFlags)) {
    if (typeof value !== 'number') {
      continue;
    }
    if (type.flags & value) {
      flags.push(key);
    }
  }
  return flags;
}

function isArrayType(type: ts.Type) {
  const symbol = type.getSymbol();
  if (!symbol) {
    return false;
  }
  return symbol.getName() === 'Array' || symbol.getName() === 'ReadonlyArray';
}

function getObjectDefinition(
  name: string,
  type: ts.Type,
  checker: ts.TypeChecker
): ObjectDefinition | FunctionDefinition | UnionTypeDefinition | undefined {
  const realType = type.getNonNullableType();
  const realTypeName = stringifyType(realType, checker);
  if (
    realType.flags & ts.TypeFlags.String ||
    realType.flags & ts.TypeFlags.StringLiteral ||
    realType.flags & ts.TypeFlags.Boolean ||
    realType.flags & ts.TypeFlags.Number ||
    isArrayType(realType) ||
    realTypeName === 'HTMLElement'
  ) {
    // do not expand built-in Javascript methods on primitive values
    return;
  }
  if (realType.isUnionOrIntersection() && realType.types.every(subtype => subtype.isStringLiteral())) {
    return {
      name: realTypeName,
      type: 'union',
      values: realType.types.map(subtype => (subtype as ts.StringLiteralType).value),
    };
  }
  if (realType.getProperties().length > 0) {
    return {
      name: realTypeName,
      type: 'object',
      properties: realType
        .getProperties()
        .map(prop => {
          const propType = checker.getTypeAtLocation(prop.getDeclarations()[0]);
          return {
            name: prop.getName(),
            type: stringifyType(propType, checker),
            optional: isOptional(propType),
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name)),
    };
  }
  if (realType.getCallSignatures().length > 0) {
    if (realType.getCallSignatures().length > 1) {
      throw new Error('Multiple call signatures are not supported');
    }
    const signature = realType.getCallSignatures()[0];

    return {
      name: realTypeName,
      type: 'function',
      returnType: stringifyType(signature.getReturnType(), checker),
      parameters: signature.getParameters().map(param => {
        const paramType = checker.getTypeAtLocation(param.getDeclarations()[0]);
        return {
          name: param.getName(),
          type: stringifyType(paramType, checker),
        };
      }),
    };
  }
  return;
}

function extractEventDetails(name: string, type: ts.Type, checker: ts.TypeChecker) {
  const realType = type.getNonNullableType();
  const cancelable = realType.aliasSymbol?.getName() === 'CancelableEventHandler';
  // if (name === 'onActiveHrefChange') {
  //   debugger;
  // }
  const detailType = realType.aliasTypeArguments?.[0];
  if (detailType && detailType.getProperties().length > 0) {
    return {
      detailType: stringifyType(detailType, checker),
      detailInlineType: getObjectDefinition(name, detailType, checker),
      cancelable,
    };
  }
  return { cancelable };
}
