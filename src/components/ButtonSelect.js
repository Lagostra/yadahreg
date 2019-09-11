import React from 'react';

const ButtonSelect = ({
    value = 'not-present',
    onChange,
    options,
}) => (
    <span className="button-select">
        {options.map(option => (
            <button
                className="btn btn-small"
                onClick={() => onChange({ value: option.value })}
                selected={value === option.value}
                key={option.value}
            >
                {option.text}
            </button>
        ))}
    </span>
);

export default ButtonSelect;
