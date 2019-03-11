export default class ModuleRegistrar
{
    static register(name, module) {
        this._modules = Object.assign(
            {},
            this._modules,
            { [name]: module }
        )
    }

    static resolve(name) {
        if (!this._modules || !this._modules[name]) {
            throw new Error(`Module "${name}" can not be resolved because is it not registered.`)
        }

        return this._modules[name]
    }

    static forget(name) {
        if (this._modules) {
            delete this._modules[name]
        }
    }

    static forgetAll() {
        delete this._modules
    }
}

export const registerModule = (name, module) => ModuleRegistrar.register(name, module)

export const resolveModule = name => ModuleRegistrar.resolve(name)

export const forgetModule = name => ModuleRegistrar.forget(name)

export const forgetAllModules = () => ModuleRegistrar.forgetAll()
