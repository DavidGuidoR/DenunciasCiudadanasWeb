// Aqui podemos exportar un objeto

const { json } = require("body-parser");
const { route } = require("../routes/customer");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const SftpClient = require('ssh2-sftp-client');

const controller = {};


// Pantallas y vistas de la aplicacion-------------------------------------------------------------------------------------------------------------------
controller.render = (req, res) => {
    const actividad = 'Acceso al menu principal';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    res.render('menuPrincipal');
}

controller.pantallaRegistro = (req, res) => {
    const actividad = 'Acceso al registro';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    res.render('Registro');
}

controller.pantallaSesion = (req, res) => {
    const actividad = 'Acceso al inicio de sesion';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    res.render('inicioSesion');
}

controller.pantallaSesionModerador = (req, res) => {
    const actividad = 'Acceso al inicio de sesion moderador';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    res.render('iniciosesionmoderador');
}

controller.pantallaSesionAdministrador = (req, res) => {
    const actividad = 'Acceso al inicio de sesion administrador';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    res.render('iniciosesionadministrador');
}

controller.pantallaSesionEncargado = (req, res) => {
    const actividad = 'Acceso al inicio de sesion encargado';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    res.render('iniciosesionencargado');
}

controller.pantallaSesionCiudadano = (req, res) => {
    const actividad = 'Acceso al inicio de sesion ciudadano';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    res.render('iniciosesionciudadano');
}

controller.pantallaMenuPrincipal = (req, res) => {
    const actividad = 'Acceso al menu principal';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    res.render('menuPrincipal');
}

controller.pantallaModeracion = (req, res) => {
    const actividad = 'Acceso a Moderacion';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    res.render('moderacion');
}

controller.pantallaAdministracion = (req, res) => {
    const actividad = 'Acceso a administración';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    res.render('administracion');
}

controller.plantillaAdministracion = (req, res) => {
    res.render('plantillaadministracion');
}

controller.plantillaModeracion = (req, res) => {
    res.render('plantillamoderacion');
}

controller.plantillaEncargado = (req, res) => {
    res.render('plantillaencargado');
}

controller.plantillaInicioSesion = (req, res) => {
    res.render('plantillainiciosesion');
}

controller.pruebapantsubirimagen = (req,res) => {
    res.render('pruebasubidaimagen');
}


//registro de usuarios
controller.registro = (req, res) => {
    const actividad = 'Acceso al registro de usuario';
    fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    const ciudadano = req.body; // Assuming the JSON object contains all the required fields
    console.log(ciudadano);
  
    const queryCheckPhone = 'SELECT * FROM ciudadano WHERE telefono = ?';
    req.getConnection((err, conn) => {
      if (err) {
        console.error('Error al establecer la conexión: ', err);
        res.status(500).json({ error: 'Error al registrar el post' });
        return;
      }
  
      conn.query(queryCheckPhone, ciudadano.telefono, (err, results) => {
        if (err) {
          console.error('Error al consultar la base de datos: ', err);
          res.status(500).json({ error: 'Error al registrar el post' });
          return;
        }
  
        if (results.length > 0) {
          console.log('Teléfono duplicado');
          res.send('Teléfono repetido');
        } else {
          const queryInsert = 'INSERT INTO ciudadano SET ?';
          conn.query(queryInsert, ciudadano, (err, data) => {
            if (err) {
              console.error('Error al insertar el post en la base de datos: ', err);
              res.status(500).json({ error: 'Error al registrar el post' });
            } else {
              console.log('Post registrado correctamente');
              res.render('menuPrincipal');
            }
          });
        }
      });
    });
  };
  

// Inicio de sesion dinamico-------------------------------------------------------------------------------------------------------------
controller.inicioSesion = (req, res) => {
    const actividad = 'Comprobacion inicio de sesion';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    // Obtenemos el usuario y la contraseña del cuerpo de la solicitud
    const tabla = req.params.tabla;
    var telefono='';
    var usuario ='';
     if(tabla=='ciudadano'){
        telefono = req.body['telefono'];
        console.log(telefono);
     } else{
        usuario = req.body['usuario'];
     }
    const rol= req.params.rol;
    const contrasena = req.body['contrasena'];
    var consulta = '';
    if (tabla == "empleado") {
        consulta = 'SELECT usuario, contrasena, cargo, id_empleado FROM empleado WHERE usuario=?';
    } else if(tabla=="encargado_dependencia"){
        consulta = 'SELECT ed.usuario, ed.contrasena, d.id_dependencia, d.nombre, ed.id_encargado FROM encargado_dependencia ed JOIN dependencia d ON ed.id_dependencia = d.id_dependencia WHERE ed.usuario = ?';
    } else { 
        consulta ='SELECT * FROM ciudadano WHERE telefono=?';
        
    }
    // Establecemos la conexión con la base de datos
    req.getConnection((err, conn) => {
        // Consultamos la base de datos y obtenemos los datos del empleado
        if (tabla == "empleado") {
            conn.query(consulta, usuario, (err, empleado) => {
                // Verificamos si se produjo un error en la consulta
                if (err) {
                    res.send('Error en la consulta');
                    console.log(err);
                } else {
                    // Verificamos si se encontró un empleado con el usuario proporcionado
                    if (empleado.length > 0) {
                        // Extraemos los datos de la consulta
                        console.log(empleado);
                        const usuarioConsulta = empleado[0].usuario;
                        const contrasenaConsulta = empleado[0].contrasena;
                        const cargo = empleado[0].cargo;
                        const id_empleado = empleado[0].id_empleado;
                        // Comparamos el usuario y la contraseña con los datos de la consulta
                        if (usuario === usuarioConsulta && contrasena === contrasenaConsulta) {
                            // Redirigimos a la página correspondiente según el cargo
                            req.session.usuario = usuario;
                            req.session.cargo = cargo;
                            req.session.id_empleado = id_empleado;

                            if (cargo === "moderador") {
                                res.render('moderacion');
                            } else if (cargo === "administrador") {
                                res.render('administracion');
                            } else {
                                res.send('Cargo no reconocido');
                            }
                        } else {
                            const mensajeError = 'Inicio de sesión fallido. Por favor, verifique sus credenciales.';
                            const script = `
                            <script>
                                alert('${mensajeError}');
                                window.location.href = "/pantallaSesion${rol}"; // Redirigir a la página de inicio de sesión
                            </script>
                                `;
                            res.send(script);
                        }
                    } else {
                        const mensajeError = 'No se encuentra una cuenta relacionada con el usuario. Por favor, verifique sus credenciales.';
                        const script = `
                        <script>
                          alert('${mensajeError}');
                          window.location.href = "/pantallaSesion${rol}"; // Redirigir a la página de inicio de sesión
                        </script>
                      `;
                        res.send(script);

                    }
                }
            });
        }
        else if (tabla =='encargado_dependencia'){
            conn.query(consulta, usuario, (err, empleado) => {
                // Verificamos si se produjo un error en la consulta
                if (err) {
                    res.send('Error en la consulta');
                    console.log(err);
                } else {
                    // Verificamos si se encontró un empleado con el usuario proporcionado
                    if (empleado.length > 0) {
                        // Extraemos los datos de la consulta
                        const usuarioConsulta = empleado[0].usuario;
                        const contrasenaConsulta = empleado[0].contrasena;
                        const idDependenciaConsulta = empleado[0].id_dependencia;
                        const nombreDependenciaConsulta = empleado[0].nombre;
                        const id_encargado = empleado[0].id_encargado;
                        // Comparamos el usuario y la contraseña con los datos de la consulta
                        if (usuario === usuarioConsulta && contrasena === contrasenaConsulta) {
                            // Redirigimos a la página correspondiente según el cargo
                            req.session.usuario = usuario;
                            req.session.cargo = 'encargado';
                            req.session.dependencia = idDependenciaConsulta;
                            req.session.nombreDependencia = nombreDependenciaConsulta;
                            req.session.id_encargado = id_encargado;
                            res.render('encargado');

                        } else {
                            const mensajeError = 'Inicio de sesión fallido. Por favor, verifique sus credenciales.';
                            const script = `
                            <script>
                                alert('${mensajeError}');
                                window.location.href = "/pantallaSesion${rol}"; // Redirigir a la página de inicio de sesión
                            </script>
                                `;
                            res.send(script);
                        }
                    } else {
                        const mensajeError = 'No se encuentra una cuenta relacionada con el usuario. Por favor, verifique sus credenciales.';
                        const script = `
                        <script>
                          alert('${mensajeError}');
                          window.location.href = "/pantallaSesion${rol}"; // Redirigir a la página de inicio de sesión
                        </script>
                      `;
                        res.send(script);
                    }
                }
            });
        }
            else{
            conn.query(consulta, telefono, (err, ciudadano) => {
                // Verificamos si se produjo un error en la consulta
                if (err) {
                    res.send('Error en la consulta');
                    console.log(err);
                } else {
                    // Verificamos si se encontró un empleado con el usuario proporcionado
                    if (ciudadano.length > 0) {
                        // Extraemos los datos de la consulta
                        const telefonoConsulta = ciudadano[0].telefono;
                        const contrasenaConsulta = ciudadano[0].contrasena;
                        const correo = ciudadano[0].correo;
                        const id_ciudadano = ciudadano[0].id_ciudadano;
                        // Comparamos el usuario y la contraseña con los datos de la consulta
                        if (telefono == telefonoConsulta && contrasena == contrasenaConsulta) {
                            // Redirigimos a la página correspondiente según el cargo
                            req.session.telefono = telefono;
                            req.session.correo = correo;
                            req.session.id_ciudadano = id_ciudadano;
                            res.render('ciudadano');

                        } else {
                            const mensajeError = 'Inicio de sesión fallido. Por favor, verifique sus credenciales.';
                            const script = `
                            <script>
                                alert('${mensajeError}');
                                window.location.href = "/pantallaSesion${rol}"; // Redirigir a la página de inicio de sesión
                            </script>
                                `;
                            res.send(script);
                        }
                    } else {
                        const mensajeError = 'No se encuentra una cuenta relacionada con el telefono. Por favor, verifique sus credenciales.';
                        const script = `
                        <script>
                          alert('${mensajeError}');
                          window.location.href = "/pantallaSesion${rol}"; // Redirigir a la página de inicio de sesión
                        </script>
                      `;
                        res.send(script);
                    }
                }
            });
            }
    });
};

//Funciones de la administracion-------------------------------------------------

controller.pantallaPerfilAdministrador = (req,res) => {
    const actividad = 'Acceso al perfil del administrador';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    const id_empleado=req.params.id_empleado;
    const consulta = 'SELECT * FROM empleado WHERE id_empleado = ?';
    req.getConnection((err,conn) =>{
        conn.query(consulta,[id_empleado],(err,data) =>{
            if(err){
                res.json(err);
            } else {
                res.render('administracionperfil', {data:data})
            }
        })
    });
}

controller.administracionEncargado_dependencias = (req, res) => {
    const actividad = 'El administrador acceso a encargados de las dependencias';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    req.getConnection((err, conn) => {
        conn.query('SELECT r.id_encargado, r.nombre, r.apellido_paterno, r.apellido_materno, c.nombre AS nombre_dependencia, r.usuario, r.contrasena FROM encargado_dependencia r JOIN dependencia c ON r.id_dependencia = c.id_dependencia', (err, encargados) => {
            if (err) {
                res.json(err);
            } else {
                console.log(encargados)
                res.render('administracionencargado_dependencias', { data: encargados });
            }
        })
    });
}

controller.administracionEmpleados = (req, res) => {
    const actividad = 'El administrador acceso a la seccion empleados';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM empleado', (err, empleados) => {
            if (err) {
                res.json(err);
            } else {
                res.render('administracionmoderadores', { data: empleados });
            }
        })
    });
}

controller.administracionDependencias = (req, res) => {
    const actividad = 'El administrador acceeso a la seccion dependencias';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM dependencia', (err, dependencias) => {
            if (err) {
                res.json(err);
            } else {
                res.render('administraciondependencias', { data: dependencias });
            }
        })
    });
}

controller.administracionCiudadanos = (req, res) => {
    const actividad = 'El administrador accedio a la seccion ciudadanos';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM ciudadano', (err, usuarios) => {
            if (err) {
                res.json(err);
            } else {
                res.render('administracionusuarios', { data: usuarios });
            }
        })
    });
}

controller.administracionReportes = (req, res) => {
    const actividad = 'El administrador acceso a la pantalla de los reportes';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    function formatDate(date) {
        const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
        const formattedDate = new Date(date).toLocaleDateString('es-ES', options);
        return formattedDate;
    }
    req.getConnection((err, conn) => {
        conn.query('SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, c.id_ciudadano AS nombre_ciudadano, d.nombre AS nombre_dependencia, r.tipo_reporte FROM reporte r JOIN ciudadano c ON r.id_ciudadano = c.id_ciudadano JOIN dependencia d ON r.id_dependencia = d.id_dependencia', (err, reportes) => {
            if (err) {
                res.json(err);
            } else {
                res.render('administracionreportes', { data: reportes, formatDate: formatDate });
            }
        })
    });
}


//Funciones del CRUD ------------------------------------------------------------------------------------------- 
controller.insert = (req, res) => {
    const actividad = 'El administrador inserto un rgistro';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    const data = req.body;
    const tabla = req.params.tabla;
    console.log(tabla);
    const tablaCapitalizada = tabla.charAt(0).toUpperCase() + tabla.slice(1) + 's';
    const ruta = '/administracion' + tablaCapitalizada;
    const consulta = 'INSERT INTO ' + tabla + ' set ?';

    req.getConnection((err, conn) => {
        conn.query(consulta, [data], (err, data) => {
            if (err) {
                res.send('Registro fallido')
            } else {
                res.redirect(ruta);
            }
        });
    });
}

controller.delete = (req, res) => {
    const actividad = 'El administrador borro un registro';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    const id = req.params.id;
    const tabla = req.params.tabla;
    if (tabla == 'encargado_dependencia') {
        puntero = 'id_encargado'
    } else { puntero = 'id_' + tabla; }
    const tablaCapitalizada = tabla.charAt(0).toUpperCase() + tabla.slice(1) + 's';
    const ruta = '/administracion' + tablaCapitalizada;
    const consulta = 'DELETE FROM ' + tabla + ' WHERE ' + puntero + ' = ?';

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al obtener la conexión:', err);
            return;
        }

        conn.query(consulta, [id], (err, data) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                return;
            } else {
                res.redirect(ruta);
            }
        });
    });
}

controller.pantallaEdit = (req, res) => {
    const actividad = 'El administrador entro a editar un registro';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    const tabla = req.params.tabla;
    var puntero = '';
    const id = req.params.id;
    if (tabla == 'encargado_dependencia') {
        puntero = 'id_encargado'
    } else { puntero = 'id_' + tabla; }

    const tablaCapitalizada = tabla.charAt(0).toUpperCase() + tabla.slice(1) + 's';
    const ruta = '/administracion' + tablaCapitalizada;
    const consulta = 'SELECT * FROM ' + tabla + ' WHERE ' + puntero + ' = ?';


    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al obtener la conexión:', err);
            return;
        }
        conn.query(consulta, [id], (err, data) => {

            let inputsHTML = '';
            switch (tabla) {

                case 'dependencia':
                    inputsHTML += '<div class="cajastexto"><input type="text" name="id_dependencia" value="' + data[0].id_dependencia + '" readonly></div>';
                    inputsHTML += '<div class="cajastexto"><input type="text" name="nombre" value="' + data[0].nombre + '"></div>';
                    inputsHTML += '<div class="cajastexto"><input type="text" name="colonia" value="' + data[0].colonia + '"></div>';
                    inputsHTML += '<div class="cajastexto"><input type="text" name="calle" value="' + data[0].calle + '"></div>';
                    // Otros campos para empleados
                    break;

                case 'ciudadano':
                    inputsHTML += '<div class="cajastexto"><input type="text" name="id_ciudadano" value="' + data[0].id_ciudadano + '" readonly></div>';
                    inputsHTML += '<div class="cajastexto"><input type="text" name="nombre" value="' + data[0].nombre + '"></div>';
                    inputsHTML += '<div class="cajastexto"><input type="text" name="apellido_paterno" value="' + data[0].apellido_paterno + '"></div>';
                    inputsHTML += '<div class="cajastexto"><input type="text" name="apellido_materno" value="' + data[0].apellido_materno + '"></div>';
                    inputsHTML += '<div class="cajastexto"><input type="text" name="correo" value="' + data[0].correo + '"></div>';
                    inputsHTML += '<div class="cajastexto"><input type="text" name="contrasena" value="' + data[0].contrasena + '"></div>';
                    inputsHTML += '<div class="cajastexto"><input type="text" name="telefono" value="' + data[0].telefono + '"></div>';
                    inputsHTML += '<div class="cajastexto"><input type="text" name="estado" value="' + data[0].estado + '"></div>';
                    inputsHTML += '<div class="cajastexto"><input type="text" name="ciudad" value="' + data[0].ciudad + '"></div>';
                    inputsHTML += '<div class="cajastexto"><input type="text" name="n_penalizaciones" value="' + data[0].n_penalizaciones + '"></div>';
                    // Otros campos para usuarios
                    break;

                case 'encargado_dependencia':
                    inputsHTML += '<div class="cajastexto"><input type="text" name="id_encargado" value="' + data[0].id_encargado + '"readonly></div>';
                    inputsHTML += '<div class="cajastexto"><input type="text" name="nombre" value="' + data[0].nombre + '"></div>';
                    inputsHTML += '<div class="cajastexto"><input type="text" name="apellido_paterno" value="' + data[0].apellido_paterno + '"></div>';
                    inputsHTML += '<div class="cajastexto"><input type="text" name="apellido_materno" value="' + data[0].apellido_materno + '"></div>';
                    inputsHTML += '<div class="cajastexto"><input type="text" name="id_dependencia" value="' + data[0].id_dependencia + '" readonly></div>';
                    inputsHTML += '<div class="cajastexto"><input type="text" name="usuario" value="' + data[0].usuario + '"></div>';
                    inputsHTML += '<div class="cajastexto"><input type="text" name="contrasena" value="' + data[0].contrasena + '"></div>';
                    break;
                // Otros casos para diferentes tipos de registros
                case 'empleado':
                    inputsHTML += '<div class="cajastexto"><input type="text" name="id_empleado" value="' + data[0].id_empleado + '" readonly></div>';
                    inputsHTML += '<div class="cajastexto"><input type="text" name="cargo" value="' + data[0].cargo + '" readonly></div>';
                    inputsHTML += '<div class="cajastexto"><input type="text" name="nombre" value="' + data[0].nombre + '"></div>';
                    inputsHTML += '<div class="cajastexto"><input type="text" name="apellido_paterno" value="' + data[0].apellido_paterno + '"></div>';
                    inputsHTML += '<div class="cajastexto"><input type="text" name="apellido_materno" value="' + data[0].apellido_materno + '"></div>';
                    inputsHTML += '<div class="cajastexto"><input type="text" name="usuario" value="' + data[0].usuario + '"></div>';
                    inputsHTML += '<div class="cajastexto"><input type="text" name="contrasena" value="' + data[0].contrasena + '"></div>';
                    break;

                default:
                    break;
            }

            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                return;
            } else {
                res.render('administracionedit', { data: data, inputsHTML, tabla });
            }
        });

    });
}

controller.edit = (req, res) => {
    const actividad = 'El administrador intenta editar un registro';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    const tabla = req.params.tabla;
    const datos = req.body;
    var puntero = '';
    if (tabla == 'encargado_dependencia') {
        puntero = 'id_encargado'
    } else { puntero = 'id_' + tabla; }
    var id = '';
    switch (tabla) {

        case 'dependencia': id = req.body.id_dependencia;
            break;

        case 'empleado': id = req.body.id_empleado;
            break;
        case 'ciudadano': id = req.body.id_ciudadano;
            break;
        case 'encargado_dependencia': id = req.body.id_encargado;
            break;
        default: console.log('error en el ID');
            break;
    }

    const tablaCapitalizada = tabla.charAt(0).toUpperCase() + tabla.slice(1) + 's';
    const ruta = '/administracion' + tablaCapitalizada;
    const consulta = 'UPDATE ' + tabla + ' set ? WHERE ' + puntero + '= ?'
    req.getConnection((err, conn) => {
        conn.query(consulta, [datos, id], (err, data) => {
            if (err) {
                res.send('error en la actualización');
                console.log(err);
            } else {
                res.redirect(ruta);
            }

        })
    })
}


// Funciones del moderador--------------------------------------------------------------------------------------------------------------------
controller.menumoderacion = (req, res) => {
    const actividad = 'Acceso al panel de moderador';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    res.render('moderacion');
}

controller.pantallaPerfilModerador = (req,res) => {
    const actividad = 'El moderador accedio al perfil';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    const id_empleado=req.params.id_empleado;
    const consulta = 'SELECT * FROM empleado WHERE id_empleado = ?';
    req.getConnection((err,conn) =>{
        conn.query(consulta,[id_empleado],(err,data) =>{
            if(err){
                res.json(err);
            } else {
                res.render('moderacionperfil', {data:data})
            }
        })
    });
}

controller.pantallaReportesRevisados = (req, res) => {
    const actividad = 'El moderador accedio a la pantalla reportes revisados';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    function formatDate(date) {
        const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
        const formattedDate = new Date(date).toLocaleDateString('es-ES', options);
        return formattedDate;
    }
    req.getConnection((err, conn) => {
        conn.query('SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, c.id_ciudadano AS nombre_ciudadano, d.nombre AS nombre_dependencia, r.tipo_reporte FROM reporte r JOIN ciudadano c ON r.id_ciudadano = c.id_ciudadano JOIN dependencia d ON r.id_dependencia = d.id_dependencia', (err, reportes) => {
            if (err) {
                res.json(err);
            } else {
                res.render('moderacionreportesrevisados', { data: reportes, formatDate: formatDate });
            }
        })
    });
}

controller.pantallaReportesEntrantes = (req, res) => {
    const actividad = 'El moderador accedio a la pantalla de reportes entrantes';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    function formatDate(date) {
        const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
        const formattedDate = new Date(date).toLocaleDateString('es-ES', options);
        return formattedDate;
    }
    req.getConnection((err, conn) => {
        conn.query('SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, c.id_ciudadano AS nombre_ciudadano, d.nombre AS nombre_dependencia, r.tipo_reporte FROM reporte r JOIN ciudadano c ON r.id_ciudadano = c.id_ciudadano JOIN dependencia d ON r.id_dependencia = d.id_dependencia', (err, reportes) => {
            if (err) {
                res.json(err);
            } else {
                res.render('moderacionreportesentrantes', { data: reportes, formatDate: formatDate });
            }
        })
    });
}

controller.pantallaVisualizarReporte = (req, res) => {
    const actividad = 'El moderador visualiza un reporte';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    const { id_reporte } = req.params;
    function formatDate(date) {
        const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
        const formattedDate = new Date(date).toLocaleDateString('es-ES', options);
        return formattedDate;
    }
    req.getConnection((err, conn) => {

        conn.query('SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, c.id_ciudadano AS nombre_ciudadano, d.nombre AS nombre_dependencia, r.tipo_reporte FROM reporte r JOIN ciudadano c ON r.id_ciudadano = c.id_ciudadano JOIN dependencia d ON r.id_dependencia = d.id_dependencia WHERE r.id_reporte = ?', [id_reporte], (err, reportes) => {
            if (err) {
                res.json(err);
            } else {
                console.log('Separacion en console log-------------------------------------------------------------------------');
                console.log(reportes);
                res.render('moderacionvisualizarreporte', { data: reportes, formatDate: formatDate });
            }
        })
    });

}


controller.cambiarestatus = (req, res) => {
    const actividad = 'El moderador cambio el estatus de un reporte';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    const { id_reporte } = req.params;
    const newCustumer = req.body['estatuscb'];
    req.getConnection((err, conn) => {
        conn.query('UPDATE reporte set estatus = ? WHERE id_reporte = ?', [newCustumer, id_reporte], (err, reportes) => {
            if (err) {
                res.json(err);
            } else {
                res.redirect('/menumoderacion');
            }
        })
    });
}

controller.penalizarreporte = (req, res) => {
    const actividad = 'El moderador penalizo un reporte';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    const { id_reporte } = req.params;
    const usermod = req.body['usermod'];

    const newCustumer = 'penalizado';
    const userrep = req.body['userrep'];

    const motivo = req.body['motivo'];
    req.getConnection((err, conn) => {
        conn.query('UPDATE reporte set estatus = ? WHERE id_reporte = ?', [newCustumer, id_reporte], (err, reportes) => {
            if (err) {
                res.json(err);
            } else {
                conn.query('INSERT INTO baja_reporte (id_reporte, id_empleado, motivo) VALUES ( ?,?,?)', [id_reporte, usermod, motivo], (err, baja_report) => {
                    if (err) {
                        res.json(err);
                    } else {
                        conn.query('UPDATE ciudadano set n_penalizaciones = 1 WHERE id_ciudadano = ?', [userrep], (err, ban) => {
                            if (err) {
                                res.json(err);
                            } else {
                                res.redirect('/menumoderacion');
                            }
                        });
                    }
                });
            }
        });
    });
}

controller.penalizar = (req, res) => {
    const actividad = 'Se penalizo un reporte';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    const { id_reporte } = req.params;
    function formatDate(date) {
        const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
        const formattedDate = new Date(date).toLocaleDateString('es-ES', options);
        return formattedDate;

    }
    req.getConnection((err, conn) => {

        conn.query('SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, c.id_ciudadano AS nombre_ciudadano, d.nombre AS nombre_dependencia, r.tipo_reporte FROM reporte r JOIN ciudadano c ON r.id_ciudadano = c.id_ciudadano JOIN dependencia d ON r.id_dependencia = d.id_dependencia WHERE r.id_reporte = ?', [id_reporte], (err, reportes) => {
            if (err) {
                res.json(err);
            } else {
                console.log('Separacion en console log-------------------------------------------------------------------------');
                console.log(reportes);
                res.render('penalizar', { data: reportes, formatDate: formatDate });
            }
        })
    });

}

controller.eliminar = (req, res) => {
    const actividad = 'El moderador accede a la pantalla eliminar reporte';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    const { id_reporte } = req.params;
    function formatDate(date) {
        const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
        const formattedDate = new Date(date).toLocaleDateString('es-ES', options);
        return formattedDate;

    }
    req.getConnection((err, conn) => {

        conn.query('SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, c.id_ciudadano AS nombre_ciudadano, d.nombre AS nombre_dependencia, r.tipo_reporte, r.id_dependencia FROM reporte r JOIN ciudadano c ON r.id_ciudadano = c.id_ciudadano JOIN dependencia d ON r.id_dependencia = d.id_dependencia WHERE r.id_reporte = ?', [id_reporte], (err, reportes) => {
            if (err) {
                res.json(err);
            } else {
                console.log('Separacion en console log-------------------------------------------------------------------------');
                console.log(reportes);
                res.render('eliminar', { data: reportes, formatDate: formatDate });
            }
        })
    });

}

controller.eliminarreporte = (req, res) => {
    const actividad = 'El moderador elimino un reporte';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    const { id_reporte } = req.params;
    const usermod = req.body['usermod'];
    const userrep = req.body['userrep'];
    const dependencia = req.body['dependencia']
    const motivo = req.body['motivo'];
    const estado ='eliminado';
    console.log(dependencia);
    var tabla = '';
    var id = '';
    var query = '';
    switch (dependencia) {
        case '1': tabla = 'reporte_ooapas';
            treporte = 'Reporte Ooapas';
            query = 'DELETE FROM reporte_ooapas WHERE id_reporte=' + id_reporte + '';
            break;
        case '2': tabla = 'reporte_m_animal';
            treporte = 'Maltrato animal';
            query = 'DELETE FROM reporte_m_animal WHERE id_reporte=' + id_reporte + '';
            break;
        case '3': tabla = 'reporte_vial';
            treporte = 'Problema en carretera';
            query = 'DELETE FROM reporte_vial WHERE id_reporte=' + id_reporte + '';
            break;
        case '4': tabla = 'reporte_alumbrado_publico'
            treporte = 'Falla en alumbrado';
            query = 'DELETE FROM reporte_alumbrado_publico WHERE id_reporte=' + id_reporte + '';
            break;
        case '5': tabla = 'reporte_bacheo'
            treporte = 'Bache'
            query = 'DELETE FROM reporte_bacheo WHERE id_reporte=' + id_reporte + '';
            break;
        default: console.log('error en dependencia');
            break;
    }
    console.log(query);
    req.getConnection((err, conn) => {
        conn.query(query, (err, empleados) => {
            if (err) {
                res.json(err);
            } else {
                conn.query('UPDATE reporte set estatus = ?  WHERE id_reporte = ?', [estado,id_reporte], (err, reportes) => {
                    if (err) {
                        res.json(err);
                    } else {
                        conn.query('UPDATE ciudadano set n_penalizaciones = 1 WHERE id_ciudadano = ?', [userrep], (err, ban) => {
                            if (err) {
                                res.json(err);
                            } else {
                                res.redirect('/menumoderacion');
                            }
                        });
                    }
                });
            }
        });
    });
}



// Funciones del encargado de dependencia-----------------------------------------------------------------------------------------------------------------
controller.pantallaEncargado = (req, res) => {
    const actividad = 'Se accedio al panel de encargado';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    res.render('encargado');
}

controller.pantallaPerfilEncargado = (req,res) => {
    const actividad = 'El encargado accedio al perfil';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    const id_encargado=req.params.id_encargado;
    const consulta = 'SELECT * FROM encargado_dependencia WHERE id_encargado = ?';
    req.getConnection((err,conn) =>{
        conn.query(consulta,[id_encargado],(err,data) =>{
            if(err){
                res.json(err);
            } else {
                res.render('encargadoperfil', {data:data})
            }
        })
    });
}

controller.pantallaReportesEntrantesEncargado = (req, res) => {
    const actividad = 'El encargado entro a la pantalla de reportes entrantes';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    const dependencia = req.query.dependencia;
    var tabla = '';
    var id = '';
    var query = '';
    switch (dependencia) {
        case '1': tabla = 'reporte_ooapas';
            treporte = 'Reporte Ooapas';
            query = 'SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, r.id_ciudadano, r.tipo_reporte, r.id_dependencia, oo.cve_predio, oo.colonia, oo.calle FROM reporte_ooapas oo JOIN reporte r ON oo.id_reporte = r.id_reporte';
            break;
        case '2': tabla = 'reporte_m_animal';
            treporte = 'Maltrato animal';
            query = 'SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, r.id_ciudadano, r.tipo_reporte, r.id_dependencia, ma.tipo_mascota, ma.colonia, ma.calle FROM reporte_m_animal ma JOIN reporte r ON ma.id_reporte = r.id_reporte';
            break;
        case '3': tabla = 'reporte_vial';
            treporte = 'Problema en carretera';
            query = 'SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, r.id_ciudadano, r.tipo_reporte, r.id_dependencia, v.imagen, v.colonia, v.calle FROM reporte_vial v JOIN reporte r ON v.id_reporte = r.id_reporte';
            break;
        case '4': tabla = 'reporte_alumbrado_publico'
            treporte = 'Falla en alumbrado';
            query = 'SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, r.id_ciudadano, r.tipo_reporte, r.id_dependencia, ap.colonia, ap.calle FROM reporte_alumbrado_publico ap JOIN reporte r ON ap.id_reporte = r.id_reporte';
            break;
        case '5': tabla = 'reporte_bacheo'
            treporte = 'Bache'
            query = 'SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, r.id_ciudadano, r.tipo_reporte, r.id_dependencia, b.colonia, b.calle, b.imagen FROM reporte_bacheo b JOIN reporte r ON b.id_reporte = r.id_reporte';
            break;
        default: console.log('error en dependencia');
            break;
    }
    console.log(query);
    const consulta = 'SELECT tr.'
    function formatDate(date) {
        const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
        const formattedDate = new Date(date).toLocaleDateString('es-ES', options);
        return formattedDate;
        var tipo = '';
    }
    req.getConnection((err, conn) => {
        conn.query(query, (err, reportes) => {
            if (err) {
                res.json(err);
            } else {
                console.log(reportes);
                res.render('encargadoreportesentrantes', { data: reportes, formatDate: formatDate, treporte, tabla });
            }
        })
    });
}


    controller.pantallaReportesRevisadosEncargado = (req, res) => {
        const actividad = 'El encargado entro a la pantalla de reportes revisados';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
        const dependencia = req.query.dependencia;
        console.log(dependencia);
        var tabla = '';
        var treporte = '';
        var query = '';
        var arregloVacio = [''];
        switch (dependencia) {
          case '1':
            tabla = 'reporte_ooapas';
            treporte = 'Reporte Ooapas';
            query =
              'SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, r.id_ciudadano, r.tipo_reporte, r.id_dependencia, oo.cve_predio, oo.colonia, oo.calle, rs.evidencias FROM reporte_ooapas oo JOIN reporte r ON oo.id_reporte = r.id_reporte JOIN reporte_solucionado rs ON r.id_reporte = rs.id_reporte WHERE r.estatus = ?';
            break;
          case '2':
            tabla = 'reporte_m_animal';
            treporte = 'Maltrato animal';
            query =
              'SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, r.id_ciudadano, r.tipo_reporte, r.id_dependencia, ma.tipo_mascota, ma.colonia, ma.calle, rs.evidencias FROM reporte_m_animal ma JOIN reporte r ON ma.id_reporte = r.id_reporte JOIN reporte_solucionado rs ON r.id_reporte = rs.id_reporte WHERE r.estatus = ?';
            break;
          case '3':
            tabla = 'reporte_vial';
            treporte = 'Problema en carretera';
            query =
              'SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, r.id_ciudadano, r.tipo_reporte, r.id_dependencia, v.imagen, v.colonia, v.calle, rs.evidencias FROM reporte_vial v JOIN reporte r ON v.id_reporte = r.id_reporte JOIN reporte_solucionado rs ON r.id_reporte = rs.id_reporte WHERE r.estatus = ?';
            break;
          case '4':
            tabla = 'reporte_alumbrado_publico';
            treporte = 'Falla en alumbrado';
            query =
              'SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, r.id_ciudadano, r.tipo_reporte, r.id_dependencia, ap.colonia, ap.calle, rs.evidencias FROM reporte_alumbrado_publico ap JOIN reporte r ON ap.id_reporte = r.id_reporte JOIN reporte_solucionado rs ON r.id_reporte = rs.id_reporte WHERE r.estatus = ?';
            break;
          case '5':
            tabla = 'reporte_bacheo';
            treporte = 'Bache';
            query =
              'SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, r.id_ciudadano, r.tipo_reporte, r.id_dependencia, b.colonia, b.calle, b.imagen, rs.evidencias FROM reporte_bacheo b JOIN reporte r ON b.id_reporte = r.id_reporte JOIN reporte_solucionado rs ON r.id_reporte = rs.id_reporte WHERE r.estatus = ?';
            break;
          default:
            console.log('error en dependencia');
            break;
        }
        console.log(query);
        function formatDate(date) {
          const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
          const formattedDate = new Date(date).toLocaleDateString('es-ES', options);
          return formattedDate;
        }
        req.getConnection((err, conn) => {
            conn.query(query, ['solucionado'], (err, reportes) => {
                //try {
                  if (err) {
                    console.log (err) // Lanza una excepción en caso de error en la consulta
                  }
                    console.log(reportes);
                    res.render('encargadoreportesrevisados', {data: reportes, formatDate: formatDate, treporte, tabla});
                // } catch (error) {
                //   res.json(error); // Devuelve el error como respuesta JSON
                // }
              });
        });
      };
      

    controller.pantallaVisualizarReportesEncargado = (req,res) => {
        const actividad = 'El encargado visualizo un reporte';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
        
        
        const dependencia=req.params.dependencia;
        console.log(dependencia);
        const id_reporte = req.params.id_reporte;
        var tabla = '';
        var id_tabla = '';
        var treporte='';
        var query='';
        let inputsHTML = '';
        switch(dependencia){
            case '1': tabla='reporte_ooapas';
                      treporte= 'Reporte Ooapas';
                    id_tabla='id_reporte_oo';
                    query = 'SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, r.id_ciudadano, r.tipo_reporte, r.id_dependencia, oo.cve_predio, oo.colonia, oo.calle FROM reporte_ooapas oo JOIN reporte r ON oo.id_reporte = r.id_reporte WHERE r.id_reporte=?';
                break;
            case '2': tabla= 'reporte_m_animal';
                    treporte= 'Maltrato animal';
                    id_tabla='id_reporte_me';
                    query = 'SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, r.id_ciudadano, r.tipo_reporte, r.id_dependencia, ma.tipo_mascota, ma.colonia, ma.calle FROM reporte_m_animal ma JOIN reporte r ON ma.id_reporte = r.id_reporte WHERE r.id_reporte=?';
                break;
            case '3': tabla= 'reporte_vial';
                    treporte= 'Problema en carretera';
                    id_tabla='id_reporte_v';
                    query = 'SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, r.id_ciudadano, r.tipo_reporte, r.id_dependencia, v.imagen, v.colonia, v.calle FROM reporte_vial v JOIN reporte r ON v.id_reporte = r.id_reporte WHERE r.id_reporte=?';
                break;
            case '4': tabla= 'reporte_alumbrado_publico'
                    treporte= 'Falla en alumbrado';
                    id_tabla='id_reporte_ap';
                    query = 'SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, r.id_ciudadano, r.tipo_reporte, r.id_dependencia, ap.colonia, ap.calle FROM reporte_alumbrado_publico ap JOIN reporte r ON ap.id_reporte = r.id_reporte WHERE r.id_reporte=?';
                break;
            case '5': tabla= 'reporte_bacheo'
                    treporte= 'Bache'
                    id_tabla='id_reporte_b';
                    query= 'SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, r.id_ciudadano, r.tipo_reporte, r.id_dependencia, b.colonia, b.calle, b.imagen FROM reporte_bacheo b JOIN reporte r ON b.id_reporte = r.id_reporte WHERE r.id_reporte=?';
                break;
            default: console.log('error en dependencia');
                break;
        }
        const consulta='SELECT tr.'
        function formatDate(date) {
            const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
            const formattedDate = new Date(date).toLocaleDateString('es-ES', options);
            return formattedDate;
            var tipo = '';
          }
        req.getConnection((err, conn) => {
            
            conn.query(query, [id_reporte],(err, data) => {
                let inputsHTML = '';
                switch (dependencia) {
                

                case '1':
                    inputsHTML += '<div><h3>Clave de predio:</h3><p>' + data[0].cve_predio + '</p></div>';
                    inputsHTML += '<div><h3>Colonia</h3><p>' + data[0].colonia + '</p></div>';
                    inputsHTML += '<div><h3>Calle</h3><p>' + data[0].calle + '</p></div>';

                    break;

                case '2':
                    inputsHTML += '<div><h3>Tipo de mascota:</h3><p>' + data[0].tipo_mascota + '</p></div>';
                    inputsHTML += '<div><h3>Colonia</h3><p>' + data[0].colonia + '</p></div>';
                    inputsHTML += '<div><h3>Calle</h3><p>' + data[0].calle + '</p></div>';

                    break;
                    
                case '3':
                    inputsHTML += '<div><img src=/reportes_img/' + data[0].imagen+ ' width=300px height=300px></div>';
                    inputsHTML += '<div><h3>Colonia</h3><p>' + data[0].colonia + '</p></div>';
                    inputsHTML += '<div><h3>Calle</h3><p>' + data[0].calle + '</p></div>';
                    break;

                case '4':
                    inputsHTML += '<div><h3>Colonia</h3><p>' + data[0].colonia + '</p></div>';
                    inputsHTML += '<div><h3>Calle</h3><p>' + data[0].calle + '</p></div>';
                    break;


                case '5':
                    inputsHTML += '<div><img src=/reportes_img/' + data[0].imagen +' height=300px width=300px' + '></div>';
                    inputsHTML += '<div><h3>Colonia</h3><p>' + data[0].colonia + '</p></div>';
                    inputsHTML += '<div><h3>Calle</h3><p>' + data[0].calle + '</p></div>';
                    break;

                default:
                    break;
            }
            if (err) {
                res.json(err);
            } else {
                console.log(data);

            res.render('encargadovisualizarreporte', {data:data, formatDate: formatDate, tiporeporte: treporte, inputsHTML, id_tabla});
            }  
            })
        });
};


    controller.rechazarReportesEncargado = (req,res) => {
        const actividad = 'El encargado entro a rechazar un reporte';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
        const id_tabla = req.params.id_tabla;
        const id_reporte = req.params.id_reporte;
        const id_encargado = req.params.id_encargado;
        console.log(id_tabla);
        console.log(id_reporte);
        console.log(id_encargado);

        function formatDate(date) {
            const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
            const formattedDate = new Date(date).toLocaleDateString('es-ES', options);
            return formattedDate;
    
        }
        req.getConnection((err, conn) => {
    
            conn.query('SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, c.id_ciudadano, d.nombre AS nombre_dependencia, r.tipo_reporte FROM reporte r JOIN ciudadano c ON r.id_ciudadano = c.id_ciudadano JOIN dependencia d ON r.id_dependencia = d.id_dependencia WHERE r.id_reporte = ?', [id_reporte], (err, reportes) => {
                if (err) {
                    res.json(err);
                } else {
                    console.log('Separacion en console log-------------------------------------------------------------------------');
                    console.log(reportes);
                    res.render('encargadoJustificacion', { data: reportes, formatDate: formatDate, id_tabla, id_encargado, id_reporte });
                }
            })
        });
    }

    controller.cambiarEstatusReportesEncargado = (req,res) =>{
        const actividad = 'El encargado cambio el estatus de un reporte';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
        const id_reporte = req.body['id_reporte'];
        const estatus = 'cancelado';
        const id_encargado = req.body['id_encargado'];
        const motivo = req.body['motivo'];
        console.log(id_reporte);
        console.log(estatus);
        console.log(id_encargado);
      
        const consultaEstatus = 'UPDATE reporte SET estatus = ? WHERE id_reporte = ?';
        const insercionBajaReporte = 'INSERT INTO baja_reporte (id_reporte, id_encargado, motivo) VALUES (?, ?, ?)';
      
        req.getConnection((err, conn) => {
          if (err) {
            res.json(err);
          } else {
            conn.query(consultaEstatus, [estatus, id_reporte], (err, reportes) => {
              if (err) {
                res.json(err);
              } else {
                  conn.query(insercionBajaReporte, [id_reporte, id_encargado, motivo], (err, baja_report) => {
                    if (err) {
                      res.json(err);
                    } else {
                      res.redirect('/pantallaEncargado');
                    }
                  });
                
                }
              }
    )}});
          }


        controller.solucionarReportesEncargado = (req,res) => {
            const actividad = 'El encargado accedio a la pantalla de reporte solucionado';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
                const id_reporte = req.params.id_reporte;
                const estatus = 'solucionado';  
                const id_encargado = req.params.id_encargado;
                console.log('datos del solucionarReportesEncaargado')
                console.log(id_reporte);
                console.log(estatus);
                console.log(id_encargado);
                    res.render('encargadoevidencias', {id_reporte, estatus, id_encargado});
        }

    controller.cambiarEstatusReportesSolucionado = (req, res) => {
        const actividad = 'El encargado marco un reporte como solucionado';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
        const id_reporte = req.body['id_reporte'];
        const estatus = req.body['estatus'];
        const id_encargado = req.body['id_encargado'];
        const archivo = req.file;
        const currentDate = new Date();
        const dateString = currentDate.toISOString().replace(/[:.]/g, '');
    
        // Llamar a la función para subir la imagen
        const consultaEstatus = 'UPDATE reporte SET estatus = ? WHERE id_reporte = ?';
        const insercionSolucionadoReportes = 'INSERT INTO reporte_solucionado (id_reporte, id_encargado, evidencias) VALUES (?, ?, ?)';
      
        req.getConnection((err, conn) => {
          if (err) {
            res.json(err);
          } else {
            conn.query(consultaEstatus, [estatus, id_reporte], (err, reportes) => {
              if (err) {
                res.json(err);
              } else {
                // Guardar la imagen como tipo BLOB en la base de datos
                if (archivo) {
                    const nombreArchivo = dateString+archivo.originalname;
                    const rutaLocal = archivo.path;
                  conn.query(insercionSolucionadoReportes, [id_reporte, id_encargado, nombreArchivo], (err, baja_report) => {
                    if (err) {
                      res.json(err);
                    } else {
                      subirImagen(nombreArchivo, rutaLocal);
                      res.redirect('/pantallaEncargado');
                    }
                  });
                } else {
                  console.log('Error en la insercion de la imagen, algo salio mal');
                  res.redirect('/pantallaEncargado');
                }
              }
            });
          }
        });
      };
            

    controller.advertenciaDescargarReportesEncargado = (req,res) => {
        const actividad = 'El encargado intenta descargar un pdf del reporte';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
        const id_reporte = req.params.id_reporte;
        res.render('encargadodescargarreportes', {id_reporte});
        }

    controller.descargarReportesEncargado = (req,res) => {
        const actividad = 'El encargado descargo un reporte';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
        
  const dependencia = req.params.dependencia;
  const id_reporte = req.params.id_reporte;
  let query = '';
  let estatus = 'En_Atencion'
  const queryact = 'UPDATE reporte SET estatus = ? WHERE id_reporte =?';

  switch (dependencia) {
    case '1':
      query = 'SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, r.id_ciudadano, r.tipo_reporte, r.id_dependencia, oo.cve_predio, oo.colonia, oo.calle FROM reporte_ooapas oo JOIN reporte r ON oo.id_reporte = r.id_reporte WHERE r.id_reporte=?';
      break;
    case '2':
      query = 'SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, r.id_ciudadano, r.tipo_reporte, r.id_dependencia, ma.tipo_mascota, ma.colonia, ma.calle FROM reporte_m_animal ma JOIN reporte r ON ma.id_reporte = r.id_reporte WHERE r.id_reporte=?';
      break;
    case '3':
      query = 'SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, r.id_ciudadano, r.tipo_reporte, r.id_dependencia, v.imagen, v.colonia, v.calle FROM reporte_vial v JOIN reporte r ON v.id_reporte = r.id_reporte WHERE r.id_reporte=?';
      break;
    case '4':
      query = 'SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, r.id_ciudadano, r.tipo_reporte, r.id_dependencia, ap.colonia, ap.calle FROM reporte_alumbrado_publico ap JOIN reporte r ON ap.id_reporte = r.id_reporte WHERE r.id_reporte=?';
      break;
    case '5':
      query = 'SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, r.id_ciudadano, r.tipo_reporte, r.id_dependencia, b.colonia, b.calle, b.imagen FROM reporte_bacheo b JOIN reporte r ON b.id_reporte = r.id_reporte WHERE r.id_reporte=?';
      break;
    default:
      console.log('Error en dependencia');
      break;
  }
  function formatDate(date) {
    const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
    const formattedDate = new Date(date).toLocaleDateString('es-ES', options);
    return formattedDate;

}
  req.getConnection((err, conn) => {
    conn.query(queryact,[estatus,id_reporte], (err,rows) => {
    conn.query(query, [id_reporte], (err, data) => {
      if (err) {
        res.json(err);
      } else {
        const doc = new PDFDocument();

        // Set the response headers for PDF download
        res.setHeader('Content-Disposition', 'attachment; filename=reporte.pdf');
        res.setHeader('Content-Type', 'application/pdf');

        // Pipe the PDF document to the response
        doc.pipe(res);

        // Create the PDF content based on the data retrieved from the query
        // Modify this part according to your data structure and formatting needs
        data.forEach((row) => {
          doc.text(`ID: ${row.id_reporte}`);
          doc.text(`Fecha: ${formatDate(row.fecha)}`);
          doc.text(`Descripción: ${row.descripcion}`);
          doc.text(`Latitud: ${row.latitud}`);
          doc.text(`Longitud: ${row.longitud}`);
          doc.text(`Número de apoyos: ${row.n_apoyos}`);
          doc.text(`Estatus: ${row.estatus}`);
          doc.text(`Número de denuncias: ${row.n_denuncias}`);
          doc.text(`Referencias: ${row.referencias}`);
          doc.text(`ID Ciudadano: ${row.id_ciudadano}`);
          doc.text(`Tipo de reporte: ${row.tipo_reporte}`);
          doc.text(`ID Dependencia: ${row.id_dependencia}`);

          // Additional fields specific to each table
          if (dependencia === '1') {
            doc.text(`Clave predio: ${row.cve_predio}`);
            doc.text(`Colonia: ${row.colonia}`);
            doc.text(`Calle: ${row.calle}`);
          } else if (dependencia === '2') {
            doc.text(`Tipo de mascota: ${row.tipo_mascota}`);
            doc.text(`Colonia: ${row.colonia}`);
            doc.text(`Calle: ${row.calle}`);
          } else if (dependencia === '3') {
            doc.text(`Imagen: ${row.imagen}`);
            doc.text(`Colonia: ${row.colonia}`);
            doc.text(`Calle: ${row.calle}`);
          } else if (dependencia === '4') {
            doc.text(`Colonia: ${row.colonia}`);
            doc.text(`Calle: ${row.calle}`);
          } else if (dependencia === '5') {
            doc.text(`Colonia: ${row.colonia}`);
            doc.text(`Calle: ${row.calle}`);
            doc.text(`Imagen: ${row.imagen}`);
          }

          doc.moveDown();
        });

        // Finalize the PDF document
        doc.end();
      }
    });})
  });

}

async function subirImagen(nombreArchivo, rutaLocal) {
    
    const sftp = new SftpClient();
  
    try {
      // Configuración de la conexión SFTP
      const config = {
        host: '137.117.123.255',
        port: 22,
        username: 'BD',
        password: 'Bd1111111111'
      };
  
      // Conexión al servidor SFTP
      await sftp.connect(config);
  
      // Ruta remota donde se almacenará la imagen
      const rutaRemota ='/opt/lampp/htdocs/reportes_img/' + nombreArchivo;
  
      // Subir el archivo a la máquina virtual
      await sftp.put(rutaLocal, rutaRemota);
      console.log('Imagen subida correctamente.');
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    } finally {
      // Cerrar la conexión SFTP
      await sftp.end();
    }
  }

controller.pruebasubirimagen = (req,res) =>{
    const archivo = req.file;
    const currentDate = new Date();
    const dateString = currentDate.toISOString().replace(/[:.]/g, '');

  if (archivo) {
    const nombreArchivo = 'http://137.117.123.255/reportes_img/'+dateString+archivo.originalname;
    const rutaLocal = archivo.path;

    // Llamar a la función para subir la imagen
    subirImagen(nombreArchivo, rutaLocal);

  } else {
    res.status(400).send('No se recibió ninguna imagen');
  }
}

// MODULOS DEL CIUDADANO ------------------------------------------------------------------------
controller.pantallaCiudadano = (req,res) =>{
    const actividad = 'Se accedio al panel del ciudadano';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    res.render('ciudadano');
}

controller.pantallaPerfilCiudadano = (req,res) =>{
    const actividad = 'El ciudadano accedio a su perfil';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    const id_ciudadano=req.params.id_ciudadano;
    const consulta = 'SELECT * FROM ciudadano WHERE id_ciudadano = ?';
    req.getConnection((err,conn) =>{
        conn.query(consulta,[id_ciudadano],(err,data) =>{
            if(err){
                res.json(err);
            } else {
                res.render('ciudadanoperfil', {data:data})
            }
        })
    });
}

controller.formReporte = (req,res) => {
    const actividad = 'El ciudadano solicito un reporte';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    console.log(req.body.tabla);
    var dependencia = ''
    const tabla = req.body.tabla;
    let inputsHTML = '';
    var tipo_reporte='';
                switch (tabla) {
                

                case 'reporte_ooapas':
                    dependencia = 1;
                    tipo_reporte=4;
                    inputsHTML += '<input type="text" name="cve_predio" required placeholder=ClavePredio>';
                    inputsHTML += '<input type="text" name="colonia" required placeholder=Colonia>';
                    inputsHTML += '<input type="text" name="calle" required placeholder=Calle>';
                    break;

                case 'reporte_m_animal':
                    dependencia = 2;
                    tipo_reporte=3;
                    inputsHTML += '<input type="text" name="tipo_mascota" required placeholder=TipoMascota>';
                    inputsHTML += '<input type="text" name="colonia" required placeholder=Colonia>';
                    inputsHTML += '<input type="text" name="calle" required placeholder=Calle>';
                    break;

                case 'reporte_vial':
                    dependencia = 3;
                    tipo_reporte=5;
                    inputsHTML += '<input type="file" name="imagen" required>';
                    inputsHTML += '<input type="text" name="colonia" required placeholder=Colonia>';
                    inputsHTML += '<input type="text" name="calle" required placeholder=Calle>';
                    break;

                case 'reporte_alumbrado_publico':
                    dependencia = 4;
                    tipo_reporte=1;
                    inputsHTML += '<input type="text" name="colonia" required placeholder=Colonia>';
                    inputsHTML += '<input type="text" name="calle" required placeholder=Calle>';
                    break;


                case 'reporte_bacheo':
                    dependencia = 5;
                    tipo_reporte=2;
                    inputsHTML += '<input type="file" name="imagen" required>';
                    inputsHTML += '<input type="text" name="colonia" required placeholder=Colonia>';
                    inputsHTML += '<input type="text" name="calle" required placeholder=Calle>';
                    break;

                default:
                    break;
            }

    res.render('ciudadanoreporte', {tabla, inputsHTML, dependencia, tipo_reporte});
}


