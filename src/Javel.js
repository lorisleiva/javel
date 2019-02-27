export default class Javel
{
    static registerOptionalModule(name, dependency) {
        this._optionalModules = Object.assign(
            {},
            this._optionalModules,
            { [name]: dependency }
        )
    }

    static resolveOptionalModule(name) {
        if (!this._optionalModules || !this._optionalModules[name]) {
            throw new Error(`Optional "${name}" module can not be resolved because is it not registered.`)
        }

        return this._optionalModules[name]
    }

    static forgetOptionalModule(name) {
        if (this._optionalModules) {
            delete this._optionalModules[name]
        }
    }

    static forgetOptionalModules() {
        delete this._optionalModules
    }
}
