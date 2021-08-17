import Fintoc from './lib/core';

// Type checking
export default Fintoc;
export { Fintoc };

// Module exports
module.exports = Fintoc;

// Allow use with the TypeScript compiler without `esModuleInterop`
module.exports.default = Fintoc;

// Expose constructor as named property
module.exports.Fintoc = Fintoc;
