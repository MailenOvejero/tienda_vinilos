# db.py - Configuración de acceso a la base de datos

import mysql.connector

def conectar():
    return mysql.connector.connect(
        host="localhost",
        user="root",                  # Cambiá si usás otro usuario
        password="mailen88",     # Reemplazá con tu contraseña de MySQL
        database="tienda_vinilos"
    )
