@extends('layouts.overview')

@section('head')
    <script>
        function onChooseActive(e) {
            if(e.checked)
                window.location = '{{ url('/overview/allergies?include_inactive=true') }}';
            else
                window.location = '{{ url('/overview/allergies') }}';
        }
    </script>
@endsection

@section('content')
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-default">
                <div class="panel-heading">
                    Allergier
                </div>

                <div class="panel-body">
                    <div class="row margin-bottom-fix">
                        <div class="col-md-12">
                            <span class="margin-left-10px">Inkluder ikke-aktive medlemmer: </span>
                            <input type="checkbox" onclick="onChooseActive(this);" {{ $include_inactive ? 'checked' : '' }} />
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table id="member-table" class="table">
                            <thead>
                            <tr>
                                <th>Navn</th>
                                <th>Allergier</th>
                            </tr>
                            </thead>
                            <tbody>
                            @foreach($members as $member)
                                @if($member->allergies != "")
                                <tr class="member">
                                    <td class="member-name">{{ $member->first_name . " " . $member->last_name}}</td>
                                    <td>{{ $member->allergies }}</td>
                                </tr>
                                @endif
                            @endforeach
                            </tbody>
                        </table>
                </div>
            </div>
        </div>
    </div>
@endsection