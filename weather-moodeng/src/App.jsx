import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Link,
  Typography,
  Button,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Slide,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import CloseIcon from "@mui/icons-material/Close";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Search from "./components/Search/Search";
import TodayWeather from "./components/TodayWeather/TodayWeather";
import HourlyForecast from "./components/TodayWeather/Hourly";
import { transformDateFormat } from "./utilities/DatetimeUtils";
import UTCDatetime from "./components/Reusable/UTCDatetime";
import LoadingBox from "./components/Reusable/LoadingBox";
import Logo from "./assets/logo.png";
import pig from "./assets/icons/frist.png";
import ErrorBox from "./components/Reusable/ErrorBox";
import { ALL_DESCRIPTIONS } from "./utilities/DateConstants";
import {
  getTodayForecastWeather,
  getWeekForecastWeather,
} from "./utilities/DataUtils";
import axios from "axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function App() {
  const [todayWeather, setTodayWeather] = useState(null);
  const [todayForecast, setTodayForecast] = useState([]);
  const [weekForecast, setWeekForecast] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const searchChangeHandler = async (enteredData) => {
    const [latitude, longitude] = enteredData.value.split(" ");

    setIsLoading(true);

    const currentDate = transformDateFormat();
    const date = new Date();
    let dt_now = Math.floor(date.getTime() / 1000);

    try {
      const todatabase = await axios.get(
        `/weather?lat=${latitude}&lon=${longitude}`
      );
      const [todayWeatherResponse, weekForecastResponse] = todatabase.data;

      const all_today_forecasts_list = getTodayForecastWeather(
        weekForecastResponse,
        currentDate,
        dt_now
      );

      const all_week_forecasts_list = getWeekForecastWeather(
        weekForecastResponse,
        ALL_DESCRIPTIONS
      );

      // จัดการข้อมูลพยากรณ์รายชั่วโมง
      const hourlyData = weekForecastResponse.list.reduce((acc, item) => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toISOString().split('T')[0];
        
        if (!acc[dayKey]) {
          acc[dayKey] = [];
        }
        
        acc[dayKey].push({
          hour: date.getHours(),
          temp: item.main.temp,
          weather: item.weather[0],
          humidity: item.main.humidity,
          wind_speed: item.wind.speed,
          feels_like: item.main.feels_like,
          pressure: item.main.pressure
        });
        
        return acc;
      }, {});

      setTodayForecast([...all_today_forecasts_list]);
      setTodayWeather({ city: enteredData.label, ...todayWeatherResponse });
      setWeekForecast({
        city: enteredData.label,
        list: all_week_forecasts_list,
      });
      setHourlyForecast({
        city: enteredData.label,
        data: hourlyData
      });
    } catch (error) {
      setError(true);
    }

    setIsLoading(false);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  let appContent = (
    <Box
      xs={12}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: "100%",
        minHeight: "500px",
      }}
    >
      <Box
        component="img"
        sx={{
          height: { xs: "16px", sm: "22px", md: "300px" },
          width: "auto",
        }}
        alt="pig"
        src={pig}
        className="rotating-image"
      />
      <Typography
        variant="h4"
        component="h4"
        className="bounce"
        sx={{
          fontSize: { xs: "12px", sm: "16px" },
          color: "rgba(255,255,255, .85)",
          fontFamily: "Poppins",
          textAlign: "center",
          margin: "2rem 0",
          maxWidth: "80%",
          lineHeight: "22px",
        }}
      >
        "หมูเด้งสุดคิวท์พยากรณ์อากาศ! มาอัปเดตอากาศสดใสและการพยากรณ์ใน 6
        วันจากเมืองกว่า 200,000 แห่งกันเถอะ!"
      </Typography>
    </Box>
  );

  if (todayWeather && todayForecast && weekForecast) {
    appContent = (
      <React.Fragment>
        <Grid container spacing={2}>
          {/* สภาพอากาศปัจจุบัน - เต็มความกว้าง */}
          <Grid item xs={12}>
            <Box
              sx={{
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '15px',
                marginLeft: '15px',
                p: 2,
                mb: 2,
              }}
            >
              <TodayWeather data={todayWeather} forecastList={todayForecast} />
            </Box>
          </Grid>
  
          {/* พยากรณ์อากาศรายชั่วโมง - เต็มความกว้าง */}
          {hourlyForecast && (
            <Grid item xs={12}>
              <Box
                sx={{
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  borderRadius: '15px',
                  marginLeft: '15px',
                  p: 2
                }}
              >
                <Typography
                  sx={{
                    color: 'white',
                    fontSize: { xs: '16px', sm: '18px' },
                    fontWeight: 500,
                    mb: 0,
                    pl: 2
                  }}
                >
                </Typography>
                <Box 
                  sx={{
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': {
                      height: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(255,255,255,0.3)',
                      borderRadius: '4px',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.4)',
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      pb: 1,
                      pl: 2,
                      pr: 2
                    }}
                  >
                    <HourlyForecast data={hourlyForecast} />
                  </Box>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </React.Fragment>
    );
  }
  
  if (error) {
    appContent = (
      <ErrorBox
        margin="3rem auto"
        flex="inherit"
        errorMessage="Something went wrong"
      />
    );
  }

  if (isLoading) {
    appContent = (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          minHeight: "500px",
        }}
      >
        <LoadingBox value="1">
          <Typography
            variant="h3"
            component="h3"
            sx={{
              fontSize: { xs: "10px", sm: "12px" },
              color: "rgba(255, 255, 255, .8)",
              lineHeight: 1,
              fontFamily: "Poppins",
            }}
          >
            กำลังโหลด โปรดรอสักครู่...
          </Typography>
        </LoadingBox>
      </Box>
    );
  }

  return (
    <Container
      sx={{
        maxWidth: { xs: "95%", sm: "80%", md: "1100px" },
        width: "100%",
        height: "100%",
        margin: "1% auto",
        padding: "1rem 0 3rem",
        marginBottom: "0rem",
        borderRadius: {
          xs: "none",
          sm: "7rem 7rem 7rem 7rem",
        },
        boxShadow: {
          xs: "none",
          sm: "rgba(0,0,0, 0.5) 0px 10px 15px -3px, rgba(0,0,0, 0.5) 0px 4px 6px -2px",
        },
      }}
    >
      <Grid container columnSpacing={2}>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              width: "100%",
              marginBottom: "1rem",
            }}
          >
            <Box
              component="img"
              sx={{
                height: {
                  xs: isHovered ? "32px" : "16px",
                  sm: isHovered ? "44px" : "22px",
                  md: isHovered ? "200px" : "180px",
                },
                width: "auto",
                transition: "height 0.3s ease",
                margin: "0 auto",
              }}
              alt="logo"
              src={Logo}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />

            <Box display="flex" alignItems="center">
              <Link
                onClick={handleDialogOpen}
                sx={{ display: "flex" }}
              >
                <GitHubIcon
                  sx={{
                    fontSize: { xs: "20px", sm: "22px", md: "26px" },
                    color: "white",
                    "&:hover": { color: "#2d95bd" },
                  }}
                />
              </Link>
            </Box>
          </Box>

          <Box display="flex" justifyContent="center">
            <UTCDatetime />
          </Box>
          <Search onSearchChange={searchChangeHandler} />
          <Box mb={2} /> {/* เพิ่มช่องว่างด้านล่าง */}
        </Grid>
        {appContent}
      </Grid>











      {/* Full-Screen Dialog */}
      <Dialog
        fullScreen
        open={openDialog}
        onClose={handleDialogClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleDialogClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Moodeng Weather Forecast
            </Typography>
            <Button autoFocus color="inherit" onClick={handleDialogClose}>
              Close
            </Button>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            padding: 5,
          }}
        >
          <Typography variant="h8" component="div">
            Moodeng Weather Forecast เป็นโปรเจคสำหรับรายวิชา CT648
            วิศวกรรมเว็บและคลาวด์ โดยใช้งานสำหรับการพยากรณ์อากาศโดยหมูเด้ง UI
            จากเมืองต่างๆ มากกว่า 200,000 เมือง
          </Typography>
          <Typography variant="h6" sx={{ marginTop: 5 }}>
            Organizer
          </Typography>

          {/* Add the List below */}
          <List
            sx={{
              width: "100%",
              maxWidth: 460,
              bgcolor: "background.paper",
              marginTop: 0,
            }}
          >
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  alt="DPU"
                  src="./src/assets/icons/CITE.png"
                  sx={{
                    width: 70,
                    height: 70,
                    marginTop: -2,
                    marginRight: 2,
                  }}
                  imgProps={{
                    style: {
                      objectFit: "contain",
                      width: "100%",
                      height: "100%",
                    },
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Link
                    href="https://cite.dpu.ac.th/"
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                    sx={{ color: "inherit", textDecoration: "none" }}
                  >
                    College of Engineering and Technology
                  </Link>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: "text.primary", display: "inline" }}
                    >
                      Dhurakij Pundit University | DPU
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />

            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  alt="Chaiyaporn Khemapatapan"
                  src="./src/assets/icons/DR.png"
                  sx={{
                    width: 70, // ขนาดของ Avatar
                    height: 70,
                    marginTop: -2,
                    marginRight: 2,
                  }}
                  imgProps={{
                    style: {
                      objectFit: "contain", // ปรับให้ภาพอยู่ภายในกรอบ Avatar โดยไม่ล้น
                      width: "100%", // ขนาดของภาพภายใน Avatar
                      height: "100%",
                    },
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Link
                    href="https://cite.dpu.ac.th/ResumeDean.html"
                    target="_blank" // เปิดลิงก์ในแท็บใหม่
                    rel="noopener noreferrer" // ความปลอดภัยเพิ่มเติม
                    color="inherit" // ใช้สีเดียวกับข้อความปกติ
                    underline="hover" // เส้นใต้เมื่อนำเมาส์ไปวาง
                  >
                    Chaiyaporn Khemapatapan
                  </Link>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: "text.primary", display: "inline" }}
                    >
                      Director and Program Lecturer
                    </Typography>
                    {" - Advisor "}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem alignItems="flex-start">
              <Avatar
                alt="Pichit  Thongdom"
                src="./src/assets/icons/Pichit.png"
                sx={{
                  width: 70, // ขนาดของ Avatar
                  height: 70,
                  marginTop: 0.3,
                  marginRight: 2,
                }}
                imgProps={{
                  style: {
                    objectFit: "contain", // ปรับให้ภาพอยู่ภายในกรอบ Avatar โดยไม่ล้น
                    width: "100%", // ขนาดของภาพภายใน Avatar
                    height: "100%",
                  },
                }}
              />
              <ListItemText
                primary="Mr. Pichit  Thongdom"
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: "text.primary", display: "inline" }}
                    >
                      M.Eng (Computer Engineering), CT66
                    </Typography>
                    {" —  Web Developer"}
                  </React.Fragment>
                }
              />
            </ListItem>
          </List>

          {/* GitHub Repository Link at the right end */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              marginTop: 1.8,
              marginLeft: 2.0,
            }}
          >
            <Link
              href="https://github.com/Pichit007/Weather"
              target="_blank"
              sx={{ display: "inline-flex" }}
            >
              <GitHubIcon
                sx={{
                  fontSize: 80,
                  color: "#2d95bd",
                  marginRight: 1.3,
                  marginTop: -2,
                }}
              />
              GitHub Repository <br />
              Pichit007/Weather
            </Link>
          </Box>

          <Box
            sx={{
              padding: 0,
              marginTop: 5,
            }}
          >
            <Typography variant="h6" component="div">
              Topology Moodeng Weather Forecast
            </Typography>
            <Box
              component="img"
              alt="Topology"
              src="./src/assets/icons/Topology.png"
              sx={{
                width: 1024,
                height: 500,
                borderRadius: "0%",
                marginRight: 2,
                marginLeft: 1,
              }}
            ></Box>
            <Typography variant="h6" component="div">
              Development Principles
            </Typography>
            <Typography
              variant="h8"
              component="div"
              sx={{
                marginTop: 5,
              }}
            >
              <strong>1.1 เทคโนโลยีที่ใช้</strong>
              <ul>
                <li>Bun: สำหรับเป็น JavaScript runtime</li>
                <li>React: สำหรับเป็นตัวจัดการในส่วนของ frontend</li>
                <li>Express: สำหรับเป็นตัวจัดการในส่วนของ Backend</li>
                <li>SQLite: สำหรับเป็นตัวจัดเก็บ Database</li>
              </ul>

              <strong>1.2 แนวทางในการพัฒนา</strong>
              <ul>
                <li>แสดงสภาพอากาศปัจจุบัน</li>
                <li>แสดงสภาพอากาศโดยรวม</li>
                <li>แสดงการพยากรณ์ เป็นแต่ละช่วงเวลาของวัน</li>
                <li>แสดงพยากรณ์รายสัปดาห์</li>
              </ul>
            </Typography>
            <strong>การแสดงผลของ frontend</strong>
            <br />
            <Typography
              variant="h8"
              component="div"
              sx={{
                marginTop: 2,
                marginLeft: 2,
                lineHeight: 1.8,
              }}
            >
              1.
              ต้องแสดงผลเพื่อเลือกเมืองที่ต้องการตรวจสอบสภาพอากาศและพยากรณ์อากาศ{" "}
              <br />
              2. เมื่อเลือกเมืองแล้วจะดึง API latitude และ longitude
              ของเมืองนั้น ซึ่งต้องได้ข้อมูลดังต่อไปนี้
              <br />
              - lat : 13.8701 <br />- lon : 100.5161
            </Typography>
            <Box display="flex" alignItems="center">
              <Box
                component="img"
                alt="Pichit Thongdom"
                src="./src/assets/icons/1r.png"
                sx={{
                  width: 630,
                  height: 500,
                  borderRadius: "0%",
                  marginRight: 2,
                }}
              />
            </Box>
            <Typography
              variant="h8"
              component="div"
              sx={{
                marginTop: 2,
                marginLeft: 2,
                lineHeight: 1.8,
              }}
            >
              3. แสดงผลสภาพอากาศโดยนำเอา API ที่ได้จาก latitude และ longitude
              ไปส่งค่าเป็น parameter ให้กับ API ดึงข้อมูลสภาพอากาศ
              ซึ่งต้องได้ข้อมูลดังต่อไปนี้
              <ul>
                <li>feels_like : 33.84</li>
                <li>grnd_level : 1008</li>
                <li>humidity : 48</li>
                <li>pressure : 1009</li>
                <li>sea_level : 1009</li>
                <li>temp : 31.97</li>
                <li>temp_max : 31.97</li>
                <li>temp_min : 31.97</li>
                <li>name : "Nonthaburi"</li>
              </ul>
              <Box display="flex" alignItems="center">
                <Box
                  component="img"
                  alt="Pichit Thongdom"
                  src="./src/assets/icons/2r.png"
                  sx={{
                    width: 640,
                    height: 800,
                    borderRadius: "0%",
                    marginRight: 2,
                  }}
                />
              </Box>
              <br />
              4. ส่งข้อมูลไปเก็บยัง Database SQLite TABLE name "weather_data"
            </Typography>
            <Typography
              variant="h6"
              component="div"
              sx={{
                marginTop: 1,
              }}
            >
              <br />
              การเก็บข้อมูลลง Database SQLite
            </Typography>
            <br />
            <Box
              component="img"
              alt="Table1"
              src="./src/assets/icons/t1.png"
              sx={{
                width: 500,
                height: 450,
                borderRadius: "0%",
                marginRight: 2,
              }}
            ></Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                marginTop: 1,
              }}
            >
              <br />
              การทำงานของ Backend
            </Typography>
            <br />{" "}
            <Box
              component="img"
              alt="Table1"
              src="./src/assets/icons/t2.png"
              sx={{
                width: 500,
                height: 450,
                borderRadius: "0%",
                marginRight: 2,
              }}
            ></Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                marginTop: 1,
              }}
            >
              <br />
              API Reference
            </Typography>
            <br />{" "}
            <Box
              component="img"
              alt="API"
              src="./src/assets/icons/a1.png"
              sx={{
                width: 700,
                height: 550,
                borderRadius: "0%",
                marginRight: 2,
              }}
            ></Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                marginTop: 1,
              }}
            >
              <br />
              Deployment
              <br />
              <br />
              Run project
            </Typography>
            <Typography
              variant="h8"
              component="div"
              sx={{
                marginLeft: 3,
                marginTop: 2,
              }}
            >
              bun run project
            </Typography>
            <Typography
              variant="h6"
              component="div"
              sx={{
                marginTop: 1,
              }}
            >
              <br />
              Install dependencies (Frontend)
              <br />
            </Typography>
            <br />{" "}
            <Box
              component="img"
              alt="Dependenci"
              src="./src/assets/icons/a2.png"
              sx={{
                width: 700,
                height: 750,
                borderRadius: "10%",
                marginRight: 2,
              }}
            ></Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                marginTop: 1,
              }}
            >
              <br />
              Install dependencies (Backend)
              <br />
            </Typography>
            <br />{" "}
            <Box
              component="img"
              alt="Dependenci"
              src="./src/assets/icons/a3.png"
              sx={{
                width: 400,
                height: 175,
                borderRadius: "10%",
                marginRight: 2,
              }}
            ></Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                marginTop: 1,
              }}
            >
              <br />
              Port
            </Typography>
            <Typography
              variant="h8"
              component="div"
              sx={{
                marginTop: 1,
                marginLeft: 3,
              }}
            >
              Port = 3000 (Frontend) using axios <br />
              Port = 3001 (Backend) using express
            </Typography>
            <Typography
              variant="h6"
              component="div"
              sx={{
                marginTop: 1,
              }}
            >
              <br />
              Build Dockerfile
            </Typography>
            <Typography
              variant="h8"
              component="div"
              sx={{
                marginTop: 3,
                marginLeft: 3,
              }}
            >
              FROM oven/bun AS frontend <br />
              <br />
              WORKDIR /app/frontend <br />
              <br />
              COPY weather-moodeng/package.json ./ <br />
              <br />
              RUN bun install <br />
              <br />
              COPY weather-moodeng/ . <br />
              <br />
              RUN bun run build <br />
              <br />
              FROM oven/bun AS backend <br />
              <br />
              WORKDIR /app <br />
              <br />
              COPY backend/package.json ./ <br />
              <br />
              RUN bun install --production <br />
              <br />
              COPY backend/ . <br />
              <br />
              COPY --from=frontend /app/frontend/dist ./public <br />
              <br />
              EXPOSE 3001 <br />
              <br />
              CMD ["bun", "server.js"]
            </Typography>
            <Typography
              variant="h6"
              component="div"
              sx={{
                marginTop: 1,
              }}
            >
              <br />
              Build docker-compose
            </Typography>
            <br />{" "}
            <Box
              component="img"
              alt="Dependenci"
              src="./src/assets/icons/a4.png"
              sx={{
                width: 300,
                height: 190,
                borderRadius: "10%",
                marginRight: 2,
              }}
            ></Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                marginTop: 1,
              }}
            >
              <br />
              AWS VM Ubuntu
            </Typography>
            <Typography
              variant="h8"
              component="div"
              sx={{
                marginTop: 2,
                marginLeft: 3,
              }}
            >
              Install docker.io <br />
              Install docker-compose git pull
              <br />
              https://github.com/Pichit007/Weather.git <br />
              sudo docker-compose up
            </Typography>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
}

export default App;
