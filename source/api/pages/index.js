import { isJustGiving } from '../../utils/client'

import {
  deserializePage as deserializeEDHPage,
  fetchPages as fetchEDHPages,
  searchPages as searchEDHPages,
  fetchPage as fetchEDHPage,
  createPage as createEDHPage,
  updatePage as updateEDHPage
} from './everydayhero'

import {
  deserializePage as deserializeJGPage,
  fetchPages as fetchJGPages,
  searchPages as searchJGPages,
  fetchPage as fetchJGPage,
  createPage as createJGPage,
  updatePage as updateJGPage
} from './justgiving'

export const deserializePage = (page) => (
  isJustGiving()
    ? deserializeJGPage(page)
    : deserializeEDHPage(page)
)

export const fetchPages = (params) => (
  isJustGiving()
    ? fetchJGPages(params)
    : fetchEDHPages(params)
)

export const searchPages = (params) => (
  isJustGiving()
    ? searchJGPages(params)
    : searchEDHPages(params)
)

export const fetchPage = (page) => (
  isJustGiving()
    ? fetchJGPage(page)
    : fetchEDHPage(page)
)

export const createPage = (params) => (
  isJustGiving()
    ? createJGPage(params)
    : createEDHPage(params)
)

export const updatePage = (pageId, params) => (
  isJustGiving()
    ? updateJGPage(pageId, params)
    : updateEDHPage(pageId, params)
)
