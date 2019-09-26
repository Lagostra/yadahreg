import React from 'react';

const FacebookSpinner = () => (
    <div className="lds-facebook">
        <div></div>
        <div></div>
        <div></div>
    </div>
);

const SimpleSpinner = () => (
    <div className="lds-default">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
);

export { FacebookSpinner, SimpleSpinner };

const Spinner = FacebookSpinner;

export default Spinner;
