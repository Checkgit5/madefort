import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Gift, Heart, Volume2, VolumeX } from 'lucide-react'
import { siteContent, THEMES } from './siteContent'

const AUDIO_LOOP =
  'data:audio/mp3;base64,SUQzAwAAAAAAFlRFTkMAAAAPAAADTGF2ZjU4LjMyLjEwNAAAAAAAAAAAAAAA//uQxAADBzQAKQAAAANIAAAAAExBTUUzLjk4LjIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQxAADhAAAQgAAABhAAAACAAADSAAAAAEAAACkgICAQFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFB//uQxAADhAAAQgAAABhAAAACAAADSAAAAAEAAACkgICAQFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFB'

const MEMORY_LAYOUT = [
  { type: 'photo', x: '14%', y: '18%', z: -90, rotate: -9, size: 120 },
  { type: 'note', x: '34%', y: '12%', z: -130, rotate: -7, width: 360 },
  { type: 'note', x: '65%', y: '18%', z: -160, rotate: 8, width: 310 },
  { type: 'note', x: '19%', y: '42%', z: -100, rotate: 4, width: 300 },
  { type: 'photo', x: '77%', y: '30%', z: -140, rotate: 6, size: 96 },
  { type: 'note', x: '52%', y: '40%', z: -40, rotate: -3, width: 390 },
  { type: 'note', x: '70%', y: '67%', z: -80, rotate: 2, width: 340 },
  { type: 'photo', x: '20%', y: '72%', z: 40, rotate: 7, size: 140 },
  { type: 'note', x: '41%', y: '78%', z: 30, rotate: -1, width: 250 },
  { type: 'note', x: '87%', y: '81%', z: 15, rotate: -4, width: 270 },
]

function GlowDust({ accent }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 24 }, (_, index) => (
        <motion.div
          key={index}
          className="absolute h-1 w-1 rounded-full"
          initial={{ opacity: 0.15, scale: 0.6 }}
          animate={{ opacity: [0.08, 0.45, 0.12], scale: [0.6, 1.15, 0.8] }}
          transition={{
            duration: 2.8 + (index % 5),
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
            delay: index * 0.18,
          }}
          style={{
            left: `${(index * 13 + 11) % 100}%`,
            top: `${(index * 17 + 7) % 100}%`,
            background: accent,
            boxShadow: `0 0 12px ${accent}`,
          }}
        />
      ))}
    </div>
  )
}

function GiftIntro({ accent, onReveal }) {
  return (
    <motion.button
      type="button"
      onClick={onReveal}
      className="group relative flex h-40 w-40 items-center justify-center rounded-[2rem] border border-white/15 bg-white/5 text-white shadow-[0_0_55px_rgba(255,92,143,0.18)] backdrop-blur-xl transition-transform hover:scale-[1.03]"
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

function AudioToggle({ isReady, muted, onToggle }) {
  const Icon = muted ? VolumeX : Volume2

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={!isReady}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 py-3 text-sm font-medium text-white/90 backdrop-blur-xl disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Icon size={16} />
      {muted ? 'Play' : 'Mute'}
    </button>
  )
}

function FloatingMemoryRoom({ accent, activeStory, messageIndex, onNext }) {
  const [tilt, setTilt] = useState({ rotateX: -5, rotateY: -14, x: 0, y: 0 })

  const handleMove = (event) => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return
    }

    const bounds = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - bounds.left) / bounds.width - 0.5
    const py = (event.clientY - bounds.top) / bounds.height - 0.5

    setTilt({
      rotateX: -5 - py * 10,
      rotateY: -14 + px * 16,
      x: px * 10,
      y: py * 8,
    })
  }

  const resetTilt = () => setTilt({ rotateX: -5, rotateY: -14, x: 0, y: 0 })

  return (
    <section className="relative w-full px-4 pb-8 pt-20 md:px-8 md:pb-16 md:pt-24">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-7 flex items-start justify-between gap-4 md:mb-10">
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.42em] text-white/35">
              {siteContent.eyebrow}
            </p>
            <h1 className="mt-3 font-display text-4xl text-white/92 md:text-6xl">{siteContent.title}</h1>
          </div>
          <div className="hidden text-right md:block">
            <p className="font-body text-[11px] uppercase tracking-[0.35em] text-white/30">to {siteContent.recipient}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_320px] md:gap-8">
          <div
            className="relative min-h-[58vh] overflow-hidden rounded-[2rem] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(255,94,162,0.08),transparent_28%),linear-gradient(180deg,#060307_0%,#020203_100%)] shadow-[0_40px_120px_rgba(0,0,0,0.65)] md:min-h-[76vh]"
            onMouseMove={handleMove}
            onMouseLeave={resetTilt}
          >
            <GlowDust accent={accent} />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.25)_100%)]" />
            <motion.div
              className="absolute inset-0"
              animate={{
                rotateX: tilt.rotateX,
                rotateY: tilt.rotateY,
                x: tilt.x,
                y: tilt.y,
              }}
              transition={{ type: 'spring', stiffness: 90, damping: 18 }}
              style={{ transformStyle: 'preserve-3d', perspective: '1400px' }}
            >
              {MEMORY_LAYOUT.map((item, index) => {
                const note = siteContent.floatingNotes[index % siteContent.floatingNotes.length]
                const photo = siteContent.memoryPhotos[index % siteContent.memoryPhotos.length]

                if (item.type === 'photo') {
                  return (
                    <motion.div
                      key={`photo-${index}`}
                      className="absolute"
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        duration: 4 + (index % 3),
                        repeat: Number.POSITIVE_INFINITY,
                        ease: 'easeInOut',
                        delay: index * 0.25,
                      }}
                      style={{
                        left: item.x,
                        top: item.y,
                        width: item.size,
                        height: item.size * 1.12,
                        transform: `translateZ(${item.z}px) rotate(${item.rotate}deg)`,
                      }}
                    >
                      <div
                        className="h-full w-full overflow-hidden rounded-[1.2rem] border border-white/35 bg-black/50 p-1 shadow-[0_0_28px_rgba(255,92,143,0.65)]"
                      >
                        <img src={photo} alt="" className="h-full w-full rounded-[1rem] object-cover" />
                      </div>
                    </motion.div>
                  )
                }

                return (
                  <motion.div
                    key={`note-${index}`}
                    className="absolute"
                    animate={{ y: [0, -7, 0] }}
                    transition={{
                      duration: 5 + (index % 4),
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'easeInOut',
                      delay: index * 0.18,
                    }}
                    style={{
                      left: item.x,
                      top: item.y,
                      width: item.width,
                      maxWidth: '78vw',
                      transform: `translateZ(${item.z}px) rotate(${item.rotate}deg)`,
                    }}
                  >
                    <div className="rounded-full border border-[#ff8bb9]/45 bg-black/70 px-5 py-3 shadow-[0_0_18px_rgba(255,92,143,0.55),0_0_42px_rgba(255,92,143,0.22)] backdrop-blur-xl">
                      <p className="truncate font-display text-lg text-[#f4a6c3]/90 md:text-xl">
                        <span className="mr-2 text-[#ff70ac]">♥</span>
                        {note}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>

          <div className="relative">
            <div className="sticky top-5 rounded-[1.8rem] border border-white/10 bg-black/45 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-6">
              <p className="font-body text-[11px] uppercase tracking-[0.42em] text-white/35">
                {activeStory.label} / {siteContent.story.length.toString().padStart(2, '0')}
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={messageIndex}
                  initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -14, filter: 'blur(8px)' }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="mt-5 font-display text-[1.9rem] leading-tight text-white/92 md:text-[2.2rem]"
                >
                  {activeStory.text}
                </motion.p>
              </AnimatePresence>

              <div className="mt-8 flex flex-wrap items-center gap-2">
                {siteContent.story.map((entry, index) => (
                  <span
                    key={entry.label}
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: index === messageIndex ? '2.4rem' : '0.55rem',
                      background: index === messageIndex ? accent : 'rgba(255,255,255,0.18)',
                      boxShadow: index === messageIndex ? `0 0 14px ${accent}` : 'none',
                    }}
                  />
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between gap-4">
                <p className="font-body text-[11px] uppercase tracking-[0.36em] text-white/30">
                  {siteContent.recipient}
                </p>
                <button
                  type="button"
                  onClick={onNext}
                  className="rounded-full border border-[#ff8bb9]/45 bg-black/80 px-5 py-3 font-body text-xs font-semibold uppercase tracking-[0.28em] text-[#f7b4cb] shadow-[0_0_18px_rgba(255,92,143,0.3)] transition hover:-translate-y-0.5"
                >
                  Keep Going
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center font-body text-[11px] uppercase tracking-[0.42em] text-white/24 md:mt-8">
          {siteContent.closingLine}
        </p>
      </div>
    </section>
  )
}

export default function App() {
  const [revealed, setRevealed] = useState(false)
  const [messageIndex, setMessageIndex] = useState(0)
  const [muted, setMuted] = useState(false)
  const [audioReady, setAudioReady] = useState(false)
  const audioRef = useRef(null)

  const activeTheme = THEMES[siteContent.theme] ?? THEMES.rose
  const activeStory = siteContent.story[messageIndex]

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
      particleCount: 120,
      spread: 82,
      origin: { y: 0.6 },
      colors: [activeTheme.accent, '#ffbdd7', '#ffffff'],
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
          ? 'radial-gradient(circle at 50% 62%, rgba(255, 79, 146, 0.1) 0%, transparent 22%), radial-gradient(circle at top, rgba(255, 82, 151, 0.08) 0%, transparent 18%), linear-gradient(180deg, #050307 0%, #000000 100%)'
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

      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundColor: revealed ? 'rgba(0,0,0,0)' : 'rgba(3,2,7,0.15)',
        }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />

      {revealed ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-100"
          style={{
            background:
              'radial-gradient(circle at 20% 18%, rgba(255,92,143,0.12), transparent 16%), radial-gradient(circle at 80% 72%, rgba(255,92,143,0.12), transparent 18%), linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.02) 49%, transparent 50%)',
          }}
        />
      ) : null}

      <div className="relative z-10 min-h-screen">
        <div className="absolute left-4 top-4 z-30 flex items-center gap-3 md:left-8 md:top-8">
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
              className="flex min-h-screen flex-col items-center justify-center px-4 text-center"
            >
              <GiftIntro accent={activeTheme.accent} onReveal={handleReveal} />
              <p className="mt-8 font-body text-xs uppercase tracking-[0.4em] text-white/55">
                {siteContent.recipient}
              </p>
              <p className="mt-4 max-w-lg font-display text-2xl leading-tight text-white/90 md:text-4xl">
                {siteContent.introLabel}
              </p>
              <p className="mt-6 max-w-md font-body text-sm uppercase tracking-[0.38em] text-white/55">
                tap the gift and step inside
              </p>
            </motion.section>
          ) : (
            <motion.div
              key="memory-room"
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(16px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <FloatingMemoryRoom
                accent={activeTheme.accent}
                activeStory={activeStory}
                messageIndex={messageIndex}
                onNext={handleNext}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
