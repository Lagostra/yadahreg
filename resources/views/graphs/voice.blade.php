@extends('layouts.graphs')

@section('head')
    <script>
        function onChooseActive(e) {
            if(e.checked)
                window.location = '{{ url('/graphs/voice?include_inactive=true') }}';
            else
                window.location = '{{ url('/graphs/voice') }}';
        }
    </script>
@endsection

@section('content')
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-default">
                <div class="panel-heading">Stemmefordeling</div>

                <div class="panel-body">
                    <div class="row margin-bottom-fix">
                        <div class="col-md-12">
                            <span class="margin-left-10px">Inkluder inaktive medlemmer: </span>
                            <input type="checkbox" {{ $include_inactive ? 'checked' : '' }} onclick="onChooseActive(this);" />
                        </div>
                    </div>

                    <div id="voice-div"></div>

                    <?php echo Lava::render('ColumnChart', 'voice', 'voice-div'); ?>
                </div>
            </div>
        </div>
    </div>
@endsection