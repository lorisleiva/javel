/**
 * Returns the first argument if it's an array.
 */
export const arrayOrArgs = args =>
    Array.isArray(args[0]) ? args[0] : args

/**
 * Omits the key-value pairs corresponding to the given keys from an object.
 * @see https://github.com/30-seconds/30-seconds-of-code#omit
 */
export const omit = (obj, ...arr) => {
    arr = arrayOrArgs(arr)
    return Object.keys(obj)
        .filter(k => !arr.includes(k))
        .reduce((acc, key) => ((acc[key] = obj[key]), acc), {})
}

/**
 * Converts a string to snake case.
 * @see https://github.com/30-seconds/30-seconds-of-code#tosnakecase
 */
export const snakeCase = str => str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('_')

/**
 * Joins all given URL segments together, then normalizes the resulting URL.
 * @see https://github.com/30-seconds/30-seconds-of-code#urljoin-
 */
export const URLJoin = (...args) => arrayOrArgs(args)
    .join('/')
    .replace(/\/+/g, '/')
    .replace(/^(.+):\//, '$1://')
    .replace(/^file:/, 'file:/')
    .replace(/\/(\?|&|#[^!])/g, '$1')
    .replace(/\?/g, '&')
    .replace('&', '?')

/**
 * Deep flattens an array.
 * @see https://github.com/30-seconds/30-seconds-of-code#deepflatten
 */
export const flatten = arr =>
    [].concat(...arr.map(v => (Array.isArray(v) ? flatten(v) : v)))

/**
 * Iterates over all own properties of an object, running a callback for each one.
 * @see https://github.com/30-seconds/30-seconds-of-code#forown
 */
export const forOwn = (obj, fn) => 
    Object.keys(obj).forEach(key => fn(obj[key], key, obj))

/**
 * Checks if a dependency is available and returns it.
 * This checks only on window until dynamic import are safer.
 * Should still work with Laravel default's axios dependency.
 */
export const getDependency = name =>
    typeof window !== 'undefined' && window.hasOwnProperty(name) ? window[name] : false