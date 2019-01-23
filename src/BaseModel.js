export default class BaseModel
{
    constructor (...args) {
        this.fill(...args)
    }

    fill (...args) {
        return this
    }

    make (...args) {
        return new this.constructor(...args)
    }
}