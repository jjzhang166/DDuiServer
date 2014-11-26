
/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , movie = require('./routes/movie')
    , http = require('http')
    , path = require('path')
    , ejs = require('ejs')
    , SessionStore = require("session-mongoose")(express);

var store = new SessionStore({
    url: "mongodb://localhost/session",
    interval: 120000 // expiration check worker run interval in millisec (default: 60000)
});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');// app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.cookieSession({secret : 'blog.qtclub.me'}));
app.use(express.session({
    secret : 'blog.qtclub.me',
    store: store,
    cookie: { maxAge: 100000 } // expire session in 15 min or 900 seconds
}));
app.use(function(req, res, next){
    res.locals.user = req.session.user;
    var err = req.session.error;
    delete req.session.error;
    res.locals.message = '';
    if (err) res.locals.message = '<div class="alert alert-error">' + err + '</div>';
    next();
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//basic


app.post('/fuck',function(req,res)
{
    console.log("fuck status "+req.body.username);
    res.send(req.body.username);
});

//mongo
app.get('/movie/add',movie.movieAdd);
app.post('/movie/add',movie.doMovieAdd);
app.get('/movie/:name',movie.movieAdd);
app.get('/movie/json/:name',movie.movieJSON);



app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});