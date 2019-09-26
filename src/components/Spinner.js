import React from 'react';

const FacebookSpinner = () => (
    <div class="lds-facebook">
        <div></div>
        <div></div>
        <div></div>
    </div>
);

const SimpleSpinner = () => (
    <div class="lds-default">
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
