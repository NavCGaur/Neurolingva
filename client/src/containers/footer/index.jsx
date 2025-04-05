import React from 'react';
import './index.css';

import GooglePlayIcon from '../../assets/GooglePlay.png';
import AppleStoreIcon from '../../assets/Applestore.png';
import ProductHunt from '../../assets/producthunt.png';
import FacebookIcon from '../../assets/facebook.png';
import InstagramIcon from '../../assets/instagram.png'; 
import YoutubeIcon from '../../assets/youtube.png';
import TwitterIcon from '../../assets/twitter.png';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__wrapper">
        <div footer__applinks>
          <div className='footer__applinks-container'>
              <img src={GooglePlayIcon} alt="Google Play" className="footer__app-icon" />
            <img src={AppleStoreIcon} alt="Apple store" className="footer__app-icon" />

          </div>

          <img src={ProductHunt} alt="Social Media" className="footer__social-media-icon" />
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
              <li className="footer__item">Contact Us</li>
              <li className="footer__item">Activate Voucher Code</li>
              <li className="footer__item">Redeem Promo Code</li>
            </ul>
          </div>
        </div>

       

      </div>

      <div className="footer__copyright-wrapper">

        <div className='footer__copyright'> 
          <p >© 2025 NEUROLINGVA. All Rights Reserved</p>
        </div>

        <div className='footer__social-media'>
          <img src={FacebookIcon} alt="Social Media" className="footer__social-media-icon" />
          <img src={InstagramIcon} alt="Social Media" className="footer__social-media-icon" />
          <img src={YoutubeIcon} alt="Social Media" className="footer__social-media-icon" />    
          <img src={TwitterIcon} alt="Social Media" className="footer__social-media-icon" />

        </div>
      </div>
       
    </footer>
  );
};

export default Footer;