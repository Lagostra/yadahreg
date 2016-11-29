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

                <p>
                    Du er nå logget inn!
                </p>
                
                <p>
                    Bruk menyen over for å navigere.
                    Dersom du ser få/ingen lenker i menyen, kan det tyde på at brukeren din ikke er aktivert.
                    Ta i så fall kontakt med administrator for å få fikset dette.
                </p>

            </div>
        </div>
    </div>
</div>
@endsection
