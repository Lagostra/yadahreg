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
                    <div class="row margin-bottom-fix">
                        <div class="col-md-12">
                            <span class="margin-left-10px">Inkluder ikke-aktive medlemmer: </span>
                            <input type="checkbox" onclick="onChooseActive(this);" {{ $include_inactive ? 'checked' : '' }} />
                        </div>
                    </div>
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