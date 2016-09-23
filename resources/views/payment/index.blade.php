@extends('layouts.main')

@if($chosen_semester != null)
@section('head')
    <script>
        function setStatus(member_id, status) {
            status = (status) ? 1 : 0;
            $.ajax({
                url: '{{ url('/payment') }}',
                type: 'POST',
                data: {
                    _token: '{{ csrf_token() }}',
                    member_id: member_id,
                    semester_id: {{ $chosen_semester->id }},
                    status: status,
                }
            }).fail(function(data, status) {
                window.alert("Noe gikk galt. Vennligst last siden på nytt.");
            });
        }

        function selectSemester(sel) {
            window.location = "{{ url('/payment') }}/" + sel.value;
        }

        function search(field) {
            var string = field.value;
            var regex = new RegExp("(.*)" + string + "(.*)","i");

            var $rows = $('#member-table').find("tbody").find('tr');
            $.each($rows, function(i, row) {
                var name = $(row).find('.member-name').html();
                if(regex.test(name)) {
                    $(row).show();
                } else {
                    $(row).hide();
                }
            });
        }

        function onChooseActive(e) {
            if(e.checked)
                window.location = '{{ url('/payment/'.$chosen_semester->id) }}';
            else
                window.location = '{{ url('/payment/'.$chosen_semester->id.'/1') }}';
        }
    </script>
@endsection
@endif

@section('content')
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Registrering av betaling</div>

                <div class="panel-body">

                    <div class="row margin-bottom-fix">
                        <div class="col-md-8">
                            <select class="form-control" onchange="selectSemester(this);">
                                @foreach($semesters as $semester)
                                    <option value="{{ $semester->id }}" {{ ($semester->id === $chosen_semester->id) ? 'selected' : '' }}>{{ $semester->title }}</option>
                                @endforeach
                                @if(count($semesters) == 0)
                                    <option selected disabled>Ingen semestere</option>
                                @endif
                            </select>
                        </div>
                    </div>

                    <a class="btn btn-primary margin-bottom-fix" href="{{ url('/semesters/add') }}">Nytt semester</a>

                    @if($chosen_semester != null)
                        <a class="btn btn-primary margin-bottom-fix" href="{{ url('/semesters/edit/'.$chosen_semester->id) }}">Rediger semester</a>

                        <span class="margin-left-10px">Vis bare aktive medlemmer: </span>
                        <input type="checkbox" {{ !$show_inactive ? 'checked' : '' }} onclick="onChooseActive(this);" />

                        <input id="search" type="text" class="form-control" placeholder="Søk her" name="title" oninput="search(this);">

                        <div class="table-responsive">
                            <table id="member-table" class="table">
                                <thead>
                                <tr>
                                    <th>Navn</th>
                                    <th class="col-md-2">Har betalt</th>
                                </tr>
                                </thead>
                                <tbody>
                                @foreach($members as $member)
                                    <tr>
                                        <td class="member-name">{{ $member->first_name . " " . $member->last_name}}</td>
                                        <td>
                                            <input type="checkbox" value="{{ $member->id }}" {{ $member->paid ? 'checked' : '' }}
                                            onclick="setStatus({{ $member->id }}, this.checked);"/>
                                        </td>
                                    </tr>
                                @endforeach
                                </tbody>
                            </table>
                        </div>
                    @else
                        <p>
                            Fant ingen semestere! Opprett en før du kan registrere betaling.
                        </p>
                    @endif
                </div>
            </div>
        </div>
    </div>
@endsection