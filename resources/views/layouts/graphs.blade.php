@extends('layouts.main')

@section('submenu')
    <div class="row">
        <div class="col-md-12 navbar navbar-default">
            <ul class="nav navbar-nav navbar-left">
                <li><a href="{{ url('/graphs/attendance') }}">Oppmøte</a></li>
                <li><a href="{{ url('/graphs/attendance-by-voice') }}">Oppmøte - stemmer</a></li>
                <li><a href="{{ url('/graphs/attendance-by-gender') }}">Oppmøte - kjønn</a></li>
                <li><a href="{{ url('/graphs/voice') }}">Stemmer</a></li>
                <li><a href="{{ url('/graphs/gender') }}">Kjønn</a></li>
                <li><a href="{{ url('/graphs/age') }}">Alder</a></li>
            </ul>
        </div>
    </div>
@endsection