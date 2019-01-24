import { mix, BaseModel } from '@'

export default { withMixins, withModel }

export function withMixins (...mixins) {
    const Model = class extends mix(BaseModel).with(...mixins) {}
    return withModel(Model)
}

export function withModel (Model) {
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