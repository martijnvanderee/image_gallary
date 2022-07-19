import React from "react";
import Image from "next/image"
//components
import {
  AspectRatio, Box, chakra, Flex, useControllableState
} from '@chakra-ui/react'
//typescript
import { Iphoto, Iphotos, IHome } from "../util/typescript"
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

  const [value, setValue] = React.useState(firstPhoto)

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

interface IHomeView {
  mainPhoto: string
  resources: ResourceApiResponse["resources"]
  handleClick: (imageLink: ResourceApiResponse["resources"][0]) => void
}

const HomeView = ({ mainPhoto, resources, handleClick }: IHomeView) => <Box
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
      alt='Dan Abramov'
      priority
      objectFit="cover"
    />
  </AspectRatio>
  <PhotoGrid photos={resources} handleClick={handleClick} />
</Box >

const PhotoGrid = ({ photos, handleClick }: Iphotos) => {
  return (
    <Box w="100%" mx="auto" >
      <Flex flexWrap={"nowrap"} overflowX="scroll"
        css={{
          '&::-webkit-scrollbar': {
            width: '20px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
            backgroundColor: "#e4e4e4"
          },
          '&::-webkit-scrollbar-thumb': {
            background: "#8070d4",
            borderRadius: "100px",
            border: '5px solid transparent',
            backgroundClip: 'content-box',
          },
        }}>
        {photos.map((photo, index) =>
          <SinglePhoto
            imageLink={photo}
            handleClick={handleClick}
            key={index} />)}
      </Flex>
    </Box>
  )
}

const SinglePhoto = ({ imageLink, handleClick }: Iphoto) => {
  return (
    <Box
      onClick={() => handleClick(imageLink)}>
      <AspectRatio
        ratio={3 / 3} w="150px" objectFit='cover' backgroundImage={transformBlurred(imageLink.url)}
        backgroundSize="cover" >
        <ChakraImage
          layout="fill"
          src={transform(imageLink.url, 300)}
          alt={imageLink.public_id}
          placeholder="blur"
          quality="1"
          cursor="pointer"
        />
      </AspectRatio>
    </Box>
  )
}

export async function getStaticProps() {
  const resources = await getPhotos(constants.cloud_folder);
  return {
    props: {
      resources
    }
  }
}

export default Home
