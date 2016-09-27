@extends('layouts.overview')

@section('head')
    <script>

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
                    <input type="text" class="mailing-list form-control" onClick="this.select();"
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