// FeaturesCard.js
import React from 'react';
import './index.css';


const FeaturesCard = ({ title1, title2, description, backgroundImage }) => {
    return (
        <div className="featurescard">
        <div className="featurescard__group">
          <div className="featurescard__overlap-group">
            <img 
              className="featurescard__image" 
              alt="Feature illustration" 
              src={backgroundImage} 
            />
            
            <div className="featurescard__rectangle" />
            <div className="featurescard__div" />

            <div class="featurescard__title-container">
                <div class="featurescard__title-text-back">   {title1} </div>
                <div class="featurescard__title-text-front">  {title1} </div>
            </div>
            <div class="featurescard__title-container">
                <div class="featurescard__title-text-back">   {title2} </div>
                <div class="featurescard__title-text-front">  {title2} </div>
            </div>
            
            <p className="featturescard__text-wrapper">
              {description}
            </p>
                       
           
          </div>
        </div>
      </div>
  
    );
  };
  
  export default FeaturesCard;