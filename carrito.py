# Módulo para agregar vinilos al carrito, confirmar compra y obtener el contenido

from flask import request, jsonify
from db import conectar

# ➕ Agregar vinilos al carrito
def agregar_carrito():
    data = request.json
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO carritos (usuario_id, vinilo_id, cantidad) VALUES (%s, %s, %s)",
        (data['usuario_id'], data['vinilo_id'], data['cantidad'])
    )
    conn.commit()
    conn.close()
    return jsonify({"success": True})

# ✅ Confirmar compra con registro en tabla compras
def confirmar_compra():
    usuario_id = request.json['usuario_id']
    conn = conectar()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT vinilo_id, cantidad FROM carritos WHERE usuario_id = %s", (usuario_id,))
    items = cursor.fetchall()

    for item in items:
        # Obtener el precio del vinilo
        cursor.execute("SELECT precio FROM vinilos WHERE id = %s", (item['vinilo_id'],))
        precio = cursor.fetchone()['precio']
        precio_total = precio * item['cantidad']

        # Actualizar stock
        cursor.execute(
            "UPDATE vinilos SET stock = stock - %s WHERE id = %s",
            (item['cantidad'], item['vinilo_id'])
        )

        # Registrar compra
        cursor.execute(
            """
            INSERT INTO compras (usuario_id, vinilo_id, cantidad, precio_total, estado)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (usuario_id, item['vinilo_id'], item['cantidad'], precio_total, "pendiente")
        )

    cursor.execute("DELETE FROM carritos WHERE usuario_id = %s", (usuario_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True})


# 🛒 Obtener contenido del carrito
def obtener_carrito():
    usuario_id = request.args.get('usuario_id')
    conn = conectar()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT v.nombre, v.banda, v.precio, c.cantidad
        FROM carritos c
        JOIN vinilos v ON c.vinilo_id = v.id
        WHERE c.usuario_id = %s
    """, (usuario_id,))
    items = cursor.fetchall()
    conn.close()
    return jsonify(items)
