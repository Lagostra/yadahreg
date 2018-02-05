@extends('layouts.main')

@section('head')
    <link rel="stylesheet" href="{{ url('/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css') }}" />
@endsection

@section('content')
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Legg til semester</div>
                <div class="panel-body">
                    <form class="form-horizontal" role="form" name="add_form" method="POST" action="{{ url('/semesters/add') }}">
                        {{ csrf_field() }}

                        <div class="form-group{{ $errors->has('title') ? ' has-error' : '' }}">
                            <label for="title" class="col-md-4 control-label">Tittel</label>

                            <div class="col-md-6">
                                <input id="title" type="text" class="form-control" name="title" value="{{ old('title') }}" required>

                                @if ($errors->has('title'))
                                    <span class="help-block">
                                    <strong>{{ $errors->first('title') }}</strong>
                                </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group{{ $errors->has('start_date') ? ' has-error' : '' }}">
                            <label for="start_date" class="col-md-4 control-label">Startdato</label>

                            <div class="col-md-6">
                                <input type="date" class="form-control" name="start_date" value="{{ old('start_date') }}" required>

                                @if ($errors->has('start_date'))
                                    <span class="help-block">
                                    <strong>{{ $errors->first('start_date') }}</strong>
                                </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group{{ $errors->has('end_date') ? ' has-error' : '' }}">
                            <label for="end_date" class="col-md-4 control-label">Sluttdato</label>

                            <div class="col-md-6">
                                <input type="date" class="form-control" name="end_date" value="{{ old('end_date') }}" required>

                                @if ($errors->has('end_date'))
                                    <span class="help-block">
                                    <strong>{{ $errors->first('end_date') }}</strong>
                                </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-md-6 col-md-offset-4">
                                <button type="submit" class="btn btn-primary">
                                    Legg til
                                </button>
                            </div>

                        </div>


                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection