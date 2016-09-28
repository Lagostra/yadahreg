@extends('layouts.main')

@if($chosen_event != null)
@section('head')
    <script>
        function checkbox_click(e) {
            if($(e.target).hasClass("disable")) {
                e.preventDefault();
                return false;
            }
            setStatus(e.target.getAttribute("member_id"), e.target);
        }

        function setStatus(member_id, src) {
            if($(src).hasClass('disable'))
                return;

            var status = (src.checked) ? 1 : 0;
            do_post(member_id, status, "{{ url('/registration') }}");
        }

        function set_unpresent(member_id, src) {
            var status = !$(src).hasClass('disable');

            if(status && src.checked) {
                setStatus(member_id, false);
                src.checked = false;
            }

            if(status) {
                $(src).addClass("disable");
            } else {
                $(src).removeClass("disable");
            }

            do_post(member_id, status ? 1 : 0, "{{ url('/registration/unpresent') }}");
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

                    <form class="form-inline" role="form" method="POST" action="{{ url('/events/addtoday') }}">
                        <input type="hidden" name="_token" value="{{ csrf_token() }}">
                        <button type="submit" class="btn btn-primary margin-bottom-fix">
                            Ny hendelse i dag
                        </button>
                    </form>
                    <a class="btn btn-primary margin-bottom-fix" href="{{ url('/events/add') }}">Ny hendelse</a>

                    @if($chosen_event != null)
                    <a class="btn btn-primary margin-bottom-fix" href="{{ url('/events/edit/'.$chosen_event->id) }}">Rediger hendelse</a>

                    <input id="search" type="text" class="form-control" placeholder="Søk her" name="title" oninput="search(this);">

                    <div class="table-responsive">
                        <table id="member-table" class="table">
                            <thead>
                            <tr>
                                <th>Navn</th>
                                <th class="col-md-2">Tilstede</th>
                            </tr>
                            </thead>
                            <tbody>
                            @foreach($members as $member)
                                <tr>
                                    <td class="member-name">{{ $member->first_name . " " . $member->last_name}}</td>
                                    <td>
                                        <input type="checkbox" value="{{ $member->id }}"
                                                member_id="{{ $member->id }}"
                                                {{ $member->unpresent ? 'class=disable' : "" }}
                                                oncontextmenu="set_unpresent({{ $member->id }}, this); return false;"
                                                onclick="checkbox_click(event)"
                                                {{ $member->present ? 'checked' : '' }} />
                                    </td>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                    </div>
                    @else
                        <p>
                            Fant ingen hendelser! Opprett en før du kan registrere oppmøte.
                        </p>
                    @endif
                </div>
            </div>
        </div>
    </div>
@endsection