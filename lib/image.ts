import { createImageUrlBuilder } from '@sanity/image-url' // <--- The Fix: Named Import
import { client } from './sanity' // Assuming this is where your client is exported

const imageBuilder = createImageUrlBuilder(client)

export const urlFor = (source: any) => {
  return imageBuilder.image(source)
}