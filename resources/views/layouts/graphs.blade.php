@extends('layouts.main')

@section('submenu')
    <div class="row">
        <div class="col-md-12 navbar navbar-default">
            <ul class="nav navbar-nav navbar-left">
                <li><a href="{{ url('/graphs/attendance') }}">Oppmøte</a></li>
                <li><a href="{{ url('/graphs/voices') }}">Oppmøte - stemmer</a></li>
                <li><a href="{{ url('/plot') }}">Oppmøte - kjønn</a></li>
                <li><a href="#">Stemmer</a></li>
                <li><a href="#">Kjønn</a></li>
            </ul>
        </div>
    </div>
@endsection