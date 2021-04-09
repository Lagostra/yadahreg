import React from 'react';
import { useAuthUser } from 'hooks';
import { withAuthorization } from 'components/Session';

const Home = () => {
 
  const authUser = useAuthUser();

  return (
    <div className="content">
      <h1>
        Velkommen til <strong>YadahReg!</strong>
      </h1>
      {authUser.permissions && authUser.role ? (
        <p>Bruk toppmenyen for å navigere til de forskjellige verktøyene på siden.</p>
      ) : (
        <p>Brukeren din er ikke aktivert. Ta kontakt med en administrator for å få fikset dette.</p>
      )}
      <p>Denne versjonen er bygd med GitHub Actions!</p>
    </div>
  )
};

export default withAuthorization(authUser => !!authUser)(Home);
