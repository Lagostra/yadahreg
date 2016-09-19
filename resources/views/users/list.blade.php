@extends('layouts.main')

@section('content')
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-default">
                <div class="panel-heading">Brukere</div>
                <div class="panel-body">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                            <tr>
                                <th>Navn</th>
                                <th>E-post</th>
                                <th>Rolle</th>
                            </tr>
                            </thead>
                            <tbody>
                            @foreach($users as $user)
                                <tr>
                                    <td>{{ $user->name }}</td>
                                    <td>{{ $user->email }}</td>
                                    <td>{{ ucfirst($user->role) }}</td>
                                    <td><a class="btn btn-primary btn-xs" href="{{ url('/users/edit/' . $user->id) }}">Rediger</a></td>
                                    <td>
                                        <form class="form-inline" role="form" method="POST"  onsubmit="return confirm('Sikker på at du vil slette brukeren?');" action="{{ url('/users/delete') }}">
                                            <input type="hidden" name="_token" value="{{ csrf_token() }}">
                                            <input type="hidden" name="id" value="{{ $user->id }}" />
                                            <button type="submit" class="btn btn-primary btn-xs">
                                                Slett bruker
                                            </button>
                                        </form>
                                    </td>
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