from flask import jsonify
from db import conectar

def obtener_usuario(usuario_id):
    conn = conectar()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id, username FROM usuarios WHERE id = %s", (usuario_id,))
    usuario = cursor.fetchone()

    cursor.execute("""
        SELECT v.nombre, v.banda, v.genero, c.cantidad, c.precio_total, c.estado, c.fecha
        FROM compras c
        JOIN vinilos v ON c.vinilo_id = v.id
        WHERE c.usuario_id = %s
        ORDER BY c.fecha DESC
    """, (usuario_id,))
    compras = cursor.fetchall()

    conn.close()
    return jsonify({"usuario": usuario, "compras": compras})
