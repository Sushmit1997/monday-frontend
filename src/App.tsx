import { useState } from 'react'
import { ItemsList } from './components/ItemsList'
import { ItemDetail } from './components/ItemDetail'

type View = 'list' | 'detail'

export default function App() {
  const [currentView, setCurrentView] = useState<View>('list')
  const [selectedItemId, setSelectedItemId] = useState<string>('')
  const [selectedItemName, setSelectedItemName] = useState<string>('')
  const handleItemSelect = (itemId: string, itemName: string) => {
    setSelectedItemId(itemId)
    setSelectedItemName(itemName)
    setCurrentView('detail')
  }

  const handleBackToList = () => {
    setCurrentView('list')
    setSelectedItemId('')
    setSelectedItemName('')
  }

  if (currentView === 'detail') {
    return <ItemDetail itemId={selectedItemId} itemName={selectedItemName} onBack={handleBackToList} />
  }

  return <ItemsList onItemSelect={handleItemSelect} />
}