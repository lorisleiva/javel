import test from 'ava'
import Model from '../src'

class DummyModel extends Model {
    //
}

test('test has attributes', t => {
    t.log(new DummyModel)
})