@extends('layouts.main')

@section('submenu')
    <div class="row">
        <div class="col-md-12 navbar navbar-default">
            <ul class="nav navbar-nav navbar-left">
                @if(Auth::check())
                    <li><a href="{{ url('/overview') }}">Oppmøte</a></li>
                    <li><a href="#">Oppmøte - plott</a></li>
                    <li><a href="#">Stemmer - plott</a></li>
                    <li><a href="#">Kjønn - plott</a></li>
                    <li><a href="#">Betaling</a></li>
                @endif
            </ul>
        </div>
    </div>
@endsection