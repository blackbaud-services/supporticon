import { isJustGiving } from '../../utils/client'

import {
  deserializePage as deserializeEDHPage,
  fetchPages as fetchEDHPages,
  fetchPage as fetchEDHPage,
  createPage as createEDHPage,
  updatePage as updateEDHPage
} from './everydayhero'

import {
  deserializePage as deserializeJGPage,
  fetchPages as fetchJGPages,
  fetchPage as fetchJGPage,
  createPage as createJGPage,
  updatePage as updateJGPage
} from './justgiving'

/**
* @function deserializer for fundraising pages
*/
export const deserializePage = (page) => (
  isJustGiving()
    ? deserializeJGPage(page)
    : deserializeEDHPage(page)
)

/**
* @function fetches multiple pages
*/
export const fetchPages = (params) => (
  isJustGiving()
    ? fetchJGPages(params)
    : fetchEDHPages(params)
)

/**
* @function fetches a single page
*/
export const fetchPage = (page) => (
  isJustGiving()
    ? fetchJGPage(page)
    : fetchEDHPage(page)
)

/**
 * @function create page
 */
export const createPage = (params) => (
  isJustGiving()
    ? createJGPage(params)
    : createEDHPage(params)
)

/**
 * @function update page
 */
export const updatePage = (pageId, params) => (
  isJustGiving()
    ? updateJGPage(pageId, params)
    : updateEDHPage(pageId, params)
)
