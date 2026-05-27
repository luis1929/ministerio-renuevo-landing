# Etapa de build
FROM node:18-alpine AS builder
WORKDIR /app

# Copiamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto del código
COPY . .

# Construimos la aplicación
RUN npm run build

# Etapa de producción
FROM node:18-alpine
WORKDIR /app

# Copiamos archivos construidos desde la etapa anterior
COPY --from=builder /app ./

# Exponemos el puerto
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]
