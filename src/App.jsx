import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Wizard from './pages/Wizard'
import ActionPlan from './pages/ActionPlan'
import PreCheck from './pages/PreCheck'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wizard" element={<Wizard />} />
            <Route path="/action-plan" element={<ActionPlan />} />
            <Route path="/pre-check" element={<PreCheck />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
