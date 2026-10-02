import Sidebar from './components/Sidebar/Sidebar'
import MainContent from './components/MainContent/MainContent'
import Playbar from './components/Playbar/Playbar'
import { PlayerProvider } from './context/PlayerContext'
import './App.css'

function App() {
  return (
    <PlayerProvider>
      <div className="app">
        <Sidebar />
        <MainContent />
        <Playbar />
      </div>
    </PlayerProvider>
  )
}

export default App
