import { mix, BaseModel, Mixin } from '@'

function withMixins (...mixins) {
    mixins = parseMixins(...mixins)
    const Model = class extends mix(BaseModel).with(...mixins) {}
    return withModel(Model)
}

function parseMixins (...mixins) {
    return mixins.map(mixin => {
        if (typeof mixin !== 'object') return mixin
        return Mixin(superclass => {
            const wrappedMixin = class extends superclass {}
            wrappedMixin.prototype = Object.assign(wrappedMixin.prototype, mixin)
            return wrappedMixin
        })
    })
}

function withModel (Model) {
    /**
     * @param tags Article <-[n-n]-> Tag
     * @param comments Article <-[1-n]-> Comment
     * @param author Article <-[n-1]-> User
     */
    const Article = class extends Model {
        relationships () {
            return {
                tags: Tag,
                comments: Comment,
                author: User,
            }
        }
    }
    
    /**
     * @param article Comment <-[n-1]-> Article
     * @param author Comment <-[n-1]-> User
     */
    const Comment = class extends Model {
        relationships () {
            return {
                article: Article,
                author: User,
            }
        }
    }
    
    /**
     * @param articles Tag <-[n-n]-> Article
     */
    const Tag = class extends Model {
        relationships () {
            return {
                articles: Article,
            }
        }
    }
    
    /**
     * @param articles User <-[1-n]-> Article
     * @param comments User <-[1-n]-> Comment
     */
    const User = class extends Model {
        relationships () {
            return {
                articles: Article,
                comments: Comment,
            }
        }
    }

    return { Model, Article, Comment, Tag, User }
}

export default { withMixins, withModel, parseMixins }
