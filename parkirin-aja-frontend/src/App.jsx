import Navbar from './components/Navbar'
import Home from './components/Home'
import './App.css'
import RecommendedGarages from './components/RecommendedGarages'
import HowItWorks from './components/HowItWorks'

function App() {

  return (
    <div className='font-sans'>
      <Navbar/>
      <Home/>
      <RecommendedGarages/>
      <HowItWorks/>
    </div>
  )
}

export default App
