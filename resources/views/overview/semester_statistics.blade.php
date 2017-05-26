@extends('layouts.overview')

@section('content')
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-default">
                <div class="panel-heading">
                    Semesterstatistikk
                </div>

                <div class="panel-body">
                    <form class="form-horizontal form-inline margin-bottom-fix col-md-12" role="form" name="add_form" method="GET" action="{{ url('/overview/toplist') }}">
                        <div class="form-group">
                            <label for="semester" class="control-label col-md-4">Semester</label>

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

                        <div class="form-group" style="margin-left: 25px;">
                            <button type="submit" class="btn btn-primary">
                                Generér
                            </button>
                        </div>
                    </form>

                    <table class="table">
                        <tr>
                            <td>Antall øvelser:</td>
                            <td>{{ $num_practices }}</td>
                        </tr>
                        <tr>
                            <td>Gjennomsnittlig oppmøte per øvelse:</td>
                            <td>{{ $avg_attendance }}</td>
                        </tr>
                        <tr>
                            <td>Maksimalt oppmøte på en øvelse:</td>
                            <td>{{ $max_attendance }}</td>
                        </tr>
                        <tr>
                            <td>Minimalt oppmøte på en øvelse:</td>
                            <td>{{ $min_attendance }}</td>
                        </tr>

                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('foot')
    <script src="{{ url('/plugins/bootstrap-sortable/moment.min.js') }}"></script>
    <script src="{{ url('/plugins/bootstrap-sortable/bootstrap-sortable.js') }}"></script>
@endsection