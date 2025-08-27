import { createClient } from 'next-sanity'

import { apiVersion, dataset, developerToken, projectId } from '../env'

export const client = createClient({
  token: developerToken,
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
})
