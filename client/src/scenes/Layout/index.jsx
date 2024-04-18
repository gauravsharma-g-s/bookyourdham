import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from 'components/NavBar';
import Footer from 'components/Footer/Footer';

function Layout() {
    return (
        <div style={{position:'relative'}}>
            <NavBar />
            <Outlet />
            <Footer />
        </div>
    )
}

export default Layout
