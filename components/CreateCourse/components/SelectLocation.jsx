import { useState, useEffect } from 'react';
import { queryCollection } from '../../../lib/firebase';

const SelectLocation = (props) => {
    const [states, setStates] = useState(null);
    const [cities, setCities] = useState(null);

    const setStateData = (state) => {
        props.onStateChange(state);
    };

    const setCityData = (city) => {
        props.onCityChange(city);
    };

    useEffect(() => {
        queryCollection(`courses`, setStates);
    }, []);

    return (
        <>
            {states ? (
                <select
                    onClick={(e) => {
                        queryCollection(`courses/${states}/city`, setCities);
                        setStateData(e.target.value);
                    }}
                >
                    {states.map((state) => {
                        return (
                            <option value={state} key={state}>
                                {state}
                            </option>
                        );
                    })}
                </select>
            ) : null}
            {cities ? (
                <select
                    onClick={(e) => {
                        setCityData(e.target.value);
                    }}
                >
                    {cities.map((city) => {
                        return (
                            <option value={city} key={city}>
                                {city}
                            </option>
                        );
                    })}
                </select>
            ) : null}
        </>
    );
};

export default SelectLocation;
