import { isJustGiving } from '../../utils/client'

import {
  deserializePage as deserializeEDHPage,
  fetchPages as fetchEDHPages,
  createPage as createEDHPage,
  updatePage as updateEDHPage
} from './everydayhero'

import {
  deserializePage as deserializeJGPage,
  fetchPages as fetchJGPages,
  createPage as createJGPage,
  updatePage as updateJGPage
} from './justgiving'

/**
* @function deserializer for supporter pages
*/
export const deserializePage = (page) => (
  isJustGiving()
    ? deserializeJGPage(page)
    : deserializeEDHPage(page)
)

/**
* @function fetches pages from the supporter api
*/
export const fetchPages = (page) => (
  isJustGiving()
    ? fetchJGPages(page)
    : fetchEDHPages(page)
)

/**
 * @function create page from the supporter api
 */
export const createPage = (params) => (
  isJustGiving()
    ? createJGPage(params)
    : createEDHPage(params)
)

/**
 * @function update page from the supporter api
 */
export const updatePage = (pageId, params) => (
  isJustGiving()
    ? updateJGPage(pageId, params)
    : updateEDHPage(pageId, params)
)
