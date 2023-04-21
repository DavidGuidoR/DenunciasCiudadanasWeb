<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Barra de navegación</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <nav class="navbar">
        <div class="logo">
            <img src="images/Logo.png" alt="Logotipo">
        </div>
        <ul class="nav-links">
            <li><a href="#">Realizar reporte</a></li>
            <li><a href="#">Revisar reportes</a></li>
            <li><a href="#">Perfil</a></li>
            <li><a href="contact.php">Contacto</a></li>


        </ul>
        <div class="nav-buttons">
            <button class="btn">Registrarse</button>
            <button class="btn" onclick="location.href='login.html'">Iniciar sesión</button>
        </div>
    </nav>

    <div class="container">
        <section id="hero" class="seccion-text">
            <h3 class="letrero1">
                GOBIERNO DE LA CIUDAD DE MORELIA
            </h3>

            <h1 class="letrero2">
                REVISA REPORTES<br>
                CERCANOS EN TU ZONA
            </h1>

            <h1 class="letrero3">
                TE ESTAMOS ESCUCHANDO
            </h1>

            <p class="letrero4">
                Consulta y reporta problemas en tu ciudad y cercanías de tu<br>
                domicilio, juntos crearemos una mejor sociedad
            </p>

            <button class="button">
                <span class="text-button">Consultar reportes<br>cercanos</span>
                <div><img src="images/ubicacion.png" width=18px, height="25px" class="logo-button" alt="Logo-button"></div>
            </button>

            <img src="images/personas.png" class="imageninf" alt="Imagen-personas">

            <p class="letrero4">
                + de 100<br>
                reportes atendidos
            </p>
        </section>

        <section id="mapa" class="map">
            <div>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60099.34129950644!2d-101.24740939464698!3d19.703731335534236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842d0ba2b29da7e3%3A0x4016978679c8620!2sMorelia%2C%20Mich.!5e0!3m2!1ses-419!2smx!4v1682055112980!5m2!1ses-419!2smx" style="border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </section>
    </div>
</body>

</html>