//React imports
import React, {useState, useEffect} from 'react'

import { Link } from "react-router-dom";

//Style imports
import './index.css'

import {ReactComponent as MenuIcon} from '../../assets/menu.svg'
import {ReactComponent as CloseIcon} from '../../assets/xmark.svg'
//import Logo from '../../assets/neurolingvalogo.png'


//Component imports
//import DropDown from '../../components/dropdown'

function Header() {    

  const [menuStatus, setMenuStatus] = useState(false);

  const [scrollPosition, setScrollPosition] = useState(0);

  let scrollColor = 'rgba(0, 0, 0, 0)'; 



  function handleMenu(){
    if (window.innerWidth < 900) {
    setMenuStatus(!menuStatus);
    }

  }

  // Add an event listener to handle window resize
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 900) {
        setMenuStatus(false);
      }
    }

    function handleScroll(){
        const position = window.scrollY;
        setScrollPosition(position);    
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);


    // Clean up the event listener
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);

    };
  }, []);

  if (scrollPosition > 500) {
    scrollColor = 'rgb(9, 51, 111)';
  } 

  

  /*const FeaturesData = [{featureName:'', 
                        link: '/gstregistration'},

                       {featureName:'MSME Registration', 
                        link: '/gstregistration'},
                      
                      {featureName:'Business Entity Registration', 
                        link: '/gstregistration'},

                      {featureName:'Business Entity Registration', 
                          link: '/gstregistration'},
                    
                      

                        ];
    */
    

  return (
    <header className='header' id='home'>
   
            
       <div className='header__container'>
                
                <div className='navbar__menu' onClick={handleMenu}>
                     {menuStatus? <CloseIcon className= 'navbar__close-icon'/> : <MenuIcon className='navbar__menu-icon'  / >
                     }
                </div>

                <nav className={menuStatus?'header__navbar-hidden':'header__navbar'} >
                   {/*<img src={Logo} alt='logo' className='header__logo'/>*/} 

                    <a href='#home'className='header__home' onClick={handleMenu}>Home</a >

                    {/*<DropDown pageId = {'#service'} title = {'Features'} dropDownData={FeaturesData} onClick={handleMenu} / >*/}
                    <a href='#features' className='header__about' onClick={handleMenu}>Features</a>

                    <Link to='/pricing' className='header__about' onClick={handleMenu}>Pricing</Link>

                    <a href='#contact' className='header__contact' onClick={handleMenu}>Contact Us</a>

                    <div className="nav__button-container">
                            <div className="nav__button-group">
                              <div className="nav__overlap-group">
                                <Link to="/login" className="nav__register-button">
                                    login
                              </Link>
                            </div>
                          </div>
                    </div>

                </nav>

            </div>

                  
    </header>
  )
}

export default Header

