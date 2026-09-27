import Sidebar from './components/Sidebar/Sidebar'
import MainContent from './components/MainContent/MainContent'
import Playbar from './components/Playbar/Playbar'
import './App.css'

function App() {
  return (
    <div className="app">
      <Sidebar />
      <MainContent />
      <Playbar />
    </div>
  )
}

export default App
