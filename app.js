import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/'));

module.exports = app;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});