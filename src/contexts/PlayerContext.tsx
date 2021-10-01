import { createContext, useState, ReactNode, Dispatch } from 'react'

interface Episode {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

interface PlayerContextData {
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  playNext: () => void;
  hasNext: boolean;
  isPlaying: boolean;
  isLooping: boolean;
  togglePlay: () => void;
  toggleLoop: () => void;
  isShuffling: boolean;
  hasPrevious: boolean;
  playPrevious: () => void;
  episodesList: Episode[];
  setIsShuffling: Dispatch<boolean>;
  setPlayingState: (state: boolean) => void;
  clearPlayerState: () => void;
  currentEpisodeIndex: number;
}

export const PlayerContext = createContext({} as PlayerContextData)

interface PlayerContextProviderProps {
  children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodesList, setEpisodesList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  function play(episode: Episode) {
    setEpisodesList([episode])
    setCurrentEpisodeIndex(0)
  }

  function clearPlayerState() {
    setEpisodesList([])
    setCurrentEpisodeIndex(0)
  }

  function playList(list: Episode[], index: number) {
    setEpisodesList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  const hasPrevious = currentEpisodeIndex > 0
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodesList.length

  function playNext() {
    if(isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodesList.length)
      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    } else if(hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  function playPrevious() {
    if(hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  function togglePlay() {
    setIsPlaying(!isPlaying)
  }

  function toggleLoop() {
    setIsLooping(!isLooping)
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling)
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }

  return (
    <PlayerContext.Provider value={{
      play,
      hasNext,
      playList,
      playNext,
      isLooping,
      isPlaying,
      togglePlay,
      toggleLoop,
      isShuffling,
      hasPrevious,
      playPrevious,
      episodesList,
      setIsShuffling,
      setPlayingState,
      clearPlayerState,
      currentEpisodeIndex
    }}>
      {children}
    </PlayerContext.Provider>
  )
}
