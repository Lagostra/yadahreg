<!DOCTYPE HTML>
<html lang="en">
    <head>
        <meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>

        <!-- CSRF Token -->
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <meta name="description" content="">
        <meta name="author" content="">
        <link rel="icon" href="../../favicon.ico">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <link rel="stylesheet" href="{{ url('/plugins/bootstrap/css/bootstrap.min.css') }}" />
        <link rel="stylesheet" href="{{url('/css/styles.css')}}" />

        <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
            <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->

        <!-- Scripts -->
        <script>
            window.Laravel = <?php echo json_encode([
                    'csrfToken' => csrf_token(),
            ]); ?>
        </script>

        @yield('head')
    </head>

    <body>
        <nav class="navbar navbar-inverse">
            <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>

                    <a class="navbar-brand" href="{{ url("/home") }}">
                        {{ config('app.name', 'Laravel') }}
                    </a>
                </div>

                <div id="navbar" class="collapse navbar-collapse">
                    <ul class="nav navbar-nav navbar-left">
                        @if(Auth::check())
                            <li><a href="{{ url('/home') }}">Hjem</a></li>
                            @if(Auth::user()->role == 'user' || Auth::user()->role == 'admin')
                                <li><a href="{{ url('/registration') }}">Registrering</a></li>
                                <li><a href="{{ url('/members/1') }}">Medlemmer</a></li>
                                <li><a href="#">Betaling</a></li>
                            @endif
                        @endif
                    </ul>

                    @if(Auth::check())
                    <ul class="nav navbar-nav navbar-right">
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                                {{ Auth::user()->name }} <span class="caret"></span></a>
                            <ul class="dropdown-menu">
                                <li><a href="{{ url('/profile/edit') }}">Rediger profil</a></li>
                                <li><a href="{{ url('/profile/edit/password') }}">{{ Auth::user()->password == null ? 'Opprett passord' : 'Endre passord' }}</a></li>
                                @if(Auth::user()->role == 'admin')
                                <li><a href="{{ url('/users') }}">Administrer brukere</a></li>
                                @endif
                                <li>
                                    <a href="{{ url('/logout') }}"
                                       onclick="event.preventDefault();
                                                 document.getElementById('logout-form').submit();">
                                        Logg ut
                                    </a>

                                    <form id="logout-form" action="{{ url('/logout') }}" method="POST" style="display: none;">
                                        {{ csrf_field() }}
                                    </form>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    @endif
                </div><!--/.nav-collapse -->
            </div>
        </nav>

        <div class="container">

            @yield('content')

        </div><!-- /.container -->


        <!-- Bootstrap core JavaScript
        ================================================== -->
        <!-- Placed at the end of the document so the pages load faster -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="../../assets/js/vendor/jquery.min.js"><\/script>')</script>
        <script src="{{ url('/plugins/bootstrap/js/bootstrap.min.js') }}"></script>
        @yield('foot')
    </body>
</html>