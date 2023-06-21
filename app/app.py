from flask import Flask, request, render_template, jsonify
from flask_cors import cross_origin
from validations import FormValidate, validateFiles
from db import *
from Utils import *

app = Flask(__name__)


# Main route
@app.route('/')
def index():
   return render_template('Inicio.html')


@app.route('/get-map-data')
@cross_origin(origin="localhost", supports_credentials=True)
def getMapData(): 
   markers = getPedidosMap()
   markers+= getDonacionesMap()

   return jsonify(markers)


@app.route('/get-graph-data')
@cross_origin(origin="localhost", supports_credentials=True)
def getGraphData():
   informacion_pedidos = getPedidosMap(-1)
   informacion_donacion = getDonacionesMap(-1)
   info = informacion_pedidos+informacion_donacion
   return jsonify([informacion_pedidos, informacion_donacion])


# ruta de graficos
@app.route('/graficos', methods = ('GET', 'POST'))
def graficos():
   if request.method == 'GET':
      return render_template("graficos.html")


# Ruta de agregar doncaiones
@app.route('/agregar-donacion', methods = ('GET', 'POST'))
def agregar_donacion():
   if request.method == 'POST':
      # almacenamos los inputs entregrados por el form 
      files = request.files

      validator = FormValidate()
      
      #bloque de renderizado de error
      if (not validator.val() and validateFiles(files)):
         pass 
      print('1')
      #Se inserta toda la informacion del form
      createDonacion(files, request.form)
      #Si no hay errores en la validacion back-end agregamos los datos a la base de datos

   # get
   return render_template("agregar-donacion.html")


#Ruta de agragar un pedido
@app.route('/agregar-pedido', methods=('GET', 'POST'))
def agregar_pedido():
   if request.method == 'POST':
      validator = FormValidate()
   
      #bloque de renderizado de error
      if (not validator.val()):
         pass 
      # insertar pedido a la base de datos 
      createPedido(request.form)

   return render_template("agregar-pedido.html")


#Ruta de ver los pedidos
@app.route('/ver-pedidos', methods=('GET', 'POST'))
def ver_pedidos():
   # debemos devolver diccionarios que contengan la informacion de la base de datos
   if request.method == 'GET':
      page_number = request.args.get('page_number')
      max_page = getMaxPagePedidos(5)
      if page_number == None or int(page_number)> max_page: page_number=1
      list_of_pedidos = getPedidosPage(int(page_number))
      #retornar el template con los diccionarios para renderizar
      return render_template("/ver-pedidos.html", datos=list_of_pedidos, page=page_number, max_page=max_page)


@app.route('/ver-donaciones', methods=('GET', 'POST'))
def ver_donaciones():
   # debemos devolver diccionarios que contengan la informacion de la base de datos
   if request.method == 'GET':
      page_number = request.args.get('page_number')
      max_page = getMaxPageDonaciones(5)
      if page_number == None or int(page_number)> max_page: page_number=1
      list_of_donaciones = getDonacionesPage(int(page_number))
      #retornar el template con los diccionarios para renderizar
      return render_template("/ver-donaciones.html", datos=list_of_donaciones, page=page_number, max_page=max_page)


@app.route('/informacion-donacion', methods=('GET', 'POST'))
def informacion_donacion():
   if request.method == 'GET':
      id_donacion = request.args.get('id')
      info = getDonacionFromDB(id_donacion)
   return render_template("/informacion-donacion.html", datos=info)


@app.route('/informacion-pedido', methods=('GET', 'POST'))
def informacion_pedido():
   if request.method == 'GET':
      id_pedido = request.args.get('id')
      info = getPedidoFromDB(id_pedido)
   return render_template("/informacion-pedido.html", datos=info)


if __name__ == '__main__':
    app.run()