// ============================================================
//  Controlador principal: orquesta Ciudad -> Ruta -> Parada
// ============================================================
app.controller("RutasControlador", function (
    $scope,
    CiudadServicio,
    TipoServicio,
    RutaServicio,
    ParadaServicio
) {

    // ----- Estado general -----
    $scope.ciudades = [];
    $scope.tipos = [];
    $scope.rutas = [];
    $scope.paradas = [];

    $scope.ciudadSel = null;   // ciudad seleccionada
    $scope.rutaSel = null;     // ruta seleccionada

    // ----- Estado de los formularios -----
    $scope.mostrarFormRuta = false;
    $scope.rutaForm = null;    // ruta en edición/creación

    $scope.mostrarFormParada = false;
    $scope.paradaForm = null;  // parada en edición/creación

    // ========================================================
    //  Inicialización
    // ========================================================
    function init() {
        CiudadServicio.listar().then(function (resp) {
            $scope.ciudades = resp.data;
        });
        TipoServicio.listar().then(function (resp) {
            $scope.tipos = resp.data;
        });
    }

    // ========================================================
    //  CIUDADES
    // ========================================================
    $scope.seleccionarCiudad = function (ciudad) {
        $scope.ciudadSel = ciudad;
        $scope.rutaSel = null;
        $scope.paradas = [];
        $scope.cancelarRuta();
        $scope.cancelarParada();
        $scope.cargarRutas();
    };

    // ========================================================
    //  RUTAS
    // ========================================================
    $scope.cargarRutas = function () {
        if (!$scope.ciudadSel) {
            return;
        }
        RutaServicio.listarCiudad($scope.ciudadSel.id).then(function (resp) {
            $scope.rutas = resp.data;
        });
    };

    // Mostrar formulario para agregar una ruta nueva
    $scope.nuevaRuta = function () {
        $scope.rutaForm = {
            id: 0,
            nombre: "",
            descripcion: "",
            idTipo: null
        };
        $scope.mostrarFormRuta = true;
    };

    // Mostrar formulario con los datos de una ruta existente
    $scope.editarRuta = function (ruta) {
        $scope.rutaForm = {
            id: ruta.id,
            nombre: ruta.nombre,
            descripcion: ruta.descripcion,
            idTipo: ruta.tipo ? ruta.tipo.id : null
        };
        $scope.mostrarFormRuta = true;
    };

    $scope.cancelarRuta = function () {
        $scope.mostrarFormRuta = false;
        $scope.rutaForm = null;
    };

    // Guardar (agregar o modificar) según tenga id
    $scope.guardarRuta = function () {
        var f = $scope.rutaForm;
        // Se arma el objeto con la forma que espera la entidad JPA
        var ruta = {
            id: f.id,
            nombre: f.nombre,
            descripcion: f.descripcion,
            ciudad: { id: $scope.ciudadSel.id },
            tipo: { id: f.idTipo }
        };

        var promesa = f.id > 0
            ? RutaServicio.modificar(ruta)
            : RutaServicio.agregar(ruta);

        promesa.then(function () {
            $scope.cancelarRuta();
            $scope.cargarRutas();
        }).catch(function () {
            alert("No se pudo guardar la ruta. Verifique que el nombre no esté repetido en la ciudad.");
        });
    };

    $scope.eliminarRuta = function (ruta) {
        if (!confirm("¿Eliminar la ruta \"" + ruta.nombre + "\"?")) {
            return;
        }
        RutaServicio.eliminar(ruta.id).then(function () {
            if ($scope.rutaSel && $scope.rutaSel.id === ruta.id) {
                $scope.rutaSel = null;
                $scope.paradas = [];
            }
            $scope.cargarRutas();
        }).catch(function () {
            alert("No se pudo eliminar la ruta. Es posible que tenga paradas asociadas.");
        });
    };

    // ========================================================
    //  PARADAS
    // ========================================================
    $scope.seleccionarRuta = function (ruta) {
        $scope.rutaSel = ruta;
        $scope.cancelarParada();
        $scope.cargarParadas();
    };

    $scope.cargarParadas = function () {
        if (!$scope.rutaSel) {
            return;
        }
        // El backend ya las entrega ordenadas por el campo orden
        ParadaServicio.listarRuta($scope.rutaSel.id).then(function (resp) {
            $scope.paradas = resp.data;
        });
    };

    $scope.nuevaParada = function () {
        // Sugiere el siguiente orden disponible
        var siguienteOrden = $scope.paradas.length + 1;
        $scope.paradaForm = {
            id: 0,
            orden: siguienteOrden,
            nombre: "",
            latitud: null,
            longitud: null,
            tiempo: null,
            descripcion: ""
        };
        $scope.mostrarFormParada = true;
    };

    $scope.editarParada = function (parada) {
        $scope.paradaForm = {
            id: parada.id,
            orden: parada.orden,
            nombre: parada.nombre,
            latitud: parada.latitud,
            longitud: parada.longitud,
            tiempo: parada.tiempo,
            descripcion: parada.descripcion
        };
        $scope.mostrarFormParada = true;
    };

    $scope.cancelarParada = function () {
        $scope.mostrarFormParada = false;
        $scope.paradaForm = null;
    };

    $scope.guardarParada = function () {
        var f = $scope.paradaForm;
        var parada = {
            id: f.id,
            orden: f.orden,
            nombre: f.nombre,
            latitud: f.latitud,
            longitud: f.longitud,
            tiempo: f.tiempo,
            descripcion: f.descripcion,
            ruta: { id: $scope.rutaSel.id }
        };

        var promesa = f.id > 0
            ? ParadaServicio.modificar(parada)
            : ParadaServicio.agregar(parada);

        promesa.then(function () {
            $scope.cancelarParada();
            $scope.cargarParadas();
        }).catch(function () {
            alert("No se pudo guardar la parada. Verifique que el nombre no esté repetido en la ruta.");
        });
    };

    $scope.eliminarParada = function (parada) {
        if (!confirm("¿Eliminar la parada \"" + parada.nombre + "\"?")) {
            return;
        }
        ParadaServicio.eliminar(parada.id).then(function () {
            $scope.cargarParadas();
        });
    };

    init();
});
