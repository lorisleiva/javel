import { mix } from 'mixwith'
import BaseModel from './BaseModel'
import HasAttributes from './HasAttributes'
import HasRelationships from './HasRelationships'
import KeepsParentRelationship from './KeepsParentRelationship'
import MakesRequests from './MakesRequests'

export default class Model extends mix(BaseModel).with(HasAttributes, HasRelationships, KeepsParentRelationship, MakesRequests)
{
    //
}