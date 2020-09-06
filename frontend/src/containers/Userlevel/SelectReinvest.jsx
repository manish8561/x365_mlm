import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const SelectReinvest = (props) => {

    let reinvestCountOptions = [];
    const { reinvestCount, changeReinvestValue, reinvest } = props; // Pull params key from props
    const [ option, setOption ] = useState([]); // options state 
    const [ value, setValue ] = useState(''); // select value on change 

    // Making object (keys. values) for select option array
    const reinvestOption = () => {

        for (let i = 0; i <= reinvestCount; i++) {
            reinvestCountOptions.push({ key: i, value: i});
        }

        setOption(reinvestCountOptions);
    }

    // Change selection value and pass
    const handleChange = (e) => {
        changeReinvestValue(e.target.value);
        setValue(e.target.value);
    }

    // Only works when reinvestcount update
    useEffect(() => {
        // Call reinvestOption on every update in value
        reinvestOption();

        // set value for options
        setValue(reinvest || reinvestCount);
    }, [props.reinvestCount]);

    return (
        <span className="selectDropdown">
            <select onChange={(e) => handleChange(e)} value={value}>
                {
                    option.map(row => {
                        return (
                            <option key={row.key} value={row.key}> { row.value } </option>
                        )
                    })
                }
            </select> 
        </span>
    )
}

export default SelectReinvest;