import { allStatesAndSemantics, propertiesWithState } from './constants';

/**
 * Given a property and value generate all required Theme variables 
 * including state permutations for either light or dark mode.
 */
export function getPropertyVariables(name: string, value: string | Record<string, any>,  darkMode?: boolean) {
  const variableName = getVariableName(name, darkMode);
  let propertyVariables: Record<string, string> = {};

  propertyVariables = {[`${variableName}`]: typeof value === 'string' ? value : value?.default};

  if (typeof value === 'object') { 
    Object.entries(value).forEach(([state, value]) => {
      propertyVariables[`${variableName}-${state}`] = value;
    });
  }

  return(propertyVariables);
};

/**
 * Given a property name generate all Theme variable state permutations 
 * that need to be reset.
 */
export function getResetPropertyVariables(name: string) {
  const variableName = getVariableName(name);
  const hasState = propertiesWithState.indexOf(name) >= 0;
  let resetVariables: Record<string, string> = {};

  resetVariables = {[`${variableName}`]: 'initial'};
  hasState && allStatesAndSemantics.map((state) => resetVariables[`${variableName}-${state}`] = 'initial');

  return resetVariables;
};

/**
 * Create a CSS custom property name from a camelCase property string 
 * and optional dark mode value.
 */
export function getVariableName(property: string, darkMode?: boolean) {
  return `--theme-${property.replace(/([a-z]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()}${darkMode ? '-dark-mode' : ''}`;
}