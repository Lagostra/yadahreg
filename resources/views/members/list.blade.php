@extends('layouts.main')

@section('head')
    <script>
        function onChooseActive(e) {
            console.log("boop");
            if(e.checked)
                window.location = '{{ url('/members') }}';
            else
                window.location = '{{ url('/members/1') }}';
        }

        function search(field) {
            var string = field.value;
            var regex = new RegExp("(.*)" + string + "(.*)","i");

            var $rows = $('#member-table').find("tbody").find('tr');
            $.each($rows, function(i, row) {
                var name = $(row).find('.member-first-name').html() + " " + $(row).find('.member-last-name').html();
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
                <div class="panel-heading">Medlemmer</div>

                <div class="panel-body">
                    <div class="row margin-bottom-fix">
                        <div class="col-md-12">
                            <a class="btn btn-primary" href="{{ url('/members/add/') }}">Legg til medlem</a>
                            <span class="margin-left-10px">Vis bare aktive medlemmer: </span>
                            <input type="checkbox" {{ !$show_active ? 'checked' : '' }} onclick="onChooseActive(this);" />
                            <span class="margin-left-10px">Antall: {{ count($members) }}</span>
                        </div>
                    </div>

                    <input id="search" type="text" class="form-control" placeholder="Søk her" name="title" oninput="search(this);">

                    <div class="table-responsive">
                        <table id="member-table" class="table sortable" id="member_table">
                            <thead>
                            <tr>
                                <th>Etternavn</th>
                                <th>Fornavn</th>
                                <th>E-post</th>
                                <th>Telefon</th>
                                <th>Stemmegruppe</th>
                            </tr>
                            </thead>
                            <tbody>
                            @foreach($members as $member)
                                <tr>
                                    <td class="member-last-name">{{ $member->last_name }}</td>
                                    <td class="member-first-name">{{ $member->first_name }}</td>
                                    <td>{{ $member->email }}</td>
                                    <td>{{ $member->phone }}</td>
                                    <td>{{ $member->preferred_voice == "null" ? "" : ucfirst($member->preferred_voice) }}</td>
                                    <td><a class="btn btn-primary btn-xs" href="{{ url('/members/edit/' . $member->id) }}">Rediger</a></td>
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