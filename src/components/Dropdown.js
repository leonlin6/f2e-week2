import React, {useState, useEffect, useRef} from "react";
import {connect} from 'react-redux';
import { selectCity } from "../actions";


const Dropdown = (props) =>{

    const [open , setOpen] = useState(false);
    const ref = useRef();

    useEffect(
        () => {
            const onBodyClick = (event) => {
                if(ref.current.contains(event.target)){
                    return;
                }
                setOpen(false);
            }

            document.body.addEventListener('click',onBodyClick,{capture: true}); 

            return () => {
                document.body.removeEventListener('click',onBodyClick,{capture: true});
            }
        },[]
    );

    const renderedOptions = props.cities.map((option, index) => { 
        // if(option === selected){
        //     return null;
        // }

        const renderCity = option.cities.map((item, ind) => {

            return(
                <div key={item} className="dropItem"  onClick={() => {props.selectCity(item)}}>
                    {item}
                </div>
            );
        });

        
        return(
            <div key={`option`+index}>
                <div key={option.area} className="dropItemLabel" >                
                    {option.area}
                </div>
                {renderCity}
            </div>
        )
    });

    const onDropDown = () =>{
        setOpen(!open);
    }
    
    if(props.selectedCity !== null){
        return(
            <span ref={ref} className="dropdown" onClick={onDropDown}>
                <div className="text">{props.selectedCity}</div>
                <img alt="dropdown menu icon" src={require('../images/DropdownIcon.png').default}></img>
                <div className={`menu ${open ? 'visible' : ''}`}>
                    {renderedOptions}
                </div>
            </span>        
        );
    }
    return(
        <span ref={ref} className="dropdown" onClick={onDropDown}>
            <img alt="dropdown menu icon" src={require('../images/DropdownIcon.png').default}></img>
            <div className={`menu ${open ? 'visible' : ''}`}>
                {renderedOptions}
            </div>
        </span>        
    );
}


const mapStateToProps = (state) => {
    return {
        cities:state.cities, 
        selectedCity:state.selectedCity
    };
}

export default connect(mapStateToProps, {selectCity})(Dropdown);
