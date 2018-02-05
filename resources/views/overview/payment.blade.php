@extends('layouts.overview')

@section('head')
    <link rel="stylesheet" href="{{ url('/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css') }}" />

    <script>
        function search(field) {
            var string = field.value;
            var regex = new RegExp("(.*)" + string + "(.*)","i");

            var $rows = $('#member-table').find("tbody").find('.member');
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
                    <div class="row">
                        <div class="col-md-12">
                            <a class="btn btn-primary pull-right" href="{{ url('/download/payment?start_date=' . $start_date .
                                                                        '&end_date=' . $end_date .
                                                                       ($show_inactive ? '&show_inactive=true' : '')) }}">Last ned som CSV</a>
                        </div>
                    </div>
                    <form class="form-horizontal form-inline margin-bottom-fix" role="form" name="add_form" method="GET" action="{{ url('/overview/payment') }}">
                        <div class="form-group">
                            <label for="start_date" class="col-md-4 control-label">Startdato</label>

                            <div class="col-md-6">
                                <input type="date" class="form-control" name="start_date" value="{{ $start_date }}">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="end_date" class="col-md-4 control-label">Sluttdato</label>

                            <div class="col-md-6">
                                <input type="date" class="form-control" name="end_date" value="{{ $end_date }}">
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-md-12">
                                <input name="show_inactive" type="checkbox" {{ $show_inactive ? 'checked' : '' }} onclick="onChooseActive(this);" />
                                <label for="show_inactive">Vis inaktive medlemmer</label>
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

                    <input id="search" type="text" class="form-control" placeholder="Søk her" name="title" oninput="search(this);">

                    <div class="table-responsive">
                        <table id="member-table" class="table">
                            <thead>
                                <tr>
                                    <th></th>
                                    @foreach($semesters as $semester)
                                        <th class="text-center">{{ $semester->title }}</th>
                                    @endforeach
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><em>Antall som har betalt</em></td>
                                    @foreach($semesters as $semester)
                                        <td class="text-center"><em>{{ $semester->paid_members->count() }}</em></td>
                                    @endforeach
                                </tr>
                            @foreach($members as $member)
                                <tr class="member">
                                    <td class="member-name">{{ $member->first_name . " " . $member->last_name}}</td>
                                    @foreach($semesters as $semester)
                                        <td class="text-center">
                                            {{ $member->has_paid($semester) ? 'Y' : '' }}
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