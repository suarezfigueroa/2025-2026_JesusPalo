<?php

require_once 'conexion.php';

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo == 'GET') {

    $conn = obtenerConexion();

    //Coger todas las filas
    $sql = "SELECT * FROM tratamientos";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $tratamientos = $result->fetch_all(MYSQLI_ASSOC);
        enviarRespuesta($conn, [
            'success' => true,
            'datos' => $tratamientos
        ]);
    } else {
        enviarError(404, 'Error al buscar tratamientos', $conn);
    }

}

?>