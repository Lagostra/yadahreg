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
                <div class="panel-heading">Toppliste - oppmøte</div>

                <div class="panel-body">
                    <form class="form-horizontal form-inline margin-bottom-fix" role="form" name="add_form" method="GET" action="{{ url('/overview/toplist') }}">
                        <div class="form-group">
                            <label for="semester" class="col-md-4 control-label">Semester</label>

                            <div class="col-md-6">
                                <select class="form-control" name="semester">
                                    @foreach($semesters as $semester)
                                        <option value="{{ $semester->id }}" {{ ($semester->id === $chosen_semester->id) ? 'selected' : '' }}>{{ $semester->title }}</option>
                                    @endforeach
                                    @if(count($semesters) == 0)
                                        <option selected disabled>Ingen semestere</option>
                                    @endif
                                </select>
                            </div>
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
                                    <th>Plassering</th>
                                    <th>Navn</th>
                                    <th>Oppmøte</th>
                                </tr>
                            </thead>
                            <tbody>
                            @php($i = 0)
                            @foreach($members as $member)
                                <tr class="member">
                                    <td>{{ ++$i }}</td>
                                    <td class="member-name">{{ $member->first_name . " " . $member->last_name}}</td>
                                    <td>{{ $member->num_events }}</td>
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