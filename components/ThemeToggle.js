import { useState, useEffect } from 'react';

const ThemeToggle = () => {
    const [activeTheme, setActiveTheme] = useState('light');
    const inactiveTheme = activeTheme === 'light' ? 'dark' : 'light';

    const [toggle, setToggle] = useState(false);
    const moveToggle = toggle ? `toggle-thumb-night` : `toggle-thumb-day`;

    useEffect(() => {
        document.body.dataset.theme = activeTheme;
    }, [activeTheme]);

    return (
        <button
            className="toggle-btn"
            aria-label={`Mode changed to: ${inactiveTheme}.`}
            title={`Mode changed to: ${inactiveTheme}.`}
            onClick={() => {
                setToggle(!toggle);
                setActiveTheme(inactiveTheme);
            }}
        >
            <span className={moveToggle} activetheme={activeTheme} />
            <span aria-hidden={true}>🌚</span>
            <span aria-hidden={true}>🌞</span>
        </button>
    );
};

export default ThemeToggle;
