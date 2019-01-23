// Models and mixins included.
export { default } from './Model'
export { default as Model } from './Model'
export { default as BaseModel } from './BaseModel'
export { default as HasAttributes } from './HasAttributes'
export { default as HasRelationships } from './HasRelationships'
export { default as MakesRequests } from './MakesRequests'
export { default as KeepsParentRelationship } from './KeepsParentRelationship'

// Extra mixins available.
export { default as GeneratesUniqueKey } from './GeneratesUniqueKey'
export { default as UsesMethodFieldWithFormData } from './UsesMethodFieldWithFormData'

/**
 * Open up the mixin API from mixwith.js.
 * @see https://github.com/justinfagnani/mixwith.js
 */
export { mix, Mixin } from 'mixwith'