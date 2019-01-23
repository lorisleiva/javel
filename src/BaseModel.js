export default class BaseModel
{
    constructor (...args) {
        this.fill(...args)
    }

    fill () {
        return this
    }

    make (...args) {
        return new this.constructor(...args)
    }
}