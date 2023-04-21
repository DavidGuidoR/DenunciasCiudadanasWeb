<?php
include "config.php";
?>
<!DOCTYPE html>
<html lang="es" class="h-100">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
  <title>Login PDO y PHP</title>

</head>

<body class="d-flex flex-column h-100">

  <header>
    <!-- Fixed navbar -->
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" href="#">PROGWEB</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <a class="nav-link" href="#">Portada <span class="sr-only">(current)</span></a>
            </li>
          </ul>
          <form class="form-inline mt-2 mt-md-0">
            <input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Busqueda</button>
          </form>
        </div>
      </div>
    </nav>
  </header>

  <!-- Begin page content -->
  <hr>
  <br>
  <main>
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <h3>Panel de control</h3>
          <hr>
        </div>
        <div class="col-md-6">


          <?php

          // Check user login or not
          if (!isset($_SESSION['userid'])) {
            header('Location: principal.php');
          }

          // logout
          if (isset($_POST['but_logout'])) {
            session_destroy();

            // Remove cookie variables
            $days = 30;
            setcookie("rememberme", "", time() - ($days *  24 * 60 * 60 * 1000));

            header('Location: index.php');
          }
          ?>
          <form method='post' action="">
            <input class="btn btn-danger" type="submit" value="Salir" name="but_logout">
          </form>


        </div>
      </div>
      <footer>
        <hr>
        <div class="copyright"> &copy; 2007 - <?= date("Y") ?> <a href="https://localhost" target="_blank">Iscadrigs</a>. All rights reserved </div>
        <div class="footerlogo"><a href="https://localhost" target="_blank"></a> </div>
      </footer>
    </div>
  </main>
</body>

</html>