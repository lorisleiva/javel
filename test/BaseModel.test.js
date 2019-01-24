import test from 'ava'
import { BaseModel } from '@'
const Model = class extends BaseModel {}

test('The base model can create, fill and make new models', t => {
    new Model('foo', 42)
    new Model().fill('foo', 42)
    new Model().make('foo', 42)
    t.pass()
})

test('The base model does not assign anything', t => {
    const model = new Model('foo', 42)
    t.deepEqual({ ...model }, {})
})
