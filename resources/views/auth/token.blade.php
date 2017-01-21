@extends('layouts.main')

@section('content')
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Api Token</div>
                <div class="panel-body">
                    <div class="form-horizontal">
                        <div class="row">
                            <div class="col-md-8">
                                <input type="text" for="email" class="form-control" value="{{ Auth::user()->api_token }}" onclick="this.select();" readonly>
                            </div>
                            <div class="col-md-4">
                                <a class="btn btn-primary" href="{{ url('/profile/generate_token') }}">
                                    Generér ny
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
