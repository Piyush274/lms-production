 const isDefined = (str) => !!str

 const isStringArray = (value) => Array.isArray(value) && value.every((x) => typeof x === 'string')

 const isValidationError = (value) =>
  typeof value?.property !== 'undefined' && typeof value?.reason !== 'undefined'

 const replaceWhitespace = (str) => str.replace(/\s+/g, '')

 const toStringArray = (value) =>
  Array.isArray(value)
    ? value.flatMap(replaceWhitespace).filter(isDefined)
    : value?.split(',').map(replaceWhitespace).filter(isDefined)



module.exports={isDefined,isStringArray,isValidationError,replaceWhitespace,toStringArray}