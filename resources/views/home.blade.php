@extends('layouts.main')

@section('content')
<div class="row">
    <div class="col-md-10 col-md-offset-1">
        <div class="panel panel-default">
            <div class="panel-body">
                <noscript>
                    <div class="alert alert-danger">
                        <strong>Advarsel!</strong> Javascript er ikke aktivert i din nettleser. Denne siden benytter
                        Javascript aktivt for å tilby funksjonalitet, og vil ikke fungere som forventet uten.
                    </div>
                </noscript>

                <h3>
                    Velkommen til YadahReg!
                </h3>

                <div class="alert alert-danger">
                    Dette er den gamle versjonen av YadahReg, som ikke lenger er i bruk! Endringer foretatt her vil derfor ikke lagres i korets registere.
                    Det jobbes med å få den nye versjonen opp og gå - den vil snart bli tilgjengelig.
                </div>

                @if(Auth::user()->is_user())
                <p>
                    Bruk menyen over for å navigere.
                </p>
                @else
                <div class="alert alert-warning">
                    Brukeren din er opprettet, men den er ikke aktivert ennå.
                    Ta kontakt med administrator for å fikset dette.
                </div>
                @endif

            </div>
        </div>
    </div>
</div>
@endsection
