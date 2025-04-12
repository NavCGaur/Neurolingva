import React from 'react';
import { Link } from "react-router-dom";

import './index.css';
const Main = () => {
  return (
    <div className='main'>
      <div className='main__title'>
        NEUROLINGVA:
      </div>

      <div class="main__subtitle-container">
        <div class="main__subtitle-text-back">AI-Powered Language Learning</div>
        <div class="main__subtitle-text-front">AI-Powered Language Learning</div>
      </div>

      <div className="main__button-container">
        <div className="main__button-group">
          <div className="main__overlap-group">
            <Link to="/signup" className="main__register-button">
                REGISTER
           </Link>
        </div>
      </div>

    </div>

    </div>
  );
};

export default Main;
