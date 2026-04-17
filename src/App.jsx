import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Gift, Heart, Settings2, Sparkles, Volume2, VolumeX } from 'lucide-react'

const POEMS = [
  'You turned ordinary days into keepsakes, the kind a heart reaches for long after midnight.',
  'Every quiet glance from you feels like a lantern being lit somewhere inside me.',
  'If tenderness had a home, it would sound like your name spoken slowly in a safe room.',
  'I made this little world so you could see what I have been trying to say without rushing it.',
  'Whatever tomorrow becomes, tonight belongs to wonder, softness, and the way you make life glow.',
]

const THEMES = {
  rose: {
    label: 'Rose Glow',
    accent: '#ff7aa2',
    accentSoft: 'rgba(255, 122, 162, 0.28)',
    revealFrom: '#120917',
    revealTo: '#ffe6ee',
    text: '#46213b',
  },
  champagne: {
    label: 'Champagne',
    accent: '#dca85f',
    accentSoft: 'rgba(220, 168, 95, 0.28)',
    revealFrom: '#110d0a',
    revealTo: '#fff2de',
    text: '#5c3d11',
  },
  blush: {
    label: 'Blush Sky',
    accent: '#ff8f8f',
    accentSoft: 'rgba(255, 143, 143, 0.24)',
    revealFrom: '#150a10',
    revealTo: '#ffeef3',
    text: '#5b2b3a',
  },
}

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
        <span className="font-body text-sm uppercase tracking-[0.45em] text-white/80">open me</span>
      </div>
    </motion.button>
  )
}

function StoryCard({ recipient, accent, accentSoft, textColor, currentIndex, onNext }) {
  return (
    <div className="relative w-full max-w-2xl">
      <div
        className="absolute inset-0 rounded-[2rem] blur-3xl"
        style={{ background: `radial-gradient(circle, ${accentSoft} 0%, transparent 72%)` }}
      />
      <motion.div
        layout
        className="relative overflow-hidden rounded-[2rem] border border-white/35 bg-white/24 p-8 text-left shadow-2xl backdrop-blur-2xl md:p-12"
      >
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.35em] text-black/45">for {recipient}</p>
            <h1 className="font-display text-4xl leading-none md:text-6xl" style={{ color: textColor }}>
              A softer little universe
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
              className="font-display text-3xl leading-tight md:text-[2.7rem]"
              style={{ color: textColor }}
            >
              {POEMS[currentIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="flex gap-2">
            {POEMS.map((_, index) => (
              <span
                key={index}
                className="h-2.5 rounded-full transition-all"
                style={{
                  width: currentIndex === index ? '2.5rem' : '0.7rem',
                  background: currentIndex === index ? accent : 'rgba(0, 0, 0, 0.14)',
                }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={onNext}
            className="rounded-full px-5 py-3 font-body text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-lg transition hover:-translate-y-0.5"
            style={{ backgroundColor: accent }}
          >
            Next
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function SettingsPanel({
  isOpen,
  recipient,
  setRecipient,
  theme,
  setTheme,
  effect,
  setEffect,
}) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.aside
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          className="absolute right-4 top-20 z-40 w-[min(22rem,calc(100vw-2rem))] rounded-[1.75rem] border border-white/20 bg-black/30 p-5 text-white shadow-2xl backdrop-blur-2xl"
        >
          <h2 className="font-body text-xs uppercase tracking-[0.35em] text-white/60">Customize</h2>
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm text-white/75">Recipient</span>
              <input
                value={recipient}
                onChange={(event) => setRecipient(event.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/35"
                placeholder="Anita"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-white/75">Theme</span>
              <select
                value={theme}
                onChange={(event) => setTheme(event.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none"
              >
                {Object.entries(THEMES).map(([value, item]) => (
                  <option key={value} value={value} className="bg-slate-900">
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-white/75">Falling Effect</span>
              <select
                value={effect}
                onChange={(event) => setEffect(event.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none"
              >
                {FALLING_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value} className="bg-slate-900">
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
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
  const [recipient, setRecipient] = useState('Anita')
  const [theme, setTheme] = useState('rose')
  const [effect, setEffect] = useState('hearts')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [muted, setMuted] = useState(false)
  const [audioReady, setAudioReady] = useState(false)
  const audioRef = useRef(null)

  const activeTheme = THEMES[theme] ?? THEMES.rose

  useEffect(() => {
    if (!revealed) {
      return undefined
    }

    const interval = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % POEMS.length)
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
    setMessageIndex((current) => (current + 1) % POEMS.length)
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
      <audio ref={audioRef} src={AUDIO_LOOP} loop preload="auto" className="hidden" />
      <FallingLayer accent={activeTheme.accent} effect={effect} />

      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundColor: revealed ? 'rgba(255,255,255,0)' : 'rgba(3,2,7,0.15)',
        }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <div className="absolute left-4 top-4 flex items-center gap-3">
          <AudioToggle isReady={audioReady} muted={muted} onToggle={handleToggleMute} />
        </div>

        <div className="absolute right-4 top-4">
          <button
            type="button"
            onClick={() => setSettingsOpen((current) => !current)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur"
          >
            <Settings2 size={18} />
          </button>
        </div>

        <SettingsPanel
          isOpen={settingsOpen}
          recipient={recipient}
          setRecipient={setRecipient}
          theme={theme}
          setTheme={setTheme}
          effect={effect}
          setEffect={setEffect}
        />

        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.section
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center text-center"
            >
              <GiftIntro accent={activeTheme.accent} onReveal={handleReveal} />
              <p className="mt-8 max-w-md font-body text-sm uppercase tracking-[0.38em] text-white/65">
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
                recipient={recipient}
                accent={activeTheme.accent}
                accentSoft={activeTheme.accentSoft}
                textColor={activeTheme.text}
                currentIndex={messageIndex}
                onNext={handleNext}
              />
              <p className="max-w-xl text-center font-body text-sm uppercase tracking-[0.28em] text-black/45">
                built to feel like a secret worth keeping
              </p>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
