# productos.py

from flask import request, jsonify
from db import conectar

def obtener_vinilos():
    genero = request.args.get('genero')
    banda = request.args.get('banda')

    query = "SELECT * FROM vinilos WHERE 1"
    filtros = []

    if genero:
        query += " AND genero = %s"
        filtros.append(genero)

    if banda:
        query += " AND banda LIKE %s"
        filtros.append(f"%{banda}%")

    conn = conectar()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(query, filtros)
    resultados = cursor.fetchall()
    conn.close()

    # 🔥 Asegurarse de que cada vinilo tenga una imagen válida
    for vinilo in resultados:
        if not vinilo.get('imagen_url') or vinilo['imagen_url'] in ('', None):
            vinilo['imagen_url'] = 'default.jpg'

    return jsonify(resultados)
