import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import SistemaExperto from './pages/SistemaExperto'
import Maquinarias from './pages/Maquinarias'
import Mercado from './pages/Mercado'
import Layout from './components/Layout'
import './App.css'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sistema-experto" element={<SistemaExperto />} />
        <Route path="/maquinarias" element={<Maquinarias />} />
        <Route path="/mercado" element={<Mercado />} />
        <Route path="/subproductos" element={<SistemaExperto />} />
        <Route path="/historial" element={<SistemaExperto />} /> {/* Placeholder */}
      </Routes>
    </Layout>
  )
}

export default App
