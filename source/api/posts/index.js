import { isJustGiving } from '../../utils/client'

import {
  deserializePost as deserializeEDHPost,
  fetchPosts as fetchEDHPosts,
  createPost as createEDHPost
} from './everydayhero'

import {
  deserializePost as deserializeJGPost,
  fetchPosts as fetchJGPosts,
  createPost as createJGPost
} from './justgiving'

export const deserializePost = post =>
  isJustGiving() ? deserializeJGPost(post) : deserializeEDHPost(post)

export const fetchPosts = params =>
  isJustGiving() ? fetchJGPosts(params) : fetchEDHPosts(params)

export const createPost = params =>
  isJustGiving() ? createJGPost(params) : createEDHPost(params)
