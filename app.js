const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');


const dotenv = require('dotenv');
const passport = require('passport');
const passportConfig= require('./passport');
const path = require('path');
const nunjucks = require('nunjucks');
const {sequelize} = require('./models');

const mapRouter = require('./routes/map');
const petMedicineRouter = require('./routes/petMedicine');
const petWalkRouter = require('./routes/petWalk');
const petHealthInfoRouter = require('./routes/petHealthInfo');
const petRouter = require('./routes/pet');
const memberRouter = require('./routes/member');


dotenv.config();
passportConfig();

const app = express();

app.set('port', process.env.PORT || 3000);

app.set('view engine', 'html');
nunjucks.configure(path.join(__dirname, 'views'), {
    express: app,
    watch: true
});


sequelize.sync({ force: false })
    .then(() => console.log("DB 연결 성공"))
    .catch(err => console.error(err));

app.use(
    morgan('dev'), //요청이 왔을 때 log를 찍어줌
    express.json(), // json 내용을 분석
    express.urlencoded({extended: false}), //url 파싱
    cookieParser(process.env.SECRET), //쿠키(매개변수로 비밀키)
    session({
        resave: false,
        saveUninitialized: false,
        secret:process.env.SECRET,
        cookie:{
            httpOnly: true,
            secure: false
        },
        name: 'session-cookie'
    }),
    passport.initialize(),
    passport.session()
);


app.use('/map', mapRouter);
app.use('/petmedicine', petMedicineRouter);
app.use('/petwalk', petWalkRouter);
app.use('/pethealth', petHealthInfoRouter);
app.use('/pet', petRouter);
app.use('/member', memberRouter);


app.use((req, res, next) => {
    res.locals.title = require('./package.json').name;
    res.locals.port = app.get('port');
    res.locals.isAuthenticated = req.isAuthenticated(); //로그인이 되었는지 안됬는지
    res.render('main');
});


app.use((req, res, next) => {
    console.log('404');
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});


app.use((err, req, res, next) => { //에러 처리 미들웨어(매개변수 반드시 4개), 가장 아래에 위치
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV != 'production'? err: {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => console.log(app.get('port'), '번 포트에서 대기 중'));