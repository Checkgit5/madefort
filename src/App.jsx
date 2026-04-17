import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Gift, Heart, Sparkles, Volume2, VolumeX } from 'lucide-react'
import { siteContent, THEMES } from './siteContent'

const FALLING_OPTIONS = [
  { value: 'hearts', label: 'Hearts', Icon: Heart },
  { value: 'stars', label: 'Stars', Icon: Sparkles },
]

const AUDIO_LOOP =
  'data:audio/mp3;base64,SUQzAwAAAAAAFlRFTkMAAAAPAAADTGF2ZjU4LjMyLjEwNAAAAAAAAAAAAAAA//uQxAADBzQAKQAAAANIAAAAAExBTUUzLjk4LjIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQxAADhAAAQgAAABhAAAACAAADSAAAAAEAAACkgICAQFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFB//uQxAADhAAAQgAAABhAAAACAAADSAAAAAEAAACkgICAQFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFB'

function createParticles(effect) {
  return Array.from({ length: 22 }, (_, index) => ({
    id: `${effect}-${index}`,
    left: `${(index * 17 + 7) % 100}%`,
    size: 14 + ((index * 9) % 20),
    duration: 7 + (index % 6),
    delay: (index % 8) * 0.6,
    drift: ((index % 5) - 2) * 24,
  }))
}

function FallingLayer({ accent, effect }) {
  const { Icon } = FALLING_OPTIONS.find((item) => item.value === effect) ?? FALLING_OPTIONS[0]
  const particles = createParticles(effect)

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute -top-10 flex items-center justify-center"
          initial={{ y: '-10%', x: 0, opacity: 0 }}
          animate={{
            y: '110vh',
            x: [0, particle.drift, -particle.drift / 2, particle.drift / 3],
            opacity: [0, 0.8, 0.55, 0],
            rotate: [0, 8, -6, 10],
          }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
            delay: particle.delay,
          }}
          style={{ left: particle.left, color: accent }}
        >
          <span className="drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]">
            <Icon size={particle.size} fill={effect === 'hearts' ? 'currentColor' : 'none'} strokeWidth={1.7} />
          </span>
        </motion.div>
      ))}
      <div className="absolute right-10 top-10 hidden rounded-full border border-white/20 bg-white/10 p-3 text-white/65 backdrop-blur md:flex">
        <Icon size={18} />
      </div>
    </div>
  )
}

function GiftIntro({ accent, onReveal }) {
  return (
    <motion.button
      type="button"
      onClick={onReveal}
      className="group relative flex h-40 w-40 items-center justify-center rounded-[2rem] border border-white/15 bg-white/5 text-white shadow-glow backdrop-blur-xl transition-transform hover:scale-[1.03]"
      initial={{ scale: 0.94, opacity: 0 }}
      animate={{ scale: [1, 1.04, 1], opacity: 1 }}
      transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY }}
      whileTap={{ scale: 0.96 }}
    >
      <div
        className="absolute inset-0 rounded-[2rem] opacity-70 blur-2xl"
        style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }}
      />
      <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
        <div className="absolute inset-y-0 w-1/2 -skew-x-12 bg-white/20 blur-md animate-shimmer" />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-3">
        <Gift size={52} />
        <span className="font-body text-sm uppercase tracking-[0.45em] text-white/80">for you</span>
      </div>
    </motion.button>
  )
}

