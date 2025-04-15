import React from 'react';
import './index.css';

import PhoneIcon from '@mui/icons-material/Phone';

import GooglePlayIcon from '../../assets/GooglePlay.png';
import AppleStoreIcon from '../../assets/Applestore.png';
//import ProductHunt from '../../assets/producthunt.png';
import FacebookIcon from '../../assets/facebook.png';
import InstagramIcon from '../../assets/instagram.png'; 
import YoutubeIcon from '../../assets/youtube.png';
import TwitterIcon from '../../assets/twitter.png';


const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer__wrapper">
        <div className="footer__applinks">
          <div className="footer__applinks-container">
            <img src={GooglePlayIcon} alt="Google Play" className="footer__app-icon" />
            <img src={AppleStoreIcon} alt="Apple store" className="footer__app-icon" />
          </div>
        </div>

        <div className="footer__container">
          <div className="footer__column">
            <h3 className="footer__heading">For Individuals</h3>
            <ul className="footer__list">
              <li className="footer__item">Subscriptions</li>
            </ul>
          </div>

          <div className="footer__column">
            <h3 className="footer__heading">For Organizations</h3>
            <ul className="footer__list">
              <li className="footer__item">English for Schools</li>
              <li className="footer__item">English for Companies</li>
            </ul>
          </div>

          <div className="footer__column">
            <h3 className="footer__heading">Company</h3>
            <ul className="footer__list">
              <li className="footer__item">About Us</li>
              <li className="footer__item">Careers</li>
              <li className="footer__item">Creators Program</li>
              <li className="footer__item">Blog</li>
            </ul>
          </div>

          <div className="footer__column">
            <h3 className="footer__heading">Customer Help</h3>
            <ul className="footer__list">
              <li className="footer__item">FAQs</li>
              <li className="footer__item">
                Contact - <PhoneIcon style={{ marginRight: '5px', height: '20px', width: '20px', paddingTop: '5px' }} /> 99 - 9999999
              </li>
              <li className="footer__item">Activate Voucher Code</li>
              <li className="footer__item">Redeem Promo Code</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer__copyright-wrapper">
        <div className="footer__copyright"> 
          <p>© 2025 NEUROLINGVA. All Rights Reserved</p>
        </div>

        <div className="footer__social-media">
          <a href="https://www.facebook.com/neurolingva1" target="_blank" rel="noopener noreferrer">
            <img src={FacebookIcon} alt="Facebook" className="footer__social-media-icon" />
          </a>
          <a href="https://www.instagram.com/neuro_lingva" target="_blank" rel="noopener noreferrer">
            <img src={InstagramIcon} alt="Instagram" className="footer__social-media-icon" />
          </a>
          <a href="https://www.youtube.com/@Neurolingva" target="_blank" rel="noopener noreferrer">
            <img src={YoutubeIcon} alt="Youtube" className="footer__social-media-icon" />
          </a>
          <a href="https://x.com/Neurolingva" target="_blank" rel="noopener noreferrer">
            <img src={TwitterIcon} alt="Twitter" className="footer__social-media-icon" />
          </a>
          
        </div>
      </div>
    </footer>
  );
};


export default Footer;