@extends('layouts.graphs')

@section('content')
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-default">
                <div class="panel-heading">Kjønnsfordeling</div>

                <div class="panel-body">
                    <div id="gender-div"></div>

                    <?php echo Lava::render('ColumnChart', 'gender', 'gender-div'); ?>
                </div>
            </div>
        </div>
    </div>
@endsection