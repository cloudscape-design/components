// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ts from 'typescript';

import { extractDeclaration } from './type-utils.js';

export function extractDefaultValues(exportSymbol: ts.Symbol, checker: ts.TypeChecker) {
  // Find the component function
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

export function validateExports(
  componentName: string,
  exportSymbols: Array<ts.Symbol>,
  checker: ts.TypeChecker,
  extraExports: Record<string, Array<string>>
) {
  for (const exportSymbol of exportSymbols) {
    if (exportSymbol.name === 'default') {
      const declaration = extractDeclaration(exportSymbol);
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
        type.getCallSignatures().some(signature => signature.getReturnType().getSymbol()?.getName() !== 'Element')
      ) {
        throw new Error(`Unknown default export type ${checker.typeToString(type)}`);
      }
    } else if (exportSymbol.name !== `${componentName}Props`) {
      if (extraExports[componentName]?.includes(exportSymbol.name)) {
        continue;
      }
      throw new Error(`Unexpected export ${exportSymbol.name} from ${componentName}`);
    }
  }
}
