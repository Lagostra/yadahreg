@extends('layouts.main')

@if($chosen_event != null)
@section('head')
    <script>
        function change_status(target) {
            var member_id = target.getAttribute("member_id");
            if(target.value == "unset") {
                do_post(member_id, 0, "{{ url('/registration/unpresent') }}");
                do_post(member_id, 0, "{{ url('/registration') }}");
            } else if(target.value == "present") {
                do_post(member_id, 0, "{{ url('/registration/unpresent') }}");
                do_post(member_id, 1, "{{ url('/registration') }}");
            } else if(target.value == "unpresent") {
                do_post(member_id, 1, "{{ url('/registration/unpresent') }}");
                do_post(member_id, 0, "{{ url('/registration') }}");
            }
            update_participant_count();
        }

        function update_participant_count() {
            var inputs = document.getElementsByClassName("radio-present");

            var counter = 0;
            for(var i = 0; i < inputs.length; i++) {
                if(inputs[i].checked) {
                    counter++;
                }
            }

            document.getElementById("num-attendants").innerHTML = counter;
        }

        function do_post(member_id, status, url) {
            $.ajax({
                url: url,
                type: 'POST',
                data: {
                    _token: '{{ csrf_token() }}',
                    member_id: member_id,
                    event_id: {{ $chosen_event->id }},
                    status: status,
                }
            }).fail(function (data, status) {
                window.alert("Noe gikk galt. Vennligst last siden på nytt.");
            });
        }

        function selectEvent(sel) {
            window.location = "{{ url('/registration') }}/" + sel.value;
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
    </script>
@endsection
@endif

@section('content')
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Registrering</div>

                <div class="panel-body">

                    <div class="row margin-bottom-fix">
                        <div class="col-md-8">
                            <select class="form-control" onchange="selectEvent(this);">
                                @foreach($events as $event)
                                    <?php $date = date("d.m.Y", strtotime($event->date)); ?>
                                    <option value="{{ $event->id }}" {{ ($event->id === $chosen_event->id) ? 'selected' : '' }}>{{ $event->title == "" ? $date : $date . " - " . $event->title }}</option>
                                @endforeach
                                @if(count($events) == 0)
                                    <option selected disabled>Ingen hendelser</option>
                                @endif
                            </select>
                        </div>
                    </div>

                    <a class="btn btn-primary margin-bottom-fix" href="{{ url('/events/add') }}">Ny hendelse</a>

                    @if($chosen_event != null)
                    <a class="btn btn-primary margin-bottom-fix" href="{{ url('/events/edit/'.$chosen_event->id) }}">Rediger hendelse</a>

                    <input id="search" type="text" class="form-control" placeholder="Søk her" name="title" oninput="search(this);">

                    <div class="row">
                        <div class="col-md-12">
                            <h4 class="pull-right">Antall oppmøtte: <span id="num-attendants">{{ $chosen_event->participants->count() }}</span></h4>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table id="member-table" class="table">
                            <thead>
                            <tr>
                                <th>Navn</th>
                                <th class="col-md-2">Ikke til stede</th>
                                <th class="col-md-2">Til stede</th>
                                <th class="col-md-2">Gitt beskjed</th>
                            </tr>
                            </thead>
                            <tbody>
                            @foreach($members as $member)
                                <tr>
                                    <td class="member-name">
                                        {{ $member->first_name . " " . $member->last_name}}{{ $member->has_paid($last_semester) ? '' : '*'}}
                                    </td>
                                    <form class="presence-form">
                                        <td><input type="radio" name="status" value="unset" onchange="change_status(this);"
                                               member_id="{{ $member->id }}" class="radio-not-present"
                                                {{ (!$member->is_present($chosen_event) && !$member->is_not_present($chosen_event)) ? "checked" : "" }}/></td>
                                        <td><input type="radio" name="status" value="present" onchange="change_status(this);"
                                               member_id="{{ $member->id }}" class="radio-present"
                                                {{ ($member->is_present($chosen_event)) ? "checked" : "" }}/></td>
                                        <td><input type="radio" name="status" value="unpresent" onchange="change_status(this);"
                                               member_id="{{ $member->id }}" class="radio-confirmed-not-present"
                                                {{ ($member->is_not_present($chosen_event)) ? "checked" : "" }}/></td>
                                    </form>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                        * Har ikke betalt siste semesteravgift
                    </div>
                    @else
                        <p>
                            Fant ingen hendelser! Opprett en før du kan registrere oppmøte.
                        </p>
                    @endif
                </div>
            </div>
        </div>
        @if($birthdays->count() != 0)
        <div class="col-md-2">
            <div class="panel panel-default">
                <div class="panel-heading">Bursdager</div>

                <div class="panel-body">
                    <div class="table-responsive">
                        <table id="member-table" class="table">
                            <tbody>
                            @foreach($birthdays as $member)
                                <tr>
                                    <td class="member-name">{{ $member->first_name . " " . $member->last_name}}</td>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        @endif
    </div>
@endsection