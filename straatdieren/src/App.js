import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Meldingen from './pages/Meldingen';
import MeldingMaken from './pages/MeldingMaken';
import MeldingDetail from './pages/MeldingDetail';
import Profiel from './pages/Profiel';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;