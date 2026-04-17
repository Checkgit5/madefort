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

function StartIntro({ accent, onReveal }) {
  return (
    <div className="flex flex-col items-center">
      <motion.button
        type="button"
        onClick={onReveal}
        className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-[#ff92c2]/50 bg-black/55 px-10 py-5 text-white shadow-[0_0_22px_rgba(255,92,143,0.45),0_0_70px_rgba(255,92,143,0.18)] backdrop-blur-xl transition-transform hover:scale-[1.03]"
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: [1, 1.03, 1], opacity: 1 }}
        transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY }}
        whileTap={{ scale: 0.97 }}
      >
        <div
          className="absolute inset-0 opacity-70 blur-xl"
          style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 72%)` }}
        />
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div className="absolute inset-y-0 w-1/2 -skew-x-12 bg-white/10 blur-md animate-shimmer" />
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <Gift size={18} />
          <span className="font-body text-base font-semibold uppercase tracking-[0.35em] text-white/92">start</span>
        </div>
      </motion.button>
      <p className="mt-6 max-w-md text-center font-body text-sm uppercase tracking-[0.34em] text-white/42">
        {siteContent.introLabel}
      </p>
    </div>
  )
}

function OpeningSequence({ accent, phaseValue }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 text-center">
      <AnimatePresence mode="wait">
        {typeof phaseValue === 'number' ? (
          <motion.div
            key={`count-${phaseValue}`}
            initial={{ opacity: 0, scale: 0.6, filter: 'blur(18px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.25, filter: 'blur(14px)' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="font-display text-[5rem] text-[#ff97c6] md:text-[8rem]"
            style={{ textShadow: `0 0 20px ${accent}, 0 0 42px ${accent}` }}
          >
            {phaseValue}
          </motion.div>
        ) : (
          <motion.div
            key="opening-message"
            initial={{ opacity: 0, scale: 0.88, filter: 'blur(18px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -18, filter: 'blur(12px)' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <p
              className="font-display text-5xl leading-[0.95] text-[#ff9ecb] md:text-7xl"
              style={{ textShadow: `0 0 24px ${accent}, 0 0 64px ${accent}` }}
            >
              {siteContent.openingMessage}
            </p>
            <div className="mt-6 text-[#ff8fbe]" style={{ filter: `drop-shadow(0 0 16px ${accent})` }}>
              <Heart fill="currentColor" size={34} className="mx-auto" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FireworkBloom({ accent }) {
  const bursts = [
    { left: '16%', top: '24%', delay: 0.2, color: '#ffd34f' },
    { left: '76%', top: '28%', delay: 0.8, color: '#6ef0ff' },
    { left: '62%', top: '56%', delay: 1.2, color: '#65ff9a' },
  ]

  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block">
      {bursts.map((burst) => (
        <motion.div
          key={`${burst.left}-${burst.top}`}
          className="absolute"
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 0.95, 0], scale: [0.3, 1, 1.15] }}
          transition={{
            duration: 1.8,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeOut',
            delay: burst.delay,
            repeatDelay: 3.8,
          }}
          style={{ left: burst.left, top: burst.top }}
        >
          <div className="relative h-28 w-28">
            {Array.from({ length: 10 }, (_, index) => (
              <span
                key={index}
                className="absolute left-1/2 top-1/2 block h-10 w-[2px] origin-bottom rounded-full"
                style={{
                  transform: `translate(-50%, -100%) rotate(${index * 36}deg)`,
                  background: `linear-gradient(180deg, ${burst.color}, transparent)`,
                  boxShadow: `0 0 12px ${burst.color}, 0 0 26px ${accent}`,
                }}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function FloatingMemoryRoom({ accent, activeStory, messageIndex, onNext }) {
  const [tilt, setTilt] = useState({ rotateX: -6, rotateY: -16, x: 0, y: 0 })

  const handleMove = (event) => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return
    }

    const bounds = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - bounds.left) / bounds.width - 0.5
    const py = (event.clientY - bounds.top) / bounds.height - 0.5

    setTilt({
      rotateX: -6 - py * 12,
      rotateY: -16 + px * 18,
      x: px * 14,
      y: py * 10,
    })
  }

  const resetTilt = () => setTilt({ rotateX: -6, rotateY: -16, x: 0, y: 0 })

  return (
    <section className="relative min-h-screen overflow-hidden pt-16 md:pt-20">
      <div className="pointer-events-none absolute left-1/2 top-[18%] h-52 w-[45rem] -translate-x-1/2 rounded-full bg-[#ff4f92]/10 blur-3xl" />
      <div
        className="absolute inset-0"
        onMouseMove={handleMove}
        onMouseLeave={resetTilt}
      >
        <GlowDust accent={accent} />
        <FireworkBloom accent={accent} />
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
                  animate={{ y: [0, -10, 0] }}
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
                  <div className="h-full w-full overflow-hidden rounded-[1.2rem] border border-white/35 bg-black/50 p-1 shadow-[0_0_28px_rgba(255,92,143,0.65)]">
                    <img src={photo} alt="" className="h-full w-full rounded-[1rem] object-cover" />
                  </div>
                </motion.div>
              )
            }

            return (
              <motion.div
                key={`note-${index}`}
                className="absolute"
                animate={{ y: [0, -8, 0] }}
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
                <div className="rounded-full border border-[#ff8bb9]/45 bg-black/76 px-5 py-3 shadow-[0_0_18px_rgba(255,92,143,0.55),0_0_42px_rgba(255,92,143,0.22)] backdrop-blur-xl">
                  <p className="truncate font-display text-lg text-[#f4a6c3]/90 md:text-xl">
                    <span className="mr-2 text-[#ff70ac]">{'\u2665'}</span>
                    {note}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      <div className="pointer-events-none absolute left-5 top-6 md:left-8 md:top-8">
        <p className="font-body text-[10px] uppercase tracking-[0.45em] text-white/26">{siteContent.eyebrow}</p>
        <h1 className="mt-3 font-display text-3xl text-white/90 md:text-5xl">{siteContent.title}</h1>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-[57%] z-20 w-[min(92vw,32rem)] -translate-x-1/2 md:hidden">
        <div className="rounded-[1.6rem] border border-white/10 bg-black/55 p-5 text-center shadow-[0_30px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
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
              className="mt-4 font-display text-[1.65rem] leading-tight text-white/92"
            >
              {activeStory.text}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 z-30 w-[min(94vw,68rem)] -translate-x-1/2 md:bottom-6">
        <div className="rounded-[1.7rem] border border-white/10 bg-black/48 px-4 py-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:px-6">
          <div className="hidden items-start justify-between gap-6 md:flex">
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -14, filter: 'blur(8px)' }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="max-w-3xl font-display text-[1.9rem] leading-tight text-white/92"
              >
                {activeStory.text}
              </motion.p>
            </AnimatePresence>
            <button
              type="button"
              onClick={onNext}
              className="shrink-0 rounded-full border border-[#ff8bb9]/45 bg-black/80 px-5 py-3 font-body text-xs font-semibold uppercase tracking-[0.28em] text-[#f7b4cb] shadow-[0_0_18px_rgba(255,92,143,0.3)] transition hover:-translate-y-0.5"
            >
              Keep Going
            </button>
          </div>

          <div className="mt-0 flex items-center justify-between gap-4 md:mt-5">
            <div className="flex items-center gap-4">
              <p className="hidden font-body text-[11px] uppercase tracking-[0.36em] text-white/30 md:block">
                {siteContent.recipient}
              </p>
              <div className="flex flex-wrap items-center gap-2">
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
            </div>
            <div className="flex items-center gap-3">
              <p className="hidden font-body text-[11px] uppercase tracking-[0.42em] text-white/24 md:block">
                {siteContent.closingLine}
              </p>
              <button
                type="button"
                onClick={onNext}
                className="rounded-full border border-white/15 bg-black/62 px-5 py-3 font-body text-xs font-semibold uppercase tracking-[0.3em] text-white/80 md:hidden"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
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

export default function App() {
  const [phase, setPhase] = useState('idle')
  const [countdownValue, setCountdownValue] = useState(3)
  const [messageIndex, setMessageIndex] = useState(0)
  const [muted, setMuted] = useState(false)
  const [audioReady, setAudioReady] = useState(false)
  const audioRef = useRef(null)

  const activeTheme = THEMES[siteContent.theme] ?? THEMES.rose
  const activeStory = siteContent.story[messageIndex]

  useEffect(() => {
    if (phase !== 'room') {
      return undefined
    }

    const interval = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % siteContent.story.length)
    }, 6200)

    return () => window.clearInterval(interval)
  }, [phase])

  useEffect(() => {
    if (phase !== 'countdown') {
      return undefined
    }

    const steps = [3, 2, 1]
    let index = 0
    setCountdownValue(steps[0])

    const timer = window.setInterval(() => {
      index += 1
      if (index >= steps.length) {
        window.clearInterval(timer)
        setPhase('message')
        return
      }

      setCountdownValue(steps[index])
    }, 650)

    return () => window.clearInterval(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'message') {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setPhase('room')
    }, 1900)

    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) {
      return
    }

    audio.muted = muted
  }, [muted])

  const handleReveal = async () => {
    setPhase('countdown')
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
        background:
          phase === 'idle'
            ? `radial-gradient(circle at top, ${activeTheme.accentSoft} 0%, transparent 22%), linear-gradient(180deg, ${activeTheme.revealFrom} 0%, #09040d 100%)`
            : 'radial-gradient(circle at 50% 62%, rgba(255, 79, 146, 0.1) 0%, transparent 22%), radial-gradient(circle at top, rgba(255, 82, 151, 0.08) 0%, transparent 18%), linear-gradient(180deg, #050307 0%, #000000 100%)',
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
          backgroundColor: phase === 'idle' ? 'rgba(3,2,7,0.15)' : 'rgba(0,0,0,0)',
        }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />

      {phase !== 'idle' ? (
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
          {phase === 'idle' ? (
            <motion.section
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
              transition={{ duration: 0.8 }}
              className="flex min-h-screen flex-col items-center justify-center px-4 text-center"
            >
              <StartIntro accent={activeTheme.accent} onReveal={handleReveal} />
            </motion.section>
          ) : null}

          {phase === 'countdown' ? (
            <motion.div
              key="countdown"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <OpeningSequence accent={activeTheme.accent} phaseValue={countdownValue} />
            </motion.div>
          ) : null}

          {phase === 'message' ? (
            <motion.div
              key="message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <OpeningSequence accent={activeTheme.accent} phaseValue="message" />
            </motion.div>
          ) : null}

          {phase === 'room' ? (
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
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  )
}
