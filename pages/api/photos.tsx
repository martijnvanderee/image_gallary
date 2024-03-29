import { v2 } from "cloudinary"

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const getPhotos = async (tag: string) => {
  const { resources } = await v2.api.resources_by_tag(tag)

  return resources
}

