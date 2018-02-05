@extends('layouts.graphs')

@section('head')
    <link rel="stylesheet" href="{{ url('/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css') }}" />
@endsection

@section('content')
    <div class="row">
        <div class="col-md-12">
            <div class="panel panel-default">
                <div class="panel-heading">Oppmøte</div>

                <div class="panel-body">
                    <form class="form-horizontal form-inline margin-bottom-fix" role="form" name="add_form" method="GET" action="{{ url('/graphs/attendance') }}">
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
                            <div class="col-md-6 col-md-offset-4">
                                <button type="submit" class="btn btn-primary">
                                    Generér
                                </button>
                            </div>

                        </div>
                    </form>

                    <div id="attendance-div"></div>

                    <?php echo Lava::render('AreaChart', 'attendance', 'attendance-div'); ?>
                </div>
            </div>
        </div>
    </div>
@endsection