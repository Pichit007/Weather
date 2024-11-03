
# Moodeng Weather Forecast

โปรเจคสำหรับการพยากรณ์อากาศโดยหมูเด้ง UI จากเมืองต่างๆ มากกว่า 200,000 เมือง


## Development principles

### 1.1 เทคโนโลยีที่ใช้

**Bun:** สำหรับเป็น JavaScript runtime

**React:** สำหรับเป็นตัวจัดการในส่วนของ frontend

**Express:** สำหรับเป็นตัวจัดการในส่วนของ Backend

**SQLite:** สำหรับเป็นตัวจัดเก็บ Database

### 1.2 แนวทางในการพัฒนา
#### Features

- แสดงสภาพอากาศปัจจุบัน
- แสดงสภาพอากาศโดยรวม
- แสดงการพยากรณ์ เป็นแต่ละช่วงเวลาของวัน
- แสดงพยากรณ์รายสัปดาห์

#### การแสดงผลของ frontend
```bash
  1. ต้องแสดงผลเพื่อเลือกเมืองที่ต้องการตรวจสอบสภาพอากาศและพยากรณ์อากาศ
  2. เมื่อเลือกเมืองแล้วจะดึง API latitude และ longitude ของเมืองนั้น ซึ่งต้องได้ข้อมูลดังต่อไปนี้ 
  Example:
    - lat : 13.8701
    - lon : 100.5161
```
![image](https://github.com/user-attachments/assets/324f68eb-ae3d-46e2-b4ee-c9f6352662e3)

```bash
  3. แสดงผลสภาพอากาศโดยนำเอา API ที่ได้จาก latitude และ longitude ไปส่งค่าเป็น parameter ให้กับ API ดึงข้อมูลสภาพอากาศ ซึ่งต้องได้ข้อมูลดังต่อไปนี้ 
  Example:
    - feels_like : 33.84
    - grnd_level : 1008
    - humidity : 48
    - pressure : 1009
    - sea_level : 1009
    - temp : 31.97
    - temp_max : 31.97
    - temp_min : 31.97
    - name : "Nonthaburi"
```
![image](https://github.com/user-attachments/assets/df70b8ee-6b50-4343-9880-31c35cbaac44)

```bash
  4. ส่งข้อมูลไปเก็บยัง Database SQLite TABLE name "weather_data"
```

#### การเก็บข้อมูลลง Database SQLite
```bash
  1. สร้างตารางเก็บข้อมูล

CREATE TABLE "weather_data" (
	"id"	INTEGER NOT NULL,
	"city_id"	INTEGER,
	"dt"	INTEGER NOT NULL,
	"name"	TEXT,
	"temp"	REAL NOT NULL,
	"feels_like"	REAL NOT NULL,
	"humidity"	REAL NOT NULL,
	"pressure"	REAL NOT NULL,
	"sea_level"	REAL NOT NULL,
	"grnd_level"	REAL NOT NULL,
	"temp_max"	REAL NOT NULL,
	"temp_min"	REAL NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("city_id") REFERENCES "cities"("id")
);

```
#### การทำงานของ Backend
```bash
    1. ดึงข้อมูลจาก API เพื่อรับค่าดังต่อไปนี้ 
    Example
        - lat : 13.8701
        - lon : 100.5161
        - feels_like : 33.84
        - grnd_level : 1008
        - humidity : 48
        - pressure : 1009
        - sea_level : 1009
        - temp : 31.97
        - temp_max : 31.97
        - temp_min : 31.97
        - name : "Nonthaburi"
    2. ส่งข้อมูลกลับไปเก็บยัง Database
    3. frontend ดึงข้อมูลจาก Backend ไปแสดงผล
```

## API Reference

#### Get all items

```http
  GET https://wft-geo-db.p.rapidapi.com/v1/geo/cities?minPopulation=10000&namePrefix=${input}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Name cities` | `String` | ดึงข้อมูลจากรายชื่อเมืองเพื่อหา latitude กับ longitude|

```http
  GET https://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid=${WEATHER_API_KEY}&units=metric
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `latitude` | `Number` | ดึงข้อมูล latitude สภาพอากาศ |
| `longitude` | `Number` | ดึงข้อมูล longitude สภาพอากาศ|

```http
  GET https://api.openweathermap.org/data/2.5/forecast?lat={latitude}&lon={longitude}&appid=${WEATHER_API_KEY}&units=metric
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `latitude` | `Number` | ดึงข้อมูล latitude การพยากรณ์อากาศ|
| `longitude` | `Number` | ดึงข้อมูล longitude การพยากรณ์อากาศ|



## Deployment

### Run project
```basg
  bun run dev

```
### Install dependencies (Frontend)
```bash
   "dependencies": {
    "@emotion/react": "^11.13.3",
    "@emotion/styled": "^11.13.0",
    "@mui/icons-material": "^6.1.6",
    "@mui/material": "^6.1.6",
    "axios": "^1.7.7",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-select-async-paginate": "^0.7.6",
    "vite-plugin-svgr": "^4.3.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.13.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "eslint": "^9.13.0",
    "eslint-plugin-react": "^7.37.2",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.14",
    "globals": "^15.11.0",
    "vite": "^5.4.10"
  }
```
### Install dependencies (backend)
```bash
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.21.1",
    "sqlite3": "^5.1.7"
  }
```
### Port
```bash
  Port = 3000 (Frontend) using axios
  Port = 3001 (Backend) using express
```

### Build Dockerfile
```bash
FROM oven/bun AS frontend

WORKDIR /app/frontend

COPY weather-moodeng/package.json ./

RUN bun install

COPY weather-moodeng/ .

RUN bun run build

FROM oven/bun AS backend

WORKDIR /app

COPY backend/package.json ./

RUN bun install --production

COPY backend/ .

COPY --from=frontend /app/frontend/dist ./public

EXPOSE 3001

CMD ["bun", "server.js"]
```

### Build docker-compose
```bash
services:
  app:
    build: .
    ports:
      - "3000:3001"
    volumes:
      - ./backend:/backend
```

### Github
```bash
git push https://github.com/Pichit007/Weather.git
```

### AWS VM Ubuntu
```bash

  Install docker.io
  Install docker-compose
  git pull https://github.com/Pichit007/Weather.git
  sudo docker-compose up
````

### Production
```bash
Access on Web http://3.1.109.235:3000
```
