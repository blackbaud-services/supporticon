import { isJustGiving } from '../../utils/client'

import { createPost as createEDHPost } from './everydayhero'

import { createPost as createJGPost } from './justgiving'

export const createPost = params =>
  isJustGiving() ? createJGPost(params) : createEDHPost(params)
