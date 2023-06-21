from werkzeug.utils import secure_filename
import os
from validations import validateFiles


# Esta funcion utiliza un nombre seguro para 
def guardar_imagen(file):

    if validateFiles(file) and file.name != '':
        s_file_name = secure_filename(file.filename)
        path = "D:\\desarrollo apps web\\tareas\\T2\\app\\static\\img"
        save_path = os.path.join(path, s_file_name)

        c = 1
        while os.path.exists(save_path):
            s_file_name = f'{c}_{s_file_name}'
            save_path = os.path.join(path, s_file_name)
            c+=1
        file.save(save_path)

    return (save_path, s_file_name)