# Web Store (plantilla)
README disponible en [English](README.md)

![License](https://img.shields.io/github/license/acevedoossiel/webStore)

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)


## Descripción
Este repositorio proporciona una plantilla para construir una aplicación web utilizando Node.js con Express para el backend, MongoDB como base de datos y React para el frontend. La aplicación está estructurada utilizando una Arquitectura Modular, que separa las diferentes responsabilidades en módulos específicos, haciendo que el código sea más mantenible y escalable.

## Características
- **Arquitectura Modular:** El proyecto está organizado en diferentes módulos, incluidos controladores, servicios, modelos y rutas, asegurando una clara separación de responsabilidades.
- **Patrón MVC (Modelo-Vista-Controlador):** La aplicación sigue el patrón MVC, donde el Modelo representa los datos y la lógica de negocio, la Vista es gestionada por el frontend de React, y el Controlador maneja la comunicación entre el Modelo y la Vista, procesando solicitudes y devolviendo respuestas adecuadas.


## Prerequisitos
- **nvm**
- **Node v20.16.0**
- **pnpm** 
- **MongoDB**

## Instalacion
```bash
# Clonar repositorio
  git clone https://github.com/acevedoossiel/webStore.git

# Instalar las dependencias del cliente y servidor (desde la raiz)
  pnpm install

# Variables de entorno
 - Crear un archivo `.env`  en el directorio "cliente" y agregar las variables:
    * PORT=4200

```
## Uso
```bash
# Instalar la version de node
  nvm use

# Usar el compilador de typescript
  cd server
  pnpm tsc

# Iniciar el servidor usando
  cd server
  pnpm run start:dev

# Iniciar el cliente usando 
  cd cliente
  pnpm start
```

## Instalacion de la base de datos (MongoDB para linux v24.04)
```bash
# Importar la clave GPG más reciente
  curl -fsSL https://pgp.mongodb.com/server-6.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor

# Configurar el repositorio
  echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Actualizar los Paquetes
  sudo apt update

# Instalar MongoDB
  sudo apt install -y mongodb-org

# Iniciar y Habilitar MongoDB
  sudo systemctl start mongod
  sudo systemctl enable mongod
  sudo systemctl status mongod

# Verificar la Instalación
  mongod --version

```

## Licencia
Este proyecto tiene una licencia de tipo MIT - ver [LICENCIA](LICENSE) para los detalles.
