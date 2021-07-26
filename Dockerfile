FROM node:12
# создание директории приложения
WORKDIR /usr/src/app
# установка зависимостей
# символ астериск ("*") используется для того чтобы по возможности
# скопировать оба файла: package.json и package-lock.json
COPY package*.json ./
RUN npm install
# Если вы создаете сборку для продакшн
# RUN npm ci --only=production
# копируем исходный код
COPY . .
# проинформировать Docker о том, что в контейнере имеется приложение, прослушивающее этот порт.
EXPOSE 1337
# Здесь мы используем node app.js для запуска приложения.
CMD [ "node", "app.js" ]
