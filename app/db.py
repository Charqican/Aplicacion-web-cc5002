import pymysql
import json
import datetime
import math
from Utils import guardar_imagen

DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306
DB_CHARSET = "utf8"


# aprovechando que request.form es un diccionario, lo pasamos para evitar repetir codigo
# Esta funcion crea una donacion y la inserta en la base de datos
def createDonacion(files, form):
    # Valores a añadir en la base de datos
    valores = (int(form['comuna']), form['calle-numero'], form['tipo'],\
    int(form['cantidad']), form['fecha-disponibilidad'], form['descripcion'], form['condiciones'],\
    form['nombre'], form['email'], form['celular'])

    # Lista de archivos: 
    files = files.getlist('foto')

    # Manejo de la base de datos de la tabla donacion utilizando pymysql
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO donacion (comuna_id, \
    calle_numero, tipo, cantidad, fecha_disponibilidad,\
 	descripcion, condiciones_retirar, nombre, email, celular)\
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", valores)
    dono_id = cursor.lastrowid #golazo
    conn.commit()
    conn.close()

    # Añadir las fotos a la tabla fotos y utilizar dono_id como FORAIGN KEY
    for file in files: 
        ruta, nombre = guardar_imagen(file)
        insertFoto(ruta, nombre, dono_id)
    
    
# Esta funcion inserta un pedido en la base de datos
def createPedido(form):
    valores = (int(form['comuna']),  form['tipo'], form['descripcion'],\
    int(form['cantidad']), form['nombre'], form['email'], form['celular'])
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO pedido (comuna_id,\
	tipo, descripcion, cantidad, nombre_solicitante, email_solicitante,\
	celular_solicitante) VALUES (%s, %s, %s, %s, %s, %s, %s)', valores)
    conn.commit()
    conn.close()


# esta funcion entrega una tupla con los 5 pedidos de la pagina pedida
def getPedidosPage(page):
    limits = (5*(page-1), 5*page)
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(f"SELECT id, comuna_id, tipo, descripcion, cantidad,\
	nombre_solicitante FROM pedido ORDER BY id DESC LIMIT {limits[0]},{limits[1]}")
    pedidos = cursor.fetchall()
    conn.close()
    pedidos_completos = []
    for pedido in pedidos:
        pedido_completo = [x for x in pedido]
        pedido_completo[1] = getComuna(pedido_completo[1])
        pedidos_completos.append(pedido_completo)

    return pedidos_completos


# esta funcion entrega una tupla con las 5 donaciones de los pedidos 
def getDonacionesPage(page):
    limits = (5*(page-1), 5*page)
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(f"SELECT id, comuna_id, tipo, cantidad,\
	fecha_disponibilidad, nombre FROM donacion ORDER BY id DESC LIMIT {limits[0]}, {limits[1]}")
    donaciones = cursor.fetchall()
    conn.close()
    donaciones_completas = []
    for donacion in donaciones:
        donacion_completa = [x for x in donacion]
        donacion_completa[1] = getComuna(donacion_completa[1])
        donacion_completa[4] = donacion_completa[4].strftime('%Y/%m/%d')
        donacion_completa.append(getFotos(donacion[0]))
        donaciones_completas.append(donacion_completa)

    return donaciones_completas


# Esta funcion devuelve la informacion de una donacion dada su id en una tupla
def getDonacionFromDB(id_donacion):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT id, comuna_id, calle_numero, tipo, cantidad,\
	fecha_disponibilidad, descripcion, condiciones_retirar, nombre,\
	email, celular FROM donacion WHERE id=%s", id_donacion)
    donacion = cursor.fetchone()
    conn.close()
    fotos = getFotos(id_donacion) # lista de los nombres de las fotos
    region = getRegion(donacion[1]) # damos el id de la comuna
    comuna = getComuna(donacion[1]) # damos el id 
    donacion_completa = [x for x in donacion] + [region, fotos]
    donacion_completa[1] = comuna
    return donacion_completa


# Esta funcion devuelve la informacion de un pedido dado el id en una tupla
def getPedidoFromDB(id_pedido):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT id, comuna_id, tipo, descripcion, cantidad,\
	nombre_solicitante, email_solicitante, celular_solicitante FROM pedido\
    WHERE id=%s", id_pedido)
    pedido = cursor.fetchone()
    conn.close()
    region = getRegion(pedido[1])
    comuna = getComuna(pedido[1])
    pedido_completo = [x for x in pedido] + [region]
    pedido_completo[1] = comuna
    return pedido_completo


# funcion que entrega la cantidad maxima de paginas de pedidos
def getMaxPagePedidos(max_number):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM pedido')
    rows = cursor.fetchone()[0]
    max_pages = math.ceil(rows/max_number)
    return max_pages


# funcion que entrega la cantidad maxima de paginas de donaciones
def getMaxPageDonaciones(max_number):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM donacion')
    rows = cursor.fetchone()[0]
    max_pages = math.ceil(rows/max_number)
    return max_pages


# retorna una lista de diccionarios que contienen los datos
def getDonacionesMap(cantidad_donaciones = 5):
    conn = get_conn()
    cursor = conn.cursor()

    if cantidad_donaciones == -1:
       cursor.execute(f"SELECT id, comuna_id, calle_numero, tipo, cantidad,\
                   fecha_disponibilidad, email FROM donacion\
                    ORDER BY id DESC")
    else :    
        cursor.execute(f"SELECT id, comuna_id, calle_numero, tipo, cantidad,\
                   fecha_disponibilidad, email FROM donacion\
                    ORDER BY id DESC LIMIT {cantidad_donaciones}")
    donaciones = cursor.fetchall()
    donaciones_completas = []

    for donacion in donaciones:

        id_donacion = donacion[0]
        lat, lon = getGeoData(id_donacion=id_donacion)
        comuna = getComuna(donacion[1])
        donacion_completa = {
            "id":donacion[0],
            "comuna": comuna,
            "calle_numero":donacion[2],
            "tipo": donacion[3],
            "cantidad": donacion[4],
            "fecha_disponibilidad": donacion[5],
            "email": donacion[6],
            "latitud": lat,
            "longitud": lon,
            "type": "donacion"
        }

        donaciones_completas.append(donacion_completa)

    return donaciones_completas

def getPedidosMap(cantidad_pedidos = 5):
    conn = get_conn()
    cursor = conn.cursor()
    if cantidad_pedidos == -1:
        cursor.execute("SELECT id, comuna_id, tipo, cantidad, email_solicitante\
                    FROM pedido ORDER BY id DESC LIMIT 5")
    else:
        cursor.execute(f"SELECT id, comuna_id, tipo, cantidad, email_solicitante\
                    FROM pedido ORDER BY id DESC LIMIT {cantidad_pedidos}")

    pedidos = cursor.fetchall()

    pedidos_completos = []

    for pedido in pedidos: 

        id_pedido = pedido[0]
        lat, lon = getGeoData(id_pedido=id_pedido)
        comuna = getComuna(pedido[1])
        pedido_completo = {
            "id": pedido[0],
            "comuna": comuna,
            "tipo": pedido[2],
            "cantidad": pedido[3],
            "email":pedido[4],
            "longitud": lon,
            "latitud": lat,
            "type": "pedido"
        }

        pedidos_completos.append(pedido_completo)

    return pedidos_completos


"""
    FUNCIONES AUXILIARES

"""

# Esta funcion devuelve informacion de las fotos de una donacion dado el id
# de la donacion en una tupla
def getFotos(dono_id):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT id, ruta_archivo, nombre_archivo, donacion_id FROM\
	foto WHERE donacion_id=%s", dono_id)
    files = cursor.fetchall()
    file_names = [file[2] for file in files]
    conn.close()
    return file_names # retorna hasta 3 files 
    

#funcion que inserta las rutas de las fotos en la base de datos
def insertFoto(ruta, nombre, donacion_id):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO foto (ruta_archivo, nombre_archivo, donacion_id)\
	VALUES (%s, %s, %s)", (ruta, nombre, donacion_id))
    conn.commit()
    

# Devuelve el nombre de la region dada el id de la comuna
def getRegion(id_comuna):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT region_id FROM comuna WHERE id=%s", id_comuna)
    region_id = cursor.fetchone()[0]
    cursor.execute("SELECT nombre FROM region WHERE id=%s", region_id)
    region = cursor.fetchone()
    conn.close()
    return region[0]


# Devuelve el nombre de la comuna dado el id de la comuna
def getComuna(id_comuna):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT nombre FROM comuna WHERE id=%s", id_comuna)
    comuna = cursor.fetchone()[0]
    conn.close()
    return comuna#porq entrega un ('valor',)?


#devuelve latitud y longitud de la comuna de la donacion 
def getGeoData(id_donacion= None, id_pedido=None): 
    conn = get_conn()
    cursor = conn.cursor()

    if id_donacion is not None:
        cursor.execute('SELECT comuna_id FROM donacion WHERE id=%s', id_donacion)
    elif id_pedido is not None:
        cursor.execute('SELECT comuna_id FROM pedido WHERE id=%s', id_pedido)
    
    id_comuna = cursor.fetchone()[0]
    cursor.execute('SELECT lat, lon FROM geodata WHERE id=%s', id_comuna)
    lat, lon= cursor.fetchone()
    cursor.close()
    return float(lat), float(lon)


def get_conn():
    try:
        conn = pymysql.connect(db=DB_NAME, user=DB_USERNAME, passwd=DB_PASSWORD, host=DB_HOST, port=DB_PORT, charset=DB_CHARSET); 
    except pymysql.Error as e:
        print(f"Error al conectar a la base de datos: {str(e)}")
    
    return conn