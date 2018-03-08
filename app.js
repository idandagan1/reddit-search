import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import routes from './src/index';

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/'));

app.use('/query', routes);

app.use((err, req, res, next) => {
    console.error(err);
    return res.status(500).send({ msg: 'somthing went wrong..' });
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

module.exports = app;
