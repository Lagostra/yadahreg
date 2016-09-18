@extends('layouts.main')

@if($chosen_event != null)
@section('head')
    <script>
        function setStatus(member_id, status) {
            status = (status) ? 1 : 0;
            $.ajax({
                url: '{{ url('/registration') }}',
                type: 'POST',
                data: {
                    _token: '{{ csrf_token() }}',
                    member_id: member_id,
                    event_id: {{ $chosen_event->id }},
                    status: status,
                }
            }).fail(function(data, status) {
                window.alert("Noe gikk galt. Vennligst last siden på nytt.");
            });
        }

        function selectEvent(sel) {
            window.location = "{{ url('/registration') }}/" + sel.value;
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

                    <form class="form-inline" role="form" method="POST" action="{{ url('/registration/today') }}">
                        <input type="hidden" name="_token" value="{{ csrf_token() }}">
                        <button type="submit" class="btn btn-primary margin-bottom-fix">
                            Ny hendelse i dag
                        </button>
                    </form>
                    <a class="btn btn-primary margin-bottom-fix" href="{{ url('/registration/addevent') }}">Ny hendelse</a>

                    @if($chosen_event != null)
                    <a class="btn btn-primary margin-bottom-fix" href="{{ url('/registration/editevent/'.$chosen_event->id) }}">Rediger hendelse</a>
                    <form class="form-inline" role="form" method="POST"  onsubmit="return confirm('Sikker på at du vil slette hendelsen?');" action="{{ url('/registration/delete') }}">
                        <input type="hidden" name="_token" value="{{ csrf_token() }}">
                        <input type="hidden" name="id" value="{{ $chosen_event->id }}" />
                        <button type="submit" class="btn btn-primary margin-bottom-fix">
                            Slett hendelse
                        </button>
                    </form>

                    @endif

                    @if($chosen_event != null)
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                            <tr>
                                <th>Navn</th>
                                <th>Tilstede</th>
                            </tr>
                            </thead>
                            <tbody>
                            @foreach($members as $member)
                                <tr>
                                    <th class="member-name">{{ $member->first_name . " " . $member->last_name}}</th>
                                    <th>
                                        <input type="checkbox" value="{{ $member->id }}" {{ $member->present ? 'checked' : '' }}
                                                onclick="setStatus({{ $member->id }}, this.checked);"/>
                                    </th>
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