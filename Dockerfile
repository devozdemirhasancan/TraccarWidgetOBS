# Node.js base image
FROM node:18-alpine

# Çalışma dizinini oluştur
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Tüm proje dosyalarını kopyala
COPY . .

# Port'u belirt
EXPOSE 3000

# Uygulamayı başlat
CMD ["npm", "start"] 