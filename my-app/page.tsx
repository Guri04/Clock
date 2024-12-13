'use client'

import { useState, useEffect, useRef } from 'react'
import { Moon, AlarmClock, Bed, Bell, BellOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AlarmSettings from './alarm-settings'
import AlarmNotification from './alarm-notification'

export default function Clock() {
  const [isDark, setIsDark] = useState(false)
  const [time, setTime] = useState(new Date())
  const [showAlarmSettings, setShowAlarmSettings] = useState(false)
  const [alarmTime, setAlarmTime] = useState<Date | null>(null)
  const [isAlarmActive, setIsAlarmActive] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Initialize AudioContext
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch (error) {
      console.error('Failed to create AudioContext:', error)
      setAudioError('Your browser does not support Web Audio API. Using visual alarm only.')
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    if (alarmTime) {
      const alarmInterval = setInterval(() => {
        if (new Date().toTimeString().slice(0, 5) === alarmTime.toTimeString().slice(0, 5)) {
          setIsAlarmActive(true)
          playAlarmSound()
        }
      }, 1000)

      return () => clearInterval(alarmInterval)
    }
  }, [alarmTime])

  const playAlarmSound = () => {
    if (audioContextRef.current && !audioError) {
      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(440, audioContextRef.current.currentTime) // 440 Hz - A4 note

      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime)
      gainNode.gain.linearRampToValueAtTime(1, audioContextRef.current.currentTime + 0.01)

      oscillator.start()
      oscillator.stop(audioContextRef.current.currentTime + 1) // Stop after 1 second

      // Repeat the beep every 1.2 seconds
      const beepInterval = setInterval(() => {
        if (isAlarmActive) {
          oscillator.start()
          oscillator.stop(audioContextRef.current!.currentTime + 1)
        } else {
          clearInterval(beepInterval)
        }
      }, 1200)
    }
  }

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  const toggleAlarmSettings = () => {
    setShowAlarmSettings(!showAlarmSettings)
  }

  const setAlarm = (time: Date) => {
    setAlarmTime(time)
    setShowAlarmSettings(false)
  }

  const stopAlarm = () => {
    setIsAlarmActive(false)
    setAlarmTime(null)
    if (audioContextRef.current) {
      audioContextRef.current.close().then(() => {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }).catch(error => {
        console.error('Error resetting AudioContext:', error)
        setAudioError('Failed to reset audio. Using visual alarm only.')
      })
    }
  }

  return (
    <main className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-200 to-blue-300'
    }`}>
      <div className="container mx-auto flex flex-col items-center justify-center min-h-screen">
        {/* Clock Face */}
        <div className={`w-80 h-80 rounded-full ${
          isDark ? 'bg-gray-800' : 'bg-white'
        } shadow-xl relative mb-16 transition-colors duration-300`}>
          {/* Clock Numbers and Dial Lines */}
   {[12, 3, 6, 9].map((number) => {
  const angle = (number - 12) * 30; // Calculate the angle for each number
  const style = {
    top: `${50 - 40 * Math.cos(angle * (Math.PI / 180))}%`,
    left: `${50 + 40 * Math.sin(angle * (Math.PI / 180))}%`,
    transform: 'translate(-50%, -50%)',
  };
  
  return (
    <span
      key={number}
      className={`absolute text-2xl font-light ${
        isDark ? 'text-white' : 'text-gray-800'
      }`}
      style={style}
    >
      {number}
    </span>
  );
})}

{[1, 2, 4, 5, 7, 8, 10, 11].map((number) => {
  const angle = (number - 12) * 30; // Calculate the angle for each line
  const lineLength = 10; // Length of the small lines
  const lineWidth = 2; // Width of the small lines
  const style = {
    height: `${lineLength}px`,
    width: `${lineWidth}px`,
    backgroundColor: isDark ? 'white' : 'gray',
    position: 'absolute',
    top: `${50 - 40 * Math.cos(angle * (Math.PI / 180))}%`,
    left: `${50 + 40 * Math.sin(angle * (Math.PI / 180))}%`,
    transform: `rotate(${angle}deg) translate(-50%, -50%)`,
    transformOrigin: 'center center',
  };
  
  return (
    <div
      key={number}
      className="line"
      style={style}
    />
  );
})}




          
          {/* Clock Hands */}
          <div className="absolute inset-0">
            {/* Hour Hand */}
            <div
              className={`absolute w-1 h-16 ${isDark ? 'bg-white' : 'bg-gray-800'} rounded-full left-1/2 bottom-1/2 origin-bottom transform -translate-x-1/2`}
              style={{
                transform: `rotate(${((time.getHours() % 12) * 30) + (time.getMinutes() * 0.5)}deg)`
              }}
            />
            {/* Minute Hand */}
            <div
              className={`absolute w-1 h-24 ${isDark ? 'bg-white' : 'bg-gray-800'} rounded-full left-1/2 bottom-1/2 origin-bottom transform -translate-x-1/2`}
              style={{
                transform: `rotate(${time.getMinutes() * 6}deg)`
              }}
            />
            {/* Second Hand */}
            <div
              className="absolute w-0.5 h-28 bg-red-500 rounded-full left-1/2 bottom-1/2 origin-bottom transform -translate-x-1/2"
              style={{
                transform: `rotate(${time.getSeconds() * 6}deg)`
              }}
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-8">
          <Button
            variant="ghost"
            // size="icon"
            className={`rounded-full p-3 ${
              isDark ? 'text-white hover:text-white' : 'text-gray-800 hover:text-gray-800'
            }`}
            onClick={toggleDarkMode}
          >
            <Moon className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full p-3 ${
              isDark ? 'text-white hover:text-white' : 'text-gray-800 hover:text-gray-800'
            }`}
            onClick={toggleAlarmSettings}
          >
            <AlarmClock className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full p-3 ${
              isDark ? 'text-white hover:text-white' : 'text-gray-800 hover:text-gray-800'
            }`}
          >
            <Bed className="h-6 w-6" />
          </Button>
        </div>

        {/* Alarm Settings */}
        {showAlarmSettings && (
          <AlarmSettings onSetAlarm={setAlarm} onClose={() => setShowAlarmSettings(false)} isDark={isDark} />
        )}

        {/* Alarm Notification */}
        {isAlarmActive && (
          <AlarmNotification onStop={stopAlarm} isDark={isDark} audioError={audioError} />
        )}
      </div>
    </main>
  )
}

