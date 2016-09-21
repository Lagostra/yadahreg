@extends('layouts.graphs')

@section('head')
    <link rel="stylesheet" href="{{ url('/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css') }}" />
@endsection

@section('content')
<div class="row">
    <div class="col-md-10 col-md-offset-1">
        <div class="panel panel-default">
            <div class="panel-heading">Oppmøte etter kjønn</div>

            <div class="panel-body">
                <form class="form-horizontal form-inline margin-bottom-fix" role="form" name="add_form" method="GET" action="{{ url('/graphs/attendance-by-gender') }}">
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
                        <div class="col-md-6 col-md-offset-4">
                            <button type="submit" class="btn btn-primary">
                                Generér
                            </button>
                        </div>

                    </div>
                </form>

                <div id="attendance-div"></div>

                <?php echo Lava::render('LineChart', 'attendance', 'attendance-div'); ?>
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