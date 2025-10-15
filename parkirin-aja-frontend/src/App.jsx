import Navbar from './components/Navbar'
import Home from './sections/Home'
import './App.css'
import RecommendedGarages from './sections/RecommendedGarages'
import HowItWorks from './sections/HowItWorks'
import FindGarages from './sections/FindGarages'

function App() {

  return (
    <div className='font-sans'>
      <Navbar/>
      <Home/>
      <RecommendedGarages/>
      <HowItWorks/>
      <FindGarages/>
    </div>
  )
}

export default App
