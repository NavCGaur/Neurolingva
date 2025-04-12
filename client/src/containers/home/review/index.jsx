// ReviewCarousel.jsx
import React, { useState } from 'react';
import { Link } from "react-router-dom";

import { reviewData } from './reviewData';

import arrowLeft from '../../../assets/leftarrowimage.png';
import arrowRight from '../../../assets/rightarrowimage.png';
import facebookimage from '../../../assets/facebookimage.png';
import instagramimage from '../../../assets/instagramimage.png';
import tiktokimage from '../../../assets/tiktokimage.png';
import youtubeimage from '../../../assets/youtubeimage.png';
import twitterimage from '../../../assets/twitterimage.png';
import socialmedia from '../../../assets/socialmedia.png';

import './index.css';

const Review = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCards = 5;
  
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? reviewData.length - 1 : prevIndex - 1
    );
  };
  
  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % reviewData.length
    );
  };
  
  // Get visible reviews with wrap-around for carousel effect
  const visibleReviews = [];
  for (let i = 0; i < visibleCards; i++) {
    const index = (currentIndex + i) % reviewData.length;
    visibleReviews.push(reviewData[index]);
  }
  
  return (
    <div className="review">
      <div className="review__header">
        <h2 className="review__title">Customer Reviews</h2>
      </div>
      
      <div className="review__carousel-container">
        
        <div className="review__carousel">
          {visibleReviews.map((review, index) => (
            <div 
              key={`${review.name}-${index}`} 
              className={`review__card ${index === 0 ? 'first-card' : ''} ${index === visibleCards - 1 ? 'last-card' : ''}`}
            >
              <div className="review__quote-icon">❝❝</div>
              <p className="review__text">{review.text}</p>
              <div className="review__footer">
                <div className="review__author">
                  <p className="review__author-name">— {review.name}</p>
                  <p className="review__author-title">{review.title}</p>
                </div>
                <div className="review__rating">
                  {Array(review.rating).fill().map((_, i) => (
                    <span key={i} className="review__star">★</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="review__navigation">
        <button 
          className="review__nav-button review__nav-button--prev" 
          onClick={handlePrevious}
        >
           <img 
                src={arrowLeft} 
                alt="Previous" 
                className="review__nav-arrow"
            />
        </button>
        <button 
          className="review__nav-button review__nav-button--next" 
          onClick={handleNext}
        >
            <img 
                src={arrowRight} 
                alt="Next" 
                className="review__nav-arrow"
            />

        </button>
      </div>

      <div className="socialmedia">
        <div className='socialmedia__details'>

         <h2>Follow Us On Social Media </h2>
         <p>Stay updated and join our community on social media! Follow us for language learning tips, pronunciation challenges, and more.</p>
         <div className='socialmedia__links-facebook'>
            <p>Facebook: Neurolingva</p>
            <img src={facebookimage} alt='facebook'/>   
         </div>
         
         <div className='socialmedia__links-others'>
            <div>
             <p>Instagram: Neurolingva</p>
             <img src={instagramimage} alt='instagram'/>
            </div>
            <div>
             <p>Twitter: Neurolingva</p>
             <img src={twitterimage} alt='instagram'/>
            </div>
            <div>
             <p>Youtube: Neurolingva</p>
             <img src={youtubeimage} alt='instagram'/>
            </div>
            <div>
             <p>Tiktok: Neurolingva</p>
             <img src={tiktokimage} alt='instagram'/>
            </div>           
        </div>
        
      </div>
      <div className='socialmedia__image'>
            <img src={socialmedia} alt="socialmedia" className='socialmedia__image'/>

       </div>
      </div>

      <div className='joinNeurolingva'>
        <div class="joinNeurolingva__subtitle-container">
            <div class="joinNeurolingva__subtitle-text-back">Join the Neurolingva Community</div>
            <div class="joinNeurolingva__subtitle-text-front">Join the Neurolingva Community</div>
        </div>

        <div className="joinNeurolingva__description-one" id='contact'>At Neurolingva, we're not just about learning - we're about improving.     With personalized feedback and
        </div>
        <div className="joinNeurolingva__description-two">AI-powered tools, you’ll experience more than just traditional language learning methods.
        </div>

        <div className="review__button-container" >
        <div className="review__button-group">
          <div className="review__overlap-group">
            <Link to='/login' className="review__register-button">
                REGISTER
           </Link>
        </div>
      </div>
      </div>
      </div>

     
      
      <div className="gradient-bar"></div>


    </div>
  );
};

export default Review;