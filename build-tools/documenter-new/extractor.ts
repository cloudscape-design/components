// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ts from 'typescript';

export function validateExports(componentName: string, exportSymbols: Array<ts.Symbol>, checker: ts.TypeChecker) {
  for (const exportSymbol of exportSymbols) {
    if (exportSymbol.name === 'default') {
      const declaration = exportSymbol.getDeclarations()[0];
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
        type.getSymbol().name !== 'ForwardRefExoticComponent' &&
        // Plain function returning JSX
        type.getCallSignatures().some(signature => signature.getReturnType().getSymbol()?.getName() !== 'Element')
      ) {
        throw new Error(`Unknown default export type ${checker.typeToString(type)}`);
      }
    } else if (exportSymbol.name !== `${componentName}Props`) {
      if (
        (componentName === 'FileDropzone' && exportSymbol.name === 'useFilesDragging') ||
        (componentName === 'TagEditor' && exportSymbol.name === 'getTagsDiff')
      ) {
        // known exceptions
        continue;
      }
      throw new Error(`Component ${componentName} exports ${exportSymbol.name} which is not ${componentName}Props`);
    }
  }
}
