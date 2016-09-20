@extends('layouts.graphs')

@section('content')
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-default">
                <div class="panel-heading">Oppmøte</div>

                <div class="panel-body">
                    <div id="attendance-div"></div>

                    <?php echo Lava::render('LineChart', 'attendance', 'attendance-div'); ?>
                </div>
            </div>
        </div>
    </div>
@endsection