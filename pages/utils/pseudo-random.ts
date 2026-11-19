/* eslint-disable header/header */
// Pseudo random numbers for deterministic screenshot and integration tests
// Source: https://stackoverflow.com/a/19303725
let seed = 1;
export default function pseudoRandom() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}
