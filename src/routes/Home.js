import React from 'react';
import { compose } from 'recompose';
import {
    withAuthorization,
    withAuthUser,
} from '../components/Session';

const Home = ({ authUser }) => (
    <div className="content">
        <h1>
            Velkommen til <strong>YadahReg!</strong>
        </h1>
        {authUser.permissions && authUser.role ? (
            <p>
                Bruk toppmenyen for å navigere til de forskjellige
                verktøyene på siden.
            </p>
        ) : (
            <p>
                Brukeren din er ikke aktivert. Ta kontakt med en
                administrator for å få fikset dette.
            </p>
        )}
    </div>
);

export default compose(
    withAuthorization(authUser => !!authUser),
    withAuthUser,
)(Home);
