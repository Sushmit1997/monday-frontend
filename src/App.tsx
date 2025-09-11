import { useState } from 'react'
import { ItemsList } from './components/ItemsList'
import { ItemDetail } from './components/ItemDetail'
import { MondayItem } from './types/items'

type View = 'list' | 'detail'

export default function App() {
  const [currentView, setCurrentView] = useState<View>('list')
  const [selectedItem, setSelectedItem] = useState<MondayItem | null>(null)
  const handleItemSelect = (item: MondayItem) => {
    setSelectedItem(item)
    setCurrentView('detail')
  }

  const handleBackToList = () => {
    setCurrentView('list')
    setSelectedItem(null)
  }

  if (currentView === 'detail') {
    return <ItemDetail item={selectedItem!} onBack={handleBackToList} />
  }

  return <ItemsList onItemSelect={handleItemSelect} />
}