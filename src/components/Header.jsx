import React from 'react'
import NavBar from './NavBar';


const Header = () => {
    return (
        <header id="header" className="fixed-top">
            <div className="container d-flex align-items-center justify-content-between">
                <h1 className="logo"><a href="/">Exacheer</a></h1>
                {/* <a href="/" className="logo"><img src="logo512.png" alt="" className="img-fluid" /></a> */}


                <NavBar />

            </div>
        </header>
    )
}

export default Header
