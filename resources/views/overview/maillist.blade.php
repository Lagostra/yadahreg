@extends('layouts.overview')

@section('head')
    <script>
        function onChooseActive(e) {
            if(e.checked)
                window.location = '{{ url('/overview/mailing-list?include_inactive=true') }}';
            else
                window.location = '{{ url('/overview/mailing-list') }}';
        }
    </script>
@endsection

@section('content')
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-default">
                <div class="panel-heading">
                    E-postliste
                </div>

                <div class="panel-body">
                    <form class="form-horizontal form-inline margin-bottom-fix" role="form" name="add_form" method="GET" action="{{ url('/overview/mailing-list') }}">
                        <div class="form-group">
                            <label for="start_date" class="col-md-6 control-label">Opprettet etter</label>

                            <div class="col-md-6">
                                <input type="date" class="form-control" name="start_date" value="{{ $start_date }}">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="end_date" class="col-md-6 control-label">Opprettet før</label>

                            <div class="col-md-6">
                                <input type="date" class="form-control" name="end_date" value="{{ $end_date }}">
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-md-6 col-md-offset-2">
                                <button type="submit" class="btn btn-primary">
                                    Generér
                                </button>
                            </div>

                        </div>
                    </form>

                    <input type="text" class="mailing-list form-control" onclick="this.select();"
                           value="<?php
                            foreach($members as $member) {
                                if($member->email != "") {
                                    echo $member->email . ";";
                                }
                            }
                        ?>" />
                </div>
            </div>
        </div>
    </div>
@endsection