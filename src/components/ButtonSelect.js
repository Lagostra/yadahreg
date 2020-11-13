import React from 'react';

const ButtonSelect = ({
    value = 'not-present',
    onChange,
    options
}) => (
        <span className="button-select">
            {options &&
                options.map(option => (
                    <button
                        className={`
                            btn btn-small 
                            ${option['className'] ? option['className'] : ''}
                            ${value === option.value ? 'selected' : ''} 
                        `}
                        onClick={() => onChange({ value: option.value })}
                        title={option.tooltip ? option.tooltip : ''}
                        key={option.value}
                    >
                        {option.text}
                    </button>
                ))}
        </span>
    );

export default ButtonSelect;
