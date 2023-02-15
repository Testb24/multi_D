import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/header/Navbar';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Dashboard from './components/dashboard/Dashboard';
import Profil from './components/profil/Profil';
import Reset from './components/auth/Reset';
import AddAttaque from './pages/attaques/AddAttaque';
import AttaqueList from './pages/attaques/AttaqueList';
import ListPlayers from './pages/admin/listPlayers/ListPlayers';
// import ProtectedRoute from './components/auth/ProtectedRoute';
import ProtectedRoute2 from './components/auth/ProtectedRoute2';
import AnalyseAttaqueMain from './pages/hc/analyseAttaques/AnalyseAttaqueMain';
import ValideMur from './pages/hc/valideMur/ValideMur';
// import PageAll from './pages/def/PageAll';
import PageAllMur from './pages/def/pageMur/PageAllMur';
import PageAllSynchro from './pages/def/pageSynchro/PageAllSynchro';
import PageAllSpy from './pages/def/pageSpy/PageAllSpy';

import GestionVivi from './pages/hc/gestionVivi/GestionVivi';
import AnalyseTrajets from './pages/hc/analyseTrajets/AnalyseTrajets';
import AnalyseVoff from './pages/hc/analyseVoff/AnalyseVoff';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Dashboard />} />

        <Route exact path='/signin' element={<SignIn />} />
        <Route exact path='/signup' element={<SignUp />} />

        <Route exact path='/reset' element={<Reset />} />
        <Route exact path='/profil' element={<Profil />} />


        <Route exact path='/attaques/add' element={<AddAttaque />} />
        <Route exact path='/attaques/list' element={<AttaqueList />} />


        <Route exact path='/admin/players' element={
          <ProtectedRoute2 role="admin">
            <ListPlayers />
          </ProtectedRoute2>
        } />
        <Route exact path='/hc/def' element={
          <ProtectedRoute2 role="hc">
            <AnalyseAttaqueMain />
          </ProtectedRoute2>
        } />
        <Route exact path='/hc/wall' element={
          <ProtectedRoute2 role="hc">
            <ValideMur />
          </ProtectedRoute2>
        } />
        <Route exact path='/hc/vivis' element={
          <ProtectedRoute2 role="hc">
            <GestionVivi />
          </ProtectedRoute2>
        } />
        <Route exact path='/hc/trajets' element={
          <ProtectedRoute2 role="hc">
            <AnalyseTrajets />
          </ProtectedRoute2>
        } />
        <Route exact path='/hc/voff' element={
          <ProtectedRoute2 role="hc">
            <AnalyseVoff />
          </ProtectedRoute2>
        } />

        <Route exact path='/defence/mur/*' element={<PageAllMur />} />
        <Route exact path='/defence/synchro' element={<PageAllSynchro />} />
        <Route exact path='/defence/spy' element={<PageAllSpy />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;