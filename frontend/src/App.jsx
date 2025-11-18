import { Routes, Route } from 'react-router-dom'
import Inicio from './pages/Inicio'
import CrearPrediccion from './pages/prediccion/CrearPrediccion'
import HistorialPredicciones from './pages/prediccion/HistorialPredicciones'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/crear-prediccion" element={<CrearPrediccion />} />
        <Route path="/historial" element={<HistorialPredicciones />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
