import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './scenes/Layout';
import HomePage from './scenes/HomePage'
import MenuPage from './scenes/MenuPage'
import CartPage from 'scenes/CartPage';
import ProfilePage from 'scenes/ProfilePage';
import About from 'scenes/AboutPage';

function App() {

  return (
    <div className='app'>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path='/about' element={<About/>}/>
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
