<?php

require_once 'conexion.php';

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo == 'GET') {

    $conn = obtenerConexion();

    //Coger todas las filas
    $sql = "SELECT id_persona, nombre, apellidos, foto, datosExtras FROM persona, doctores where rol='doctor' and persona.id_persona=doctores.id_doctor order by id_persona";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $doctores = $result->fetch_all(MYSQLI_ASSOC);
        enviarRespuesta($conn, [
            'success' => true,
            'datos' => $doctores
        ]);
    } else {
        enviarError(404, 'Error al buscar doctores', $conn);
    }

}

?>