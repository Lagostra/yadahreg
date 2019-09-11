import React from 'react';

const ButtonSelect = ({
    value = 'not-present',
    onChange,
    options,
}) => (
    <span className="button-select">
        {options &&
            options.map(option => (
                <button
                    className="btn btn-small"
                    onClick={() => onChange({ value: option.value })}
                    selected={value === option.value}
                    title={option.tooltip ? option.tooltip : ''}
                    key={option.value}
                >
                    {option.text}
                </button>
            ))}
    </span>
);

export default ButtonSelect;
