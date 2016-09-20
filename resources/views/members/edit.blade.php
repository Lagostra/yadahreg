@extends('layouts.main')

@section('head')
    <link rel="stylesheet" href="{{ url('/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css') }}" />
@endsection

@section('content')
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Rediger medlem</div>
                <div class="panel-body">
                    <form class="form-horizontal" role="form" name="add_form" method="POST" action="{{ url('/members/edit') }}">
                        {{ csrf_field() }}

                        <input type="hidden" name="id" value="{{ $member->id }}" />

                        <div class="form-group{{ $errors->has('first_name') ? ' has-error' : '' }}">
                            <label for="first_name" class="col-md-4 control-label">Fornavn</label>

                            <div class="col-md-6">
                                <input id="first_name" type="text" class="form-control" name="first_name" value="{{ $member->first_name }}" required autofocus>

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
                                <input id="last_name" type="text" class="form-control" name="last_name" value="{{ $member-> last_name }}" required>

                                @if ($errors->has('last_name'))
                                    <span class="help-block">
                                    <strong>{{ $errors->first('last_name') }}</strong>
                                </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group{{ $errors->has('gender') ? ' has-error' : '' }}">
                            <label for="gender" class="col-md-4 control-label">Kjønn</label>

                            <div class="col-md-6">
                                <div class="form-check">
                                    <label class="form-check-label">
                                        <input class="form-check-input" type="radio" name="gender" id="gender1" value="kvinne" {{ $member->gender == "kvinne" ? "checked" : "" }} />
                                        Kvinne
                                    </label>
                                </div>
                                <div class="form-check">
                                    <label class="form-check-label">
                                        <input class="form-check-input" type="radio" name="gender" id="gender2" value="mann" {{ $member->gender == "mann" ? "checked" : "" }} />
                                        Mann
                                    </label>
                                </div>

                                @if ($errors->has('gender'))
                                    <span class="help-block">
                                    <strong>{{ $errors->first('gender') }}</strong>
                                </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group{{ $errors->has('birthday') ? ' has-error' : '' }}">
                            <label for="birthday" class="col-md-4 control-label">Fødselsdato</label>

                            <div class="col-md-6">
                                <div id="datepicker" class="input-group date" data-provide="datepicker">
                                    <input type="text" class="form-control datepicker" name="birthday" value="{{ date("d.m.Y", strtotime($member->birthday)) }}">
                                    <div class="input-group-addon">
                                        <span class="glyphicon glyphicon-th"></span>
                                    </div>
                                </div>

                                @if ($errors->has('birthday'))
                                    <span class="help-block">
                                    <strong>{{ $errors->first('birthday') }}</strong>
                                </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group{{ $errors->has('preferred_voice') ? ' has-error' : '' }}">
                            <label for="preferred_voice" class="col-md-4 control-label">Foretrukket stemme</label>

                            <div class="col-md-6">
                                <div class="form-check">
                                    <label class="form-check-label">
                                        <input class="form-check-input" type="radio" name="preferred_voice" id="preferred_voice1" value="null" @if($member->preferred_voice == "null")checked @endif >
                                        Ikke valgt
                                    </label>
                                </div>
                                <div class="form-check">
                                    <label class="form-check-label">
                                        <input class="form-check-input" type="radio" name="preferred_voice" id="preferred_voice2" value="sopran" @if($member->preferred_voice == "sopran")checked @endif >
                                        Sopran
                                    </label>
                                </div>
                                <div class="form-check">
                                    <label class="form-check-label">
                                        <input class="form-check-input" type="radio" name="preferred_voice" id="preferred_voice3" value="alt" @if($member->preferred_voice == "alt")checked @endif>
                                        Alt
                                    </label>
                                </div>

                                <div class="form-check">
                                    <label class="form-check-label">
                                        <input class="form-check-input" type="radio" name="preferred_voice" id="preferred_voice4" value="tenor" @if($member->preferred_voice == "tenor")checked @endif>
                                        Tenor
                                    </label>
                                </div>

                                <div class="form-check">
                                    <label class="form-check-label">
                                        <input class="form-check-input" type="radio" name="preferred_voice" id="preferred_voice5" value="bass" @if($member->preferred_voice == "bass")checked @endif>
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
                                <input id="email" type="email" class="form-control" name="email" value="{{ $member->email }}">

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
                                <input id="phone" type="text" class="form-control" name="phone" value="{{ $member->phone }}">

                                @if ($errors->has('phone'))
                                    <span class="help-block">
                                    <strong>{{ $errors->first('phone') }}</strong>
                                </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group{{ $errors->has('address') ? ' has-error' : '' }}">
                            <label for="address" class="col-md-4 control-label">Adresse</label>

                            <div class="col-md-6">
                                <input id="address" type="text" class="form-control" name="address" value="{{ $member->address }}">

                                @if ($errors->has('address'))
                                    <span class="help-block">
                                    <strong>{{ $errors->first('address') }}</strong>
                                </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group{{ $errors->has('allergies') ? ' has-error' : '' }}">
                            <label for="allergies" class="col-md-4 control-label">Allergier</label>

                            <div class="col-md-6">
                                <input id="allergies" type="text" class="form-control" name="allergies" value="{{ $member->allergies }}">

                                @if ($errors->has('allergies'))
                                    <span class="help-block">
                                    <strong>{{ $errors->first('allergies') }}</strong>
                                </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group{{ $errors->has('active') ? ' has-error' : '' }}">
                            <label for="active" class="col-md-4 control-label">Aktiv</label>
                            <div class="col-md-6">
                                <div class="form-check">
                                    <label class="form-check-label">
                                        <input class="form-check-input" type="radio" name="active" id="active1" value="true" checked>
                                        Ja
                                    </label>
                                </div>
                                <div class="form-check">
                                    <label class="form-check-label">
                                        <input class="form-check-input" type="radio" name="active" id="active2" value="false">
                                        Nei
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
                                    Lagre
                                </button>
                            </div>
                        </div>

                    </form>
                    <form class="form-inline pull-right" role="form" method="POST"  onsubmit="return confirm('Sikker på at du vil slette medlemmet?');" action="{{ url('/members/delete') }}">
                        <input type="hidden" name="_token" value="{{ csrf_token() }}">
                        <input type="hidden" name="id" value="{{ $member->id }}" />
                        <button type="submit" class="btn btn-primary">
                            Slett medlem
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('foot')
    <script src="{{ url('/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js') }}"></script>
    <script>
        $('#datepicker').datepicker({
            format: "dd.mm.yyyy"
        });
    </script>
@endsection
