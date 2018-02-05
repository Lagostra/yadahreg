@extends('layouts.main')

@section('head')
    <link rel="stylesheet" href="{{ url('/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css') }}" />
@endsection

@section('content')
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Rediger hendelse</div>
                <div class="panel-body">
                    <form class="form-horizontal" role="form" name="add_form" method="POST" action="{{ url('/events/edit') }}">
                        {{ csrf_field() }}

                        <input type="hidden" name="id" value="{{ $event->id }}"/>

                        <div class="form-group{{ $errors->has('date') ? ' has-error' : '' }}">
                            <label for="date" class="col-md-4 control-label">Dato</label>

                            <div class="col-md-6">
                                <input type="date" class="form-control" name="date" value="{{ $event->date }}"required>

                                @if ($errors->has('date'))
                                    <span class="help-block">
                                    <strong>{{ $errors->first('date') }}</strong>
                                </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group{{ $errors->has('title') ? ' has-error' : '' }}">
                            <label for="title" class="col-md-4 control-label">Tittel</label>

                            <div class="col-md-6">
                                <input id="title" type="text" class="form-control" name="title" value="{{ $event->title  }}" required>

                                @if ($errors->has('title'))
                                    <span class="help-block">
                                    <strong>{{ $errors->first('title') }}</strong>
                                </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group{{ $errors->has('type') ? ' has-error' : '' }}">
                            <label for="type" class="col-md-4 control-label">Type</label>

                            <div class="col-md-6">
                                <select id="type" class="form-control" name="type" required>
                                    @foreach($types as $type)
                                        <option value="{{ $type->name }}" {{ ($event->type == $type->name ? "selected" : "") }}>{{ $type->name }}</option>
                                    @endforeach
                                </select>

                                @if ($errors->has('type'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('type') }}</strong>
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

                    <form class="form-inline pull-right" role="form" method="POST"  onsubmit="return confirm('Sikker på at du vil slette hendelsen?');" action="{{ url('/events/delete') }}">
                        <input type="hidden" name="_token" value="{{ csrf_token() }}">
                        <input type="hidden" name="id" value="{{ $event->id }}" />
                        <button type="submit" class="btn btn-primary margin-bottom-fix">
                            Slett hendelse
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection