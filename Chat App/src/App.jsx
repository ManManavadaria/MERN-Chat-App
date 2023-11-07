import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Chat from './pages/chat';
import Login from './pages/Login';
import Register from './pages/Register';
import SetAvatar from './component/SetAvatar';

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Chat/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/setAvatar" element={<SetAvatar/>}/>
      </Routes>
      
      </BrowserRouter>
    </>
  )
}

export default App
