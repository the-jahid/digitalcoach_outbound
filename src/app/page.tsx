'use client'

import { parseCSV } from '@/lib/csvParser'
import { useState, useCallback } from 'react'
import DataDisplay from './components/DataDisplay'


export default function Home() {
  const [data, setData] = useState<Array<{ [key: string]: string }>>([])

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const parsedData = parseCSV(text)
        setData(parsedData)
      }
      reader.readAsText(file)
    }
  }, [])

  return (
    <main className="flex  flex-col items-center justify-between p-24">
      
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="mb-8"
      />
      {data.length > 0 && <DataDisplay data={data} />}
    </main>
  )
}

