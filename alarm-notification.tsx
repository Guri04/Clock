import React from 'react'
import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-react'

interface AlarmNotificationProps {
  onStop: () => void
  isDark: boolean
  audioError: string | null
}

const AlarmNotification: React.FC<AlarmNotificationProps> = ({ onStop, isDark, audioError }) => {
  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
      isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
    }`}>
      <div className="flex flex-col items-start space-y-2">
        <div className="flex items-center space-x-4">
          <Bell className="h-6 w-6 text-red-500 animate-bounce" />
          <span className="text-lg font-semibold">Alarm!</span>
        </div>
        {audioError && (
          <span className="text-sm text-yellow-500">{audioError}</span>
        )}
        <Button onClick={onStop} variant="destructive" className="mt-2">
          Stop Alarm
        </Button>
      </div>
    </div>
  )
}

export default AlarmNotification

