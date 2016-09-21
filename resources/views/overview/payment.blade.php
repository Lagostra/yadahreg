@extends('layouts.overview')

@section('head')
    <link rel="stylesheet" href="{{ url('/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css') }}" />

    <script>
        function search(field) {
            var string = field.value;
            var regex = new RegExp("(.*)" + string + "(.*)","i");

            var $rows = $('#member-table').find("tbody").find('tr');
            $.each($rows, function(i, row) {
                var name = $(row).find('.member-name').html();
                if(regex.test(name)) {
                    $(row).show();
                } else {
                    $(row).hide();
                }
            });
        }
    </script>
@endsection

@section('content')
    <div class="row">
        <div class="col-md-12">
            <div class="panel panel-default">
                <div class="panel-heading">Betaling - oversikt</div>

                <div class="panel-body">
                    <form class="form-horizontal form-inline margin-bottom-fix" role="form" name="add_form" method="GET" action="{{ url('/overview/payment') }}">
                        <div class="form-group">
                            <label for="start_date" class="col-md-4 control-label">Startdato</label>

                            <div class="col-md-6">
                                <div class="input-group date my-datepicker" data-provide="datepicker">
                                    <input type="text" class="form-control datepicker" name="start_date" value="{{ date("d.m.Y", strtotime($start_date)) }}">
                                    <div class="input-group-addon">
                                        <span class="glyphicon glyphicon-th"></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="end_date" class="col-md-4 control-label">Sluttdato</label>

                            <div class="col-md-6">
                                <div class="input-group date my-datepicker" data-provide="datepicker">
                                    <input type="text" class="form-control datepicker" name="end_date" value="{{ date("d.m.Y", strtotime($end_date)) }}">
                                    <div class="input-group-addon">
                                        <span class="glyphicon glyphicon-th"></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <input name="show_inactive" type="checkbox" {{ $show_inactive ? 'checked' : '' }} onclick="onChooseActive(this);" />
                            <label for="show_inactive">Vis inaktive medlemmer</label>
                        </div>


                        <div class="form-group">
                            <div class="col-md-6 col-md-offset-4">
                                <button type="submit" class="btn btn-primary">
                                    Generér
                                </button>
                            </div>

                        </div>
                    </form>

                    <input id="search" type="text" class="form-control" placeholder="Søk her" name="title" oninput="search(this);">

                    <div class="table-responsive">
                        <table id="member-table" class="table">
                            <thead>
                            <tr>
                                <th>Navn</th>
                                @foreach($semesters as $semester)
                                    <th>{{ $semester->title }}</th>
                                @endforeach
                            </tr>
                            </thead>
                            <tbody>
                            @foreach($members as $member)
                                <tr>
                                    <td class="member-name">{{ $member->first_name . " " . $member->last_name}}</td>
                                    @foreach($semesters as $semester)
                                        <?php
                                        $paid = false;
                                        foreach($member->paid_semesters as $semester2) {
                                            if($semester->id == $semester2->id) {
                                                $paid = true;
                                                break;
                                            }
                                        }
                                        ?>
                                        <td class="td-padding-fix">
                                            {{ $paid ? 'Y' : '' }}
                                        </td>
                                    @endforeach
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection


@section('foot')
    <script src="{{ url('/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js') }}"></script>
    <script>
        $('.my-datepicker').datepicker({
            format: "dd.mm.yyyy"
        });
    </script>
@endsection