import createImageUrlBuilder from '@sanity/image-url'
import { client } from './sanity'

const imageBuilder = createImageUrlBuilder(client)

export const urlFor = (source: any) => {
  return imageBuilder.image(source)
}