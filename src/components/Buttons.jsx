"use client"

import axios from "axios"
import { useState, useEffect } from "react"
import { Select, SelectItem } from "@nextui-org/select"
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover"
import { Button } from "@nextui-org/button"
import { FaCloudDownloadAlt, FaPlay } from "react-icons/fa"
import Spinner from "./svg/Spinner"

const DownloadButton = ({ movieData, btnType }) => {
  const BASE = import.meta.env.VITE_BASE_URL
  const API_URL = import.meta.env.VITE_API_URL
  const API_KEY = import.meta.env.VITE_API_KEY

  const [selectedSeason, setSelectedSeason] = useState("")
  const [selectedEpisode, setSelectedEpisode] = useState("")
  const [selectedQuality, setSelectedQuality] = useState("")
  const [episodes, setEpisodes] = useState([])
  const [qualities, setQualities] = useState([])
  const [loading, setLoading] = useState({})

  useEffect(() => {
    if (selectedSeason) {
      const season = movieData.seasons.find((s) => s.season_number === Number.parseInt(selectedSeason))
      if (season) {
        setEpisodes(season.episodes)
        setSelectedEpisode("")
        setQualities([])
      }
    }
  }, [selectedSeason, movieData.seasons])

  useEffect(() => {
    if (selectedEpisode) {
      const episode = episodes.find((e) => e.episode_number === Number.parseInt(selectedEpisode))
      if (episode) {
        setQualities(episode.telegram)
        setSelectedQuality("")
      }
    }
  }, [selectedEpisode, episodes])

  const shortenUrl = async (url) => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          api: API_KEY,
          url: url,
          format: "json",
        },
      })

      const data = response.data
      return data?.shortenedUrl || data?.short || data?.url || url
    } catch (error) {
      console.error("Error shortening URL:", error)
      return url
    }
  }

  const generateUrl = (id, name) => {
    const downloadUrl = `${BASE}/dl/${id}/${encodeURIComponent(name)}`
    if (btnType === "Download") return downloadUrl
    return `intent:${downloadUrl}#Intent;type=video/x-matroska;action=android.intent.action.VIEW;end;`
  }

  const handleButtonClick = async (id, name, quality) => {
    setLoading((prev) => ({ ...prev, [quality]: true }))
    const rawUrl = generateUrl(id, name)
    const shortUrl = await shortenUrl(rawUrl)
    setLoading((prev) => ({ ...prev, [quality]: false }))
    window.open(shortUrl, "_blank", "noopener noreferrer")
  }

  const renderMovieButtons = () =>
    movieData.telegram?.map((q, i) => (
      <Button
        key={i}
        onClick={() => handleButtonClick(q.id, q.name, q.quality)}
        size="sm"
        className="bg-primaryBtn text-white rounded-sm font-semibold hover:bg-primaryBtnHower transition-all duration-200"
        isLoading={loading[q.quality]}
        spinner={<Spinner />}
      >
        {q.quality}
      </Button>
    ))

  const renderShowSelectors = () => (
    <div className="px-1 py-2 flex flex-col gap-2">
      <Select
        isRequired
        variant="bordered"
        aria-label="Select season"
        placeholder="Select season"
        className="w-40 mb-2"
        onChange={(e) => setSelectedSeason(e.target.value)}
        value={selectedSeason}
      >
        {movieData.seasons
          .sort((a, b) => a.season_number - b.season_number)
          .map((s) => (
            <SelectItem key={s.season_number} value={s.season_number}>
              Season {s.season_number}
            </SelectItem>
          ))}
      </Select>
      <Select
        isRequired
        variant="bordered"
        aria-label="Select episode"
        placeholder="Select episode"
        className="w-40 mb-2"
        onChange={(e) => setSelectedEpisode(e.target.value)}
        value={selectedEpisode}
        disabled={!selectedSeason}
      >
        {episodes
          .sort((a, b) => a.episode_number - b.episode_number)
          .map((e) => (
            <SelectItem key={e.episode_number} value={e.episode_number}>
              Episode {e.episode_number}
            </SelectItem>
          ))}
      </Select>
      <Select
        isRequired
        variant="bordered"
        aria-label="Select quality"
        placeholder="Select quality"
        className="w-40 mb-2"
        onChange={(e) => setSelectedQuality(e.target.value)}
        value={selectedQuality}
        disabled={!selectedEpisode}
      >
        {qualities?.map((q) => (
          <SelectItem key={q.quality} value={q.quality}>
            {q.quality}
          </SelectItem>
        ))}
      </Select>
      <Button
        onClick={() => {
          const q = qualities.find((q) => q.quality === selectedQuality)
          if (q) handleButtonClick(q.id, q.name, q.quality)
        }}
        size="sm"
        className="bg-primaryBtn text-white rounded-sm font-semibold hover:bg-primaryBtnHower transition-all duration-200"
        disabled={!selectedQuality}
        isLoading={loading[selectedQuality]}
        spinner={<Spinner />}
      >
        {btnType === "Download" ? "Download" : "Open in Player"}
      </Button>
    </div>
  )

  return (
    <Popover placement="bottom" showArrow={true}>
      <PopoverTrigger>
        <button className="flex justify-center items-center gap-2 uppercase text-white max-w-full grow text-xs rounded-sm border-2 border-white py-2 px-4 lg:text-sm sm:px-6 sm:max-w-[15rem] sm:py-2.5 font-semibold hover:bg-white/10 transition-all duration-200">
          {btnType === "Download" ? (
            <>
              <FaCloudDownloadAlt className="text-lg" /> Download
            </>
          ) : (
            <>
              <FaPlay className="text-lg" /> Player
            </>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-btnColor border border-white/10">
        {movieData.media_type === "movie" ? (
          <div className="px-1 py-2 flex gap-2 flex-wrap">{renderMovieButtons()}</div>
        ) : (
          renderShowSelectors()
        )}
      </PopoverContent>
    </Popover>
  )
}

export default DownloadButton
