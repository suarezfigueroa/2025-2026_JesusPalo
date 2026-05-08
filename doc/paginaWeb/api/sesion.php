<?php

//Comprobar si hay sesion activa
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['id'])) {
    echo json_encode([
        'success' => true,
        'usuario' => [
            'id'     => $_SESSION['id'],
            'nombre' => $_SESSION['nombre'],
            'rol'    => $_SESSION['rol'],
            'foto'   => $_SESSION['foto']
        ]
    ]);
} else {
    echo json_encode(['success' => false]);
}
?>