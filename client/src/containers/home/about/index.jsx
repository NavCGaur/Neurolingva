import React from 'react';
import { Link } from "react-router-dom";

import './index.css';

import AboutImage from '../../../assets/aboutimage.webp';

import FeaturesCard from '../../../components/cards/featuresCard';
import { featuresData } from './featuresData';

const About = () => {
  return (
    <div className='about' >
      <div className='about__image-container'>
        <img src={AboutImage} loading="lazy" alt="about" className='about__image'/>
      </div>

      <div className='about__title'  id='features'>
       Key Features:
      </div>
    
      <div className='about__features'>            
        <div className="about__features-container">
            {featuresData.map(feature => (
            <FeaturesCard
                key={feature.id}
                title1={feature.title1}
                title2={feature.title2}
                description={feature.description}
                backgroundImage={feature.backgroundImage}
            />
            ))}
        </div>
      </div>
      
      <div className="about__button-container">
        <div className="about__button-group">
          <div className="about__overlap-group">
            <Link to="/login" className="about__register-button">
                GO TO
            </Link>
          </div>
        </div>
      </div>

                
    </div>    
  );
};

export default About;
