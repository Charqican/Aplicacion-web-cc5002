import json
import pymysql


DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306
DB_CHARSET = "utf8"

# Script para agregar los valores de las latitudes y longitudes. (es una nueva tabla)
# Simplemente no agregare las comunas que no estan ya en la base de datos porque no es posible acceder a ellas desde el form

def get_conn():
    try:
        conn = pymysql.connect(db=DB_NAME, user=DB_USERNAME, passwd=DB_PASSWORD, host=DB_HOST, port=DB_PORT, charset=DB_CHARSET); 
    except pymysql.Error as e:
        print(f"Error al conectar a la base de datos: {str(e)}")
    
    return conn

if __name__ == '__main__':

    with open('comunas-Chile.json', 'r') as geodata:
        GEODATA_DICTS = json.load(geodata)

    conn = get_conn()
    cursor = conn.cursor()

    for dicts in GEODATA_DICTS:
        cursor.execute("SELECT id FROM comuna WHERE nombre=%s", dicts["name"])
        try:
            id_comuna = cursor.fetchone()[0]
            cursor.execute("INSERT INTO geodata (id, lat, lon) VALUES (%s, %s, %s)", (id_comuna, dicts["lat"], dicts["lng"]))
            print("inserted")
            conn.commit()
        except TypeError:
            # there are conflicts between the json file and the database
            print("nombre de la comuna que no esta en la base de datos: ", dicts["name"])
        except pymysql.err.IntegrityError:
            print("error, ya estaba en la tabla")
    cursor.close()
    print("Done!")