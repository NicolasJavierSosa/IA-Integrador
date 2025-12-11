import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import SistemaExperto from './pages/SistemaExperto'
import Subproductos from './pages/Subproductos'
import Maquinarias from './pages/Maquinarias'
import Mercado from './pages/Mercado'
import Historial from './pages/Historial'
import Layout from './components/Layout'
import './App.css'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sistema-experto" element={<SistemaExperto />} />
        <Route path="/subproductos" element={<Subproductos />} />
        <Route path="/maquinarias" element={<Maquinarias />} />
        <Route path="/mercado" element={<Mercado />} />
        <Route path="/historial" element={<Historial />} />
      </Routes>
    </Layout>
  )
}

export default App
