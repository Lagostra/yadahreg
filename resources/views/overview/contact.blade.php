@extends('layouts.overview')

@section('head')
    <script>
        function onChooseActive(e) {
            if(e.checked)
                window.location = '{{ url('/overview/contact?include_inactive=true') }}';
            else
                window.location = '{{ url('/overview/contact') }}';
        }

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

                    <input id="search" type="text" class="form-control" placeholder="Søk her" name="title" oninput="search(this);">

                    <div class="table-responsive">
                        <table id="member-table" class="table">
                            <thead>
                            <tr>
                                <th>Navn</th>
                                <th>Telefon</th>
                                <th>E-post</th>
                            </tr>
                            </thead>
                            <tbody>
                            @foreach($members as $member)
                                <tr class="member">
                                    <td class="member-name">{{ $member->first_name . " " . $member->last_name}}</td>
                                    <td>{{ $member->phone }}</td>
                                    <td><a href="mailto:{{ $member->email }}">{{ $member->email }}</a></td>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
@endsection