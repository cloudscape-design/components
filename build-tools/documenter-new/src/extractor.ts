// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ts from 'typescript';

import {
  extractDeclaration,
  getDescription,
  isOptional,
  stringifyType,
  unwrapNamespaceDeclaration,
} from './type-utils';

export interface ExpandedProp {
  name: string;
  type: string;
  isOptional: boolean;
  rawType: ts.Type;
  description: {
    text: string | undefined;
    tags: Array<{ name: string; text: string | undefined }>;
  };
}

export function extractDefaultValues(exportSymbol: ts.Symbol, checker: ts.TypeChecker) {
  let declaration: ts.Node = extractDeclaration(exportSymbol);
  if (ts.isExportAssignment(declaration)) {
    // Traverse from "export default Something;" to the actual "Something"
    const symbol = checker.getSymbolAtLocation(declaration.expression);
    if (!symbol) {
      throw new Error('Cannot resolve symbol');
    }
    declaration = extractDeclaration(symbol);
  }
  // Extract "Something" from "const Component = Something"
  if (ts.isVariableDeclaration(declaration) && declaration.initializer) {
    declaration = declaration.initializer;
  }
  // Extract "Something" from "Something as MyComponentType"
  if (ts.isAsExpression(declaration)) {
    declaration = declaration.expression;
  }
  // Extract "Something from React.forwardRef(Something)"
  if (
    ts.isCallExpression(declaration) &&
    (declaration.expression.getText() === 'React.forwardRef' || declaration.expression.getText() === 'forwardRef')
  ) {
    declaration = declaration.arguments[0];
  }

  // In the component function, find arguments destructuring
  let argument: ts.Node | undefined;
  if (
    ts.isFunctionDeclaration(declaration) ||
    ts.isFunctionExpression(declaration) ||
    ts.isArrowFunction(declaration)
  ) {
    if (declaration.parameters.length === 0) {
      return {};
    }
    argument = declaration.parameters[0].name;
  }
  if (!argument) {
    throw new Error(`Unsupported component declaration type ${ts.SyntaxKind[declaration.kind]}`);
  }
  if (!ts.isObjectBindingPattern(argument)) {
    // if a component does not use props de-structuring, we do not detect default values
    return {};
  }
  const values: Record<string, string> = {};
  for (const element of argument.elements) {
    if (ts.isIdentifier(element.name) && element.initializer) {
      values[element.name.escapedText as string] = element.initializer.getText();
    }
  }
  return values;
}

export function extractProps(propsSymbol: ts.Symbol, checker: ts.TypeChecker) {
  const exportType = checker.getDeclaredTypeOfSymbol(propsSymbol);

  return exportType
    .getProperties()
    .map((value): ExpandedProp => {
      const declaration = extractDeclaration(value);
      const type = checker.getTypeAtLocation(declaration);
      return {
        name: value.name,
        type: stringifyType(type, checker),
        rawType: type,
        isOptional: isOptional(type),
        description: getDescription(value.getDocumentationComment(checker), declaration),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function extractFunctions(propsSymbol: ts.Symbol, checker: ts.TypeChecker) {
  const propsName = propsSymbol.getName();
  const namespaceDeclaration = [
    // if we got the namespace directly
    ...(propsSymbol.getDeclarations() ?? []),
    // find namespace declaration from the interface with the same name
    ...(checker.getDeclaredTypeOfSymbol(propsSymbol).getSymbol()?.getDeclarations() ?? []),
  ].find(decl => decl.kind === ts.SyntaxKind.ModuleDeclaration);
  const refType = unwrapNamespaceDeclaration(namespaceDeclaration)
    .map(child => checker.getTypeAtLocation(child))
    .find(type => (type.getSymbol() ?? type.aliasSymbol)?.getName() === 'Ref');

  if (!refType) {
    return [];
  }
  return refType
    .getProperties()
    .map((value): ExpandedProp => {
      const declaration = extractDeclaration(value);
      const type = checker.getTypeAtLocation(declaration);
      const realType = type.getNonNullableType();
      if (realType.getCallSignatures().length === 0) {
        throw new Error(
          `${propsName}.Ref should contain only methods, "${value.name}" has a "${stringifyType(type, checker)}" type`
        );
      }
      return {
        name: value.name,
        type: stringifyType(realType, checker),
        rawType: realType,
        isOptional: isOptional(type),
        description: getDescription(value.getDocumentationComment(checker), declaration),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function extractExports(
  componentName: string,
  exportSymbols: ts.Symbol[],
  checker: ts.TypeChecker,
  extraExports: Record<string, Array<string>>
) {
  let componentSymbol;
  let propsSymbol;
  const unknownExports: Array<string> = [];
  for (const exportSymbol of exportSymbols) {
    if (exportSymbol.name === 'default') {
      validateComponentType(componentName, exportSymbol, checker);
      componentSymbol = exportSymbol;
    } else if (exportSymbol.name === `${componentName}Props`) {
      propsSymbol = exportSymbol;
    } else if (!extraExports[componentName] || !extraExports[componentName].includes(exportSymbol.name)) {
      unknownExports.push(exportSymbol.name);
    }
  }
  // disabled until migration is complete
  // if (unknownExports.length > 0) {
  // throw new Error(`Unexpected exports in ${componentName}: ${unknownExports.join(', ')}`);
  // }
  if (!componentSymbol) {
    throw new Error(`Missing default export for ${componentName}`);
  }
  if (!propsSymbol) {
    throw new Error(`Missing ${componentName}Props export`);
  }
  return { componentSymbol, propsSymbol };
}

function validateComponentType(componentName: string, symbol: ts.Symbol, checker: ts.TypeChecker) {
  const declaration = extractDeclaration(symbol);
  let type: ts.Type;
  if (ts.isExportAssignment(declaration)) {
    // export default Something;
    type = checker.getTypeAtLocation(declaration.expression);
  } else if (ts.isFunctionDeclaration(declaration)) {
    // export default function Something() {...}
    type = checker.getTypeAtLocation(declaration);
  } else {
    throw new Error(`Unknown default export for ${componentName}`);
  }
  if (
    // React.forwardRef
    type.getSymbol()?.name !== 'ForwardRefExoticComponent' &&
    // Plain function returning JSX
    type.getCallSignatures().some(signature => {
      const returnTypeName = checker.typeToString(signature.getReturnType());
      return returnTypeName !== 'Element' && returnTypeName !== 'ReactPortal';
    })
  ) {
    throw new Error(`Unknown default export type ${checker.typeToString(type)}`);
  }
}
