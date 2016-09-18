@extends('layouts.main')

@if($chosen_event != null)
@section('head')
    <script>var event_id={{ $chosen_event->id }};</script>
@endsection
@endif

@section('content')
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Registrering</div>

                <div class="panel-body">

                    <select onchange="function(e) {
                        window.location = "{{ url('/registration') }}/" + e.value;
                    }">
                            }>
                        @foreach($events as $event)
                            <?php $date = date("d.m.Y", strtotime($event->date)); ?>
                            <option value="{{ $event->id }}">{{ $event->title == "" ? $date : $date . " - " . $event->title }}</option>
                        @endforeach
                        @if(count($events) == 0)
                            <option selected disabled>Ingen hendelser</option>
                        @endif
                    </select>

                    <form class="form-inline" role="form" method="POST" action="{{ url('/registration/today') }}">
                        <input type="hidden" name="_token" value="{{ csrf_token() }}">
                        <button type="submit" class="btn btn-primary">
                            Ny hendelse i dag
                        </button>
                    </form>
                    <a class="btn btn-primary" href="{{ url('/registration/addevent') }}">Ny hendelse</a>

                    @if($chosen_event != null)
                    <a class="btn btn-primary" href="{{ url('/registration/edit/'.$chosen_event->today) }}">Rediger hendelse</a>

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
                                        <input type="checkbox" value="{{ $member->id }}" {{ (count($member->events) > 0 && in_array($chosen_event, $member->events)) ? 'selected' : '' }} />
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