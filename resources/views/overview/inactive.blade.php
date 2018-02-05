@extends('layouts.overview')

@section('content')
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-default">
                <div class="panel-heading">Inaktive medlemmer</div>

                <div class="panel-body">
                    <div class="table-responsive">
                        <table id="member-table" class="table">
                            <thead>
                            <tr>
                                <th>Navn</th>
                                <th>Betalt semesteravgift</th>
                                <th>Siste øvelse</th>
                            </tr>
                            </thead>
                            <tbody>
                            @foreach($members as $member)
                                <tr class="member">
                                    <td class="member-name">{{ $member->first_name . " " . $member->last_name}}</td>
                                    <td>{{ $member->paid ? 'Y' : 'N' }}</td>
                                    <td>{{ ($member->last_practice) ? date("d.m.Y", strtotime($member->last_practice)) : "Aldri"}}</td>
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