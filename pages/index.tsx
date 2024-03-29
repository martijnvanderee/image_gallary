import React, { useState } from "react";
import Image from "next/image"
//components
import { PhotoGrid } from "../components/photogrid"
import {
  AspectRatio, Box, chakra, useControllableState
} from '@chakra-ui/react'
//typescript
import { IHome, IHomeView } from "../util/typescript"
import type { ResourceApiResponse } from "cloudinary";
import { getPhotos } from "./api/photos"
import { transformBlurred, transform } from "../util/functions"
//constants
const constants = {
  maxWidth: 768,
  cloud_folder: "image_gallary",
}

const ChakraImage = chakra(Image, {
  shouldForwardProp: (prop) => ["width", "height", "src", "alt", "layout", "priority"].includes(prop)
})

const Home = ({ resources }: IHome) => {
  const firstPhoto = resources[0].url

  const [value, setValue] = useState(firstPhoto)

  const [mainPhoto, setMainPhoto] = useControllableState({
    value,
    onChange: setValue,
  })

  const handleClick = (imageLink: ResourceApiResponse["resources"][0]) =>
    setMainPhoto(imageLink.url)

  return (
    <HomeView
      mainPhoto={mainPhoto}
      resources={resources}
      handleClick={handleClick}
    />
  )
}


const HomeView = ({ mainPhoto, resources, handleClick }: IHomeView) =>
  <Box
    maxW={{ base: "100%", md: `${constants.maxWidth}` }}
    mx="auto"
    mt={{ base: '0', md: '5' }}
    p='2'
    rounded={{ base: "none", md: "large" }}
    boxShadow='2xl'>
    <AspectRatio
      ratio={4 / 3}
      w={{ base: "100%", md: "inherit" }}
      h={{ base: "inherit", md: "100%" }}
      objectFit='cover'
      backgroundImage={transformBlurred(mainPhoto)}
      backgroundSize="cover"
    >
      <ChakraImage
        layout="fill"
        src={transform(mainPhoto, 800)}
        placeholder="blur"
        alt='Main image'
        priority
        objectFit="cover"
      />
    </AspectRatio>
    <PhotoGrid photos={resources} handleClick={handleClick} />
  </Box >


export async function getStaticProps() {
  const resources = await getPhotos(constants.cloud_folder);
  return {
    props: {
      resources
    }
  }
}

export default Home
