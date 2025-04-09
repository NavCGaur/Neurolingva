import React, {useState, useEffect} from 'react'
import {ReactComponent as MenuIcon} from '../../assets/images/menu.svg'
import {ReactComponent as CloseIcon} from '../../assets/images/xmark.svg'
import { Link } from 'react-router-dom';

import './Navbar.css'

function Navbar() {
  
  const [menuStatus, setMenuStatus] = useState(false);
    

  const handleMenu = () => {
    if (window.innerWidth < 900) setMenuStatus(!menuStatus);
  };

 

  const handleResize = () => {
    if (window.innerWidth > 900) setMenuStatus(false);
  };

  
  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


 

  return (
<div className='navbar__fixedSection' style={{ backgroundColor: '#21295c'}}>

    <div className='navbar__separatingLine'></div>

    <div className='navbar__opaqueEffect'></div>

    <div className='navbar__container'>
        
        <h1 className='navbar__logo'> BRANDFLEX</h1>

        <div className='navbar__menu' onClick={handleMenu}>
             {menuStatus? <CloseIcon className= 'navbar__close-icon'/> : <MenuIcon className='navbar__menu-icon'  / >
             }
        </div>

        <nav className={menuStatus?'navbar__navbar-hidden':'navbar__navbar'} >

            <Link to='/'className='navbar__home' onClick={handleMenu} style={{textDecoration:'none'}} >Home</ Link>


            <Link to='/service/login'className='navbar__loginButton' style={{textDecoration:'none'}}>Login</Link>


        </nav>

    </div>

</div>   

  );
}

export default Navbar;
