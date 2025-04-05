//React imports
import {React, useState} from 'react'

import {Link} from 'react-router-dom';


//Style import
import './index.css'


//Importing SVG as React components
import {ReactComponent as CaretDown} from '../../assets/caretdown.svg'

function DropDown(props) {

    const dropDownData = props.dropDownData;
    const pageId = props.pageId;
    const title = props.title;

    console.log(dropDownData);
    console.log(pageId);
    console.log(title);

  const [mouseOver, setMouseOver]= useState(false); 

  function handleMouseEnter(){
    setMouseOver(true);
  }

  function handleMouseOut(){
    setMouseOver(false);
  }


    return (
            <div className='dropdown-container'  onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseOut}>
                <p href={pageId} className='header__service' tabIndex={0}>
                  <span className="header__service-text">{title}</span>
                  <CaretDown className="header__service-caretdown" />
                </p>
                    
                    <div className={mouseOver?'dropdown__visible':'dropdown__hidden'}  >
                        {dropDownData.map((listItem,index)=> <li key={index.listItem}>
                                                               <Link to={listItem.link}> {listItem.serviceName}</Link>
                                                             
                                                            </li> )}


                    </div>

            </div>
    )

}

export default DropDown