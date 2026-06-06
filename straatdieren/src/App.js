import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Meldingen from './pages/Meldingen';
import MeldingMaken from './pages/MeldingMaken';
import MeldingDetail from './pages/MeldingDetail';
import Profiel from './pages/Profiel';
import Instellingen from './pages/Instellingen';
import MijnHulpacties from './pages/MijnHulpacties';
import Admin from './pages/Admin';
import Succesverhalen from './pages/Succesverhalen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/meldingen" element={<Meldingen />} />
        <Route path="/melding-maken" element={<MeldingMaken />} />
        <Route path="/melding/:id" element={<MeldingDetail />} />
        <Route path="/profiel" element={<Profiel />} />
        <Route path="/instellingen" element={<Instellingen />} />
        <Route path="/mijn-hulpacties" element={<MijnHulpacties />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/succesverhalen" element={<Succesverhalen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;