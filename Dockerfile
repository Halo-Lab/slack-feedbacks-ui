# базовый образ:
FROM node:16-alpine
# создаём каталог приложения внутри контейнера:
RUN mkdir -p /usr/src/app
# переходим в каталог приложения:
WORKDIR /usr/src/app
# копируем package.json и package-lock.json в контейнер:
COPY ./package*.json /usr/src/app/
# устанавливаем npm-зависимости:
RUN npm install
# копируем код приложения в контейнер:
COPY ./ /usr/src/app
# «выставляем наружу» порт веб-сервера
EXPOSE 3000
# собираем приложение:
RUN npm run build
# стартуем:
CMD npm start