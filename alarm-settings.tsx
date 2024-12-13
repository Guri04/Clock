import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AlarmSettingsProps {
  onSetAlarm: (time: Date) => void
  onClose: () => void
  isDark: boolean
  currentAlarm: Date | null
}

const AlarmSettings: React.FC<AlarmSettingsProps> = ({ onSetAlarm, onClose, isDark, currentAlarm }) => {
  const [alarmTime, setAlarmTime] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const [hours, minutes] = alarmTime.split(':').map(Number)
    const now = new Date()
    const alarmDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)
    if (alarmDate <= now) {
      alarmDate.setDate(alarmDate.getDate() + 1)
    }
    onSetAlarm(alarmDate)
  }

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isDark ? 'text-white' : 'text-gray-800'}`}>
      <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>
        <h2 className="text-2xl font-bold mb-4">Set Alarm</h2>
        {currentAlarm && (
          <p className="mb-4">Current alarm: {currentAlarm.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="time"
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
            required
            className={`w-full ${isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit">Set Alarm</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AlarmSettings

