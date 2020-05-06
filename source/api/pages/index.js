import { isJustGiving } from '../../utils/client'

import {
  deserializePage as deserializeEDHPage,
  fetchPages as fetchEDHPages,
  fetchPage as fetchEDHPage,
  fetchUserPages as fetchEDHUserPages,
  fetchPageDonationCount as fetchEDHPageDonationCount,
  createPage as createEDHPage,
  updatePage as updateEDHPage
} from './everydayhero'

import {
  deserializePage as deserializeJGPage,
  fetchPages as fetchJGPages,
  fetchPage as fetchJGPage,
  fetchUserPages as fetchJGUserPages,
  fetchPageDonationCount as fetchJGPageDonationCount,
  createPage as createJGPage,
  updatePage as updateJGPage
} from './justgiving'

/**
 * @function deserializer for fundraising pages
 */
export const deserializePage = page =>
  isJustGiving() ? deserializeJGPage(page) : deserializeEDHPage(page)

/**
 * @function fetches multiple pages
 */
export const fetchPages = params =>
  isJustGiving() ? fetchJGPages(params) : fetchEDHPages(params)

/**
 * @function fetches a single page
 */
export const fetchPage = (...args) =>
  isJustGiving() ? fetchJGPage(...args) : fetchEDHPage(...args)

export const fetchUserPages = (...args) =>
  isJustGiving() ? fetchJGUserPages(...args) : fetchEDHUserPages(...args)

/**
 * @function fetches a page's donation count
 */
export const fetchPageDonationCount = page =>
  isJustGiving()
    ? fetchJGPageDonationCount(page)
    : fetchEDHPageDonationCount(page)

/**
 * @function create page
 */
export const createPage = params =>
  isJustGiving() ? createJGPage(params) : createEDHPage(params)

/**
 * @function update page
 */
export const updatePage = (pageId, params) =>
  isJustGiving() ? updateJGPage(pageId, params) : updateEDHPage(pageId, params)
