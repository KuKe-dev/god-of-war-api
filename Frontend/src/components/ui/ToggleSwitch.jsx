import { useState } from 'react';
import './ToggleSwitch.css'

export default function ToggleSwitch() {

    const [isActive, setIsActive] = useState(false);


    function toggle() {
        setIsActive(!isActive);
    }

    return (
        <button id='toggle-switch' className={`toggle-switch ${isActive ? 'active' : ''}`} type="button" role="switch" aria-checked={isActive} onClick={toggle}>
            <div className={`button-switch ${isActive ? 'active' : ''}`} ></div>
        </button>
    );
}