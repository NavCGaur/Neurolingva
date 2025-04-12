// FeaturesCard.js
import React from 'react';
import './index.css';


const FeaturesCard = ({ title1, title2, description, backgroundImage }) => {
    return (
        <div className="featurescard">
        <div className="featurescard__group">

        <div className="featurescard__title-container">
                <div className="featurescard__title-text-back">{title1}</div>
                <div className="featurescard__title-text-front">{title1}</div>
              </div>
              <div className="featurescard__title-container">
                <div className="featurescard__title-text-back">{title2}</div>
                <div className="featurescard__title-text-front">{title2}</div>
            </div>
          <div className="featurescard__overlap-group">
            <img 
              className="featurescard__image" 
              loading="lazy"
              alt="Feature illustration" 
              src={backgroundImage} 
            />
            
            <div className="featurescard__rectangle" />
            <div className="featurescard__div" />

            

            <p className="featurescard__text-wrapper">
              {description}
            </p>
                       
           
          </div>
        </div>
      </div>
  
    );
  };
  
  export default FeaturesCard;