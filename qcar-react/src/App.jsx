import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Team from './pages/Team';
import Research from './pages/Research';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard'; // 1. Import your new Bento page
import './styles/global.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="team" element={<Team />} />
          <Route path="research" element={<Research />} />
          <Route path="contact" element={<Contact />} />
          {/* 2. Add this route to keep your Navbar/Footer */}
          <Route path="dashboard" element={<Dashboard />} /> 
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
