@extends('layouts.main')

@section('submenu')
    <div class="row">
        <div class="col-md-12 navbar navbar-default">
            <ul class="nav navbar-nav navbar-left">
                <li><a href="{{ url('/overview/attendance') }}">Oppmøte</a></li>
                <li><a href="{{ url('/overview/toplist') }}">Toppliste</a></li>
                <li><a href="{{ url('/overview/inactive-members') }}">Inaktive medlemmer</a></li>
                <li><a href="{{ url('/overview/payment') }}">Betaling</a></li>
                <li><a href="{{ url('/overview/statistics') }}">Semesterstatistikk</a></li>
                <!--<li><a href="{{ url('/overview/contact') }}">Kontaktinformasjon</a></li>-->
                <li><a href="{{ url('/overview/allergies') }}">Allergier</a></li>
                <li><a href="{{ url('/overview/mailing-list') }}">E-postliste</a></li>
            </ul>
        </div>
    </div>
@endsection