import { createClient } from 'next-sanity'

import { apiVersion, dataset, developerToken, projectId } from '../env'

export const client = createClient({
  token: developerToken,
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
})

// 動態內容（用戶資料）
export const dynamicClient = createClient({
  token: developerToken,
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})