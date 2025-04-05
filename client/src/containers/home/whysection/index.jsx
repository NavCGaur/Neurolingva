import React from 'react';
import './index.css';



import FeaturesCard from '../../../components/cards/featuresCard';
import { whySectionData } from './whySectionData';

const WhySection = () => {
  return (
    <div className='about'>
     <div className="why">
        <div className="why__title">
           Why Neurolingva?
        </div>  

        <div className="why__subtitle">
           Neurolingva is ideal for:
        </div>  

        <div className='why__features'>            
            <div className="why__features-container">
                {whySectionData.map(feature => (
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
      </div>

    </div>
  );
};

export default WhySection;
