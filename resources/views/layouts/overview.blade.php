@extends('layouts.main')

@section('submenu')
    <div class="row">
        <div class="col-md-12 navbar navbar-default">
            <ul class="nav navbar-nav navbar-left">
                <li><a href="{{ url('/overview/attendance') }}">Oppmøte</a></li>
                <li><a href="{{ url('/overview/payment') }}">Betaling</a></li>
            </ul>
        </div>
    </div>
@endsection