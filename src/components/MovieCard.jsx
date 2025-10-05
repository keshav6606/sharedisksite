"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { LazyLoadImage } from "react-lazy-load-image-component"
import "react-lazy-load-image-component/src/effects/black-and-white.css"
import { PiStarFill } from "react-icons/pi"

import { BsPlayFill } from "react-icons/bs"
import posterPlaceholder from "../assets/images/poster-placeholder.png"

const MovieCard = ({ movie }) => {
  const [showPlayBtn, setShowPlayBtn] = useState(false)
  const [openId, setOpenId] = useState()

  const showPlay = () => {
    setOpenId(movie.tmdb_id)
    setShowPlayBtn(true)
  }

  const hidePlay = () => {
    setOpenId(movie.tmdb_id)
    setShowPlayBtn(false)
  }

  return (
    <div className="relative group">
      <Link
        to={movie.media_type === "movie" ? `/mov/${movie.tmdb_id}` : `/ser/${movie.tmdb_id}`}
        className="rounded-t-2xl"
      >
        <div className="relative flex items-center justify-center aspect-[9/13.5] w-full object-cover rounded-md overflow-hidden">
          <LazyLoadImage
            src={movie.poster ? movie.poster : posterPlaceholder}
            width="100%"
            effect="black-and-white"
            alt={movie.title}
            className="aspect-[9/13.5] w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onMouseEnter={showPlay}
            onMouseLeave={hidePlay}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      <div className="text-primaryTextColor mt-3">
        <p className="line-clamp-1 text-md md:text-base font-semibold">{movie.title}</p>
        <div className="flex items-center justify-between text-secondaryTextColor mt-1.5 uppercase text-[0.6rem] sm:text-xs md:text-sm">
          {movie.release_year && <p className="font-medium">{movie.release_year}</p>}
          <div className="uppercase bg-bgColorSecondary text-otherColor py-1 px-3 rounded-sm text-[0.5rem] sm:text-[0.6rem] font-bold">
            <p>{movie.media_type}</p>
          </div>
        </div>
      </div>

      {movie.rating ? (
        <div className="flex items-center gap-1.5 absolute top-2 left-2 bg-black/80 backdrop-blur-sm text-yellow-400 py-1.5 px-3 rounded-sm font-bold text-[0.6rem] sm:text-xs">
          <PiStarFill />
          <p>{movie.rating.toFixed(1)}</p>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 absolute top-2 left-2 bg-black/80 backdrop-blur-sm text-yellow-400 py-1.5 px-3 rounded-sm text-xs font-bold">
          <PiStarFill />
          <p>0.0</p>
        </div>
      )}

      {movie.languages ? (
        <div className="flex items-center gap-1 absolute top-2 right-2 bg-primaryBtn text-white py-1.5 px-3 rounded-sm font-bold text-[0.6rem] sm:text-xs">
          <p>{movie.languages.map((lang) => lang.charAt(0).toUpperCase() + lang.slice(1)).join("-")} </p>
        </div>
      ) : (
        <div className="flex items-center gap-1 absolute top-2 right-2 bg-primaryBtn text-white py-1.5 px-3 rounded-sm text-xs font-bold">
          <p>Hi</p>
        </div>
      )}

      {movie.rip ? (
        <div className="flex bg-black/80 backdrop-blur-sm rounded-sm items-center gap-1 absolute bottom-16 left-2 text-primaryTextColor py-1.5 px-3 font-semibold text-[0.6rem] sm:text-xs">
          <p>{movie.rip}</p>
        </div>
      ) : (
        <div className="flex bg-black/80 backdrop-blur-sm rounded-sm items-center gap-1 absolute bottom-16 left-2 text-primaryTextColor py-1.5 px-3 font-semibold text-[0.6rem] sm:text-xs">
          <p>Blu-Ray</p>
        </div>
      )}

      <AnimatePresence>
        {openId === movie.tmdb_id && showPlayBtn && (
          <Link
            to={movie.media_type === "movie" ? `/mov/${movie.tmdb_id}` : `/ser/${movie.tmdb_id}`}
            onMouseEnter={showPlay}
            onMouseLeave={hidePlay}
            className="hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primaryBtn sm:block z-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{
                type: "spring",
                duration: 0.4,
                bounce: 0.3,
              }}
              className="text-4xl p-3 rounded-full bg-primaryBtn text-white border-4 border-white shadow-2xl"
            >
              <BsPlayFill />
            </motion.div>
          </Link>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MovieCard
