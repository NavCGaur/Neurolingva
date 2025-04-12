import React from 'react'
import './index.css';

import howsectionBottomImage from '../../../assets/howsection5image.webp';
import howsection1image from '../../../assets/howsection1image.webp';
import howsection4image from '../../../assets/howsection4image.webp';

const HowSection = () => {
  return (
 <div className="howsection">

        <div class="howsection__title-container">
            <div class="howsection__title-text-back">How It Works</div>
            <div class="howsection__title-text-front">How It Works</div>
        </div>

        <div className="howsection__image-container-one">
             <div className='howsection__image-container-two'>        
                <div className='howsection__image-container-four'>
                    <img src={howsection1image} alt="how"/>

                    <div class="howsection__title-container-image1">
                        <div class="howsection__title-text-back-image1">Record Your Voice</div>
                        <div class="howsection__title-text-front-image1">Record Your Voice</div>
                    </div>

                    <div class="howsection__subtitle-container-image1">
                        <div class="howsection__subtitle-text-back-image1">Simply speak into the app and our AI will analyze your pronunciation in real-time.</div>
                        <div class="howsection__subtitle-text-front-image1">Simply speak into the app and our AI will analyze your pronunciation in real-time.</div>
                     </div>


                </div>

                <div className='howsection__image-container-five'>
                <div className="pronunciation-feedback__container">
                    <div className="pronunciation-feedback__card">
                    <h2 className="pronunciation-feedback__card-title" style={{color:"#0080FF"}}>Get Pronunciation Feedback</h2>
                    <p className="pronunciation-feedback__card-subtitle">
                        Receive precise feedback on your pronunciation, including phonetic symbols, 
                        accuracy scores, and improvement tips.
                    </p>
                    </div>
                    
                    <div className="pronunciation-feedback__card" style={{backgroundColor:"#00BE0D"}}>
                    <h2 className="pronunciation-feedback__card-title" style={{color:"#FFFFFF"}}>Compare with Native Speakers</h2>
                    <p className="pronunciation-feedback__card-subtitle"  style={{color:"#FFFFFF"}}>
                        Use Praat Graphs to compare your pronunciation with native speakers in real-time, 
                        and visually track your improvements.
                    </p>
                    </div>
                </div>

                </div>
             </div>   

             <div className='howsection__image-container-three'>
                <img src={howsection4image} alt="how"/>

                <div class="howsection__subtitle-container">
                    <div class="howsection__subtitle-text-back">Retain new words with our SRS system that ensures you revisit vocabulary at the most effective intervals to maximize
                    long-term retention.</div>
                    <div class="howsection__subtitle-text-front">Retain new words with our SRS system that ensures you revisit vocabulary at the most effective intervals to maximize
                    long-term retention.</div>
                </div>
             </div>
        </div>

        <div className="howsection__image-container-bottom">
            <img src={howsectionBottomImage} alt="how" className='howsection__image-bottom'/>

            <div class="howsection__title-container-bottomimage">
                        <div class="howsection__title-text-back-bottomimage">Track Your Progress</div>
                        <div class="howsection__title-text-front-bottomimage">Track Your Progress</div>
                    </div>

                    <div class="howsection__subtitle-container-bottomimage">
                        <div class="howsection__subtitle-text-back-bottomimage">View your progress through detailed reports and graphs, helping you stay on track and motivated.</div>
                        <div class="howsection__subtitle-text-front-bottomimage">View your progress through detailed reports and graphs, helping you stay on track and motivated.</div>
                     </div>
        </div>

      </div>

  )
}

export default HowSection