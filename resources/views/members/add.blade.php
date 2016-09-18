@extends('layouts.main')

@section('content')
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Legg til medlem</div>
                <div class="panel-body">
                    <form class="form-horizontal" role="form" name="add_form" method="POST" action="{{ url('/members/add') }}">
                        {{ csrf_field() }}

                        <div class="form-group{{ $errors->has('first_name') ? ' has-error' : '' }}">
                            <label for="first_name" class="col-md-4 control-label">Fornavn</label>

                            <div class="col-md-6">
                                <input id="first_name" type="text" class="form-control" name="first_name" value="{{ old('first_name') }}" required autofocus>

                                @if ($errors->has('first_name'))
                                    <span class="help-block">
                                    <strong>{{ $errors->first('first_name') }}</strong>
                                </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group{{ $errors->has('last_name') ? ' has-error' : '' }}">
                            <label for="last_name" class="col-md-4 control-label">Etternavn</label>

                            <div class="col-md-6">
                                <input id="last_name" type="text" class="form-control" name="last_name" value="{{ old('last_name') }}" required>

                                @if ($errors->has('last_name'))
                                    <span class="help-block">
                                    <strong>{{ $errors->first('last_name') }}</strong>
                                </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group{{ $errors->has('preferred_voice') ? ' has-error' : '' }}">
                            <label for="preferred_voice" class="col-md-4 control-label">Foretrukket stemme</label>

                            <div class="col-md-6">
                                <div class="form-check">
                                    <label class="form-check-label">
                                        <input class="form-check-input" type="radio" name="preferred_voice" id="preferred_voice1" value="" checked>
                                        Ikke valgt
                                    </label>
                                </div>
                                <div class="form-check">
                                    <label class="form-check-label">
                                        <input class="form-check-input" type="radio" name="preferred_voice" id="preferred_voice2" value="sopran">
                                        Sopran
                                    </label>
                                </div>
                                <div class="form-check">
                                    <label class="form-check-label">
                                        <input class="form-check-input" type="radio" name="preferred_voice" id="preferred_voice3" value="alt">
                                        Alt
                                    </label>
                                </div>

                                <div class="form-check">
                                    <label class="form-check-label">
                                        <input class="form-check-input" type="radio" name="preferred_voice" id="preferred_voice4" value="tenor">
                                        Tenor
                                    </label>
                                </div>

                                <div class="form-check">
                                    <label class="form-check-label">
                                        <input class="form-check-input" type="radio" name="preferred_voice" id="preferred_voice5" value="bass">
                                        Bass
                                    </label>
                                </div>

                                @if ($errors->has('preferred_voice'))
                                    <span class="help-block">
                                    <strong>{{ $errors->first('preferred_voice') }}</strong>
                                </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">
                            <label for="email" class="col-md-4 control-label">E-post</label>

                            <div class="col-md-6">
                                <input id="email" type="email" class="form-control" name="email" value="{{ old('email') }}">

                                @if ($errors->has('email'))
                                    <span class="help-block">
                                    <strong>{{ $errors->first('email') }}</strong>
                                </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group{{ $errors->has('phone') ? ' has-error' : '' }}">
                            <label for="phone" class="col-md-4 control-label">Telefonnummer</label>

                            <div class="col-md-6">
                                <input id="phone" type="text" class="form-control" name="phone" value="{{ old('phone') }}">

                                @if ($errors->has('phone'))
                                    <span class="help-block">
                                    <strong>{{ $errors->first('phone') }}</strong>
                                </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group{{ $errors->has('active') ? ' has-error' : '' }}">
                            <div class="col-md-6">
                                <div class="form-check">
                                    <label class="form-check-label">
                                        <input class="form-check-input" type="radio" name="active" id="active1" value="true" checked>
                                        Aktiv
                                    </label>
                                </div>
                                <div class="form-check">
                                    <label class="form-check-label">
                                        <input class="form-check-input" type="radio" name="active" id="active2" value="false">
                                        Ikke aktiv
                                    </label>
                                </div>

                                @if ($errors->has('active'))
                                    <span class="help-block">
                                    <strong>{{ $errors->first('active') }}</strong>
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
