import {getEntity} from '../utils'
import isJSON from 'is-json'

const edit = async({fetchToState, params, location})=> {
    const entity = getEntity(params.name)
    return await fetchToState(typeof (entity.actions.show.url) == 'function' ? entity.actions.show.url(params, location.query) : `${entity.url}/${params.id}`, {
        params: {...location.query},
        key: `${params.name}Edit`
    })

}

const list = async({fetchToState, params, location:{query:{filters: queryFilters, ...query}}})=> {
    const {url: baseUrl, actions:{list: {url: listUrl, params: listParams}}} = getEntity(params.name)
    let args = {}

    let filters = queryFilters && isJSON(queryFilters) ? JSON.parse(queryFilters) : undefined

    switch (typeof listUrl) {
        case 'function': {
            const result = listUrl(params, {...query, filters})
            args = typeof result == 'object' ? result : {
                url: result,
                params: Object.assign(query, listParams, {filters})
            }
        }
            break;
        case 'string':
            args = {
                url: listUrl,
                params: Object.assign(query, listParams, {filters})
            }
            break;
        default:
            args = {
                url: baseUrl,
                params: Object.assign(query, listParams, {filters})
            }
            break;
    }

    return await fetchToState(args.url, {
        params: args.params,
        key: `${params.name}List`
    })

}

const show = async({fetchToState, params, location})=> {
    const entity = getEntity(params.name)
    return await fetchToState(typeof (entity.actions.show.url) == 'function' ? entity.actions.show.url(params) : `${entity.url}/${params.id}`, {
        params: Object.assign({...location.query.params}, entity.actions.show.params),
        key: `${params.name}Show`
    })
}

export {edit, list, show}