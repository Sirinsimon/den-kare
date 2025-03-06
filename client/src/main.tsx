import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import PatientDataAnalyzer from './pages/patient-data-analyzer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/patient-data-analyzer" element={<PatientDataAnalyzer />} />
      </Routes>
    </Router>
  </StrictMode>,
)