function StoryCard({ accent, theme, currentIndex, onNext }) {
  const currentEntry = siteContent.story[currentIndex]

  return (
    <div className="relative w-full max-w-3xl">
      <div
        className="absolute inset-0 rounded-[2.5rem] blur-3xl"
        style={{ background: `radial-gradient(circle, ${accentSoft} 0%, transparent 72%)` }}
      />
      <motion.div
        layout
        className="relative overflow-hidden rounded-[2.5rem] p-8 text-left shadow-2xl backdrop-blur-2xl md:p-12"
        style={{
          background: theme.panel,
          border: `1px solid ${theme.panelBorder}`,
          boxShadow: `0 35px 80px ${theme.accentSoft}`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.42), rgba(255,255,255,0.08) 42%, transparent 76%)',
          }}
        />
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.35em] text-black/45">
              {siteContent.eyebrow}
            </p>
            <h1 className="font-display text-4xl leading-none md:text-6xl" style={{ color: theme.text }}>
              {siteContent.title}
            </h1>
          </div>
          <div
            className="hidden h-14 w-14 items-center justify-center rounded-full border border-white/45 bg-white/30 text-white shadow-lg md:flex"
            style={{ color: accent }}
          >
            <Heart fill="currentColor" size={24} />
          </div>
        </div>

        <div className="min-h-44">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="font-display text-3xl leading-tight md:text-[2.95rem]"
              style={{ color: theme.text }}
            >
              {currentEntry.text}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/10 pt-6">
          <div className="flex items-center gap-4">
            <span className="font-body text-xs uppercase tracking-[0.35em] text-black/45">
              To {siteContent.recipient}
            </span>
            <div className="flex gap-2">
              {siteContent.story.map((entry, index) => (
              <span
                key={entry.label}
                className="h-2.5 rounded-full transition-all"
                style={{
                  width: currentIndex === index ? '2.5rem' : '0.7rem',
                  background: currentIndex === index ? accent : 'rgba(0, 0, 0, 0.14)',
                }}
              />
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={onNext}
            className="rounded-full px-5 py-3 font-body text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-lg transition hover:-translate-y-0.5"
            style={{ backgroundColor: theme.accentStrong }}
          >
            Keep Going
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function AudioToggle({ isReady, muted, onToggle }) {
  const Icon = muted ? VolumeX : Volume2

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={!isReady}
      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Icon size={16} />
      {muted ? 'Play' : 'Mute'}
    </button>
  )
}

export default function App() {
  const [revealed, setRevealed] = useState(false)
  const [messageIndex, setMessageIndex] = useState(0)
  const [muted, setMuted] = useState(false)
  const [audioReady, setAudioReady] = useState(false)
  const audioRef = useRef(null)

  const activeTheme = THEMES[siteContent.theme] ?? THEMES.rose

  useEffect(() => {
    if (!revealed) {
      return undefined
    }

    const interval = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % siteContent.story.length)
    }, 6200)

    return () => window.clearInterval(interval)
  }, [revealed])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) {
      return
    }

    audio.muted = muted
  }, [muted])

  const handleReveal = async () => {
    setRevealed(true)
    setAudioReady(true)

    confetti({
      particleCount: 140,
      spread: 100,
      origin: { y: 0.55 },
      colors: [activeTheme.accent, '#ffffff', '#ffd7e3'],
    })

    const audio = audioRef.current
    if (audio) {
      audio.muted = false
      setMuted(false)

      try {
        await audio.play()
      } catch {
        setMuted(true)
      }
    }
  }

  const handleToggleMute = async () => {
    const audio = audioRef.current
    if (!audio) {
      return
    }

    if (muted) {
      audio.muted = false
      setMuted(false)

      try {
        await audio.play()
      } catch {
        setMuted(true)
      }

      return
    }

    audio.muted = true
    setMuted(true)
  }

  const handleNext = () => {
    setMessageIndex((current) => (current + 1) % siteContent.story.length)
  }

  return (
    <main
      className="relative isolate min-h-screen overflow-hidden"
      style={{
        background: revealed
          ? `radial-gradient(circle at top, ${activeTheme.accentSoft} 0%, transparent 32%), linear-gradient(180deg, ${activeTheme.revealTo} 0%, #fff9fb 45%, #fff4f6 100%)`
          : `radial-gradient(circle at top, ${activeTheme.accentSoft} 0%, transparent 22%), linear-gradient(180deg, ${activeTheme.revealFrom} 0%, #09040d 100%)`,
      }}
    >
      <audio
        ref={audioRef}
        src={siteContent.musicEnabled ? AUDIO_LOOP : undefined}
        loop
        preload="auto"
        className="hidden"
      />
      <FallingLayer accent={activeTheme.accent} effect={siteContent.effect} />

      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundColor: revealed ? 'rgba(255,255,255,0)' : 'rgba(3,2,7,0.15)',
        }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(circle at 18% 22%, rgba(255,255,255,0.4), transparent 18%), radial-gradient(circle at 82% 14%, rgba(255,255,255,0.28), transparent 14%), radial-gradient(circle at 50% 100%, rgba(255,255,255,0.3), transparent 24%)',
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <div className="absolute left-4 top-4 flex items-center gap-3 md:left-8 md:top-8">
          <AudioToggle isReady={audioReady} muted={muted} onToggle={handleToggleMute} />
        </div>

        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.section
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
              transition={{ duration: 0.8 }}
              className="flex max-w-2xl flex-col items-center justify-center text-center"
            >
              <GiftIntro accent={activeTheme.accent} onReveal={handleReveal} />
              <p className="mt-8 font-body text-xs uppercase tracking-[0.4em] text-white/55">
                {siteContent.recipient}
              </p>
              <p className="mt-4 max-w-lg font-display text-2xl leading-tight text-white/90 md:text-4xl">
                {siteContent.introLabel}
              </p>
              <p className="mt-6 max-w-md font-body text-sm uppercase tracking-[0.38em] text-white/55">
                tap the gift and let the room change
              </p>
            </motion.section>
          ) : (
            <motion.section
              key="story"
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(16px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="flex w-full max-w-5xl flex-col items-center gap-8"
            >
              <StoryCard
                accent={activeTheme.accent}
                accentSoft={activeTheme.accentSoft}
                theme={activeTheme}
                currentIndex={messageIndex}
                onNext={handleNext}
              />
              <p className="max-w-xl text-center font-body text-sm uppercase tracking-[0.28em] text-black/45">
                {siteContent.closingLine}
              </p>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