controller.pantallaReporteCiudadano = (req,res) =>{
    const actividad = 'El ciudadano accedio a seleccionar un tipo de reporte a reportar';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    res.render('ciudadanotiporeporte');   
}


controller.reporte = (req,res) =>{
    const actividad = 'Se realizo una denuncia o reporte';
  fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
    const { fileName } = require('../app');

    const id_ciudadano=req.body.id_ciudadano;
    const dependencia = req.body.id_dependencia;
    var consulta2 = '';
    console.log('Informacion perteneciente al JSON de llegada');
    console.log(req.body);

    const {fecha,descripcion,latitud,longitud,n_apoyos,estatus,n_denuncias,referencias,tipo_reporte,id_dependencia}=req.body;
    console.log('Una fecha de prueba'+fecha);
    const reporteData ={
        fecha,
        descripcion,
        latitud,
        longitud,
        n_apoyos,
        estatus,
        n_denuncias,
        referencias,
        id_ciudadano:id_ciudadano,
        tipo_reporte,
        id_dependencia,
    }
    console.log('Informacion del reporte data');

    
    req.getConnection((err, conn) => {
        if(err){
            res.send('error en la conexion');
        } else{
        conn.query('INSERT INTO reporte SET ?', [reporteData], (err, result) => {
          if (err) {
            console.error('Error al insertar el reporte:', err);
            res.status(500).send('Error al insertar el reporte');
          } else {
            const id_reporte = result.insertId;
            switch(dependencia){
                case '1':
                    var {cve_predio, colonia, calle} = req.body;
                    var reportetipoData = {
                        cve_predio,
                        colonia,
                        calle,
                        id_reporte:id_reporte,
                      };
                    console.log('Informacion del reportetipoData');
                    console.log(reportetipoData);
                    consulta2 = 'INSERT INTO reporte_ooapas SET ?';
                    break;
                case '2':
                    var {tipo_mascota, colonia, calle} = req.body;
                    var reportetipoData = {
                        tipo_mascota,
                        colonia,
                        calle,
                        id_reporte:id_reporte,
                      };
                    consulta2 = 'INSERT INTO reporte_m_animal SET ?';
                    break;
                case '3':
                    var {colonia, calle} = req.body;
                    var reportetipoData = {
                        imagen:fileName,
                        colonia,
                        calle,
                        id_reporte:id_reporte,
                      };
                    consulta2 = 'INSERT INTO reporte_vial SET ?';
                    break;
                case '4':
                    var {colonia, calle} = req.body;
                    var reportetipoData = {
                        colonia,
                        calle,
                        id_reporte:id_reporte,
                      };
                    consulta2 = 'INSERT INTO reporte_alumbrado_publico SET ?';
                    break;
                case '5':
                    var {colonia, calle} = req.body;
                    var reportetipoData = {
                        imagen:fileName,
                        colonia,
                        calle,
                        id_reporte:id_reporte,
                      };
                    consulta2 = 'INSERT INTO reporte_bacheo SET ?';
                    break;
                default: res.send('error en dependencia');
            }
            // Insertar el nuevo reporte_ooapas vinculado con el reporte correspondiente
            conn.query(consulta2, [reportetipoData], (err) => {
              if (err) {
                console.error('Error al insertar el reporte_ooapas:', err);
                console.log('Error al insertar el reporte_ooapas');
              } else {
                console.log('Reporte y reporte_ooapas insertados correctamente');
                res.render('ciudadano');
              }
            });
          }
        });
        }
    });  
}


controller.pantallaReporteRealizadoCiudadano = (req,res) =>{
        const actividad = 'El moderador accedio a la pantalla de reportes entrantes';
      fs.appendFileSync('registro.txt', `${new Date().toISOString()}: ${actividad}\n`);
        function formatDate(date) {
            const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
            const formattedDate = new Date(date).toLocaleDateString('es-ES', options);
            return formattedDate;
        }
        req.getConnection((err, conn) => {
            conn.query('SELECT r.id_reporte, r.fecha, r.descripcion, r.latitud, r.longitud, r.n_apoyos, r.estatus, r.n_denuncias, r.referencias, c.id_ciudadano , d.nombre AS nombre_dependencia, r.tipo_reporte FROM reporte r JOIN ciudadano c ON r.id_ciudadano = c.id_ciudadano JOIN dependencia d ON r.id_dependencia = d.id_dependencia', (err, reportes) => {
                if (err) {
                    res.json(err);
                } else {
                    res.render('ciudadanoreportesrealizados', { data: reportes, formatDate: formatDate });
                }
            })
        });
}

//Clasees del bot
controller.chat = (req, res) => {
    res.render('chatbot');
  };

module.exports = controller;