import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Wizard from './pages/Wizard'
import ActionPlan from './pages/ActionPlan'
import PreCheck from './pages/PreCheck'
import Roadmap from './pages/Roadmap'
import Success from './pages/Success'
import Pricing from './pages/Pricing'
import Restore from './pages/Restore'
import Dashboard from './pages/Dashboard'
import Vault from './pages/Vault'
import Contractors from './pages/Contractors'
import Directory from './pages/Directory'
import Learn from './pages/Learn'
import ContractorMode from './pages/ContractorMode'
import ScrollToTop from './components/ScrollToTop'
import SampleRoadmap from './pages/SampleRoadmap'
import Guide from './pages/Guide'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wizard" element={<Wizard />} />
            <Route path="/action-plan" element={<ActionPlan />} />
            <Route path="/pre-check" element={<PreCheck />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/success" element={<Success />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/restore" element={<Restore />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vault/:projectId" element={<Vault />} />
            <Route path="/contractors" element={<Contractors />} />
            <Route path="/directory" element={<Directory />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/contractor" element={<ContractorMode />} />
            <Route path="/sample" element={<SampleRoadmap />} />
            <Route path="/learn/:slug" element={<Guide />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
