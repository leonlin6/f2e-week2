import React from "react";

const Link = (props) => {
    const onClick = (event) => {
    
        if(event.metaKey || event.crtlKey){
            return;
        }

        event.preventDefault();
        window.history.pushState({},'',props.href);

        const navEvent = new PopStateEvent('popstate');
        window.dispatchEvent(navEvent);

        // test
        if(props.click !== undefined){
            props.click();
        }
    }
    return(
        <a onClick={onClick} className={props.className} href={props.href}>
            {props.children}
        </a>
    );
}

export default Link;
