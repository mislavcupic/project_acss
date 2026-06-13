const jsonServer = require("json-server");
const fs = require("fs");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const server = jsonServer.create();
server.use(cors());
const router = jsonServer.router(require("./db.js")());
server.use(cors());

const lowdb = router.db;
const dbUsers = () => lowdb.get("User");

const middlewares = jsonServer.defaults();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

function isAuthenticated({ email, password }) {
  return !!dbUsers()
    .find((u) => u.email == email && u.password == password)
    .value();
}

const SECRET_KEY = "123456789";
const expiresIn = "1h";
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

server.post("/auth/login", (req, res) => {
  console.log("POST /auth/login");
  const { email, password } = req.body;
  // Promjena: dohvat korisnika iz baze
  const user = dbUsers().find((u) => u.email == email && u.password == password).value();
  if (!user) {
    const status = 401;
    const respJson = { status: status, message: "Incorrect email or password" };
    res.status(status).json(respJson);
    return;
  }
  // Promjena: rola u tokenu
  const access_token = createToken({ email: user.email, role: user.role });
  res.status(200).json({ access_token });
});

server.post("/auth/register", (req, res) => {
  console.log("POST /auth/register");
  const resource = dbUsers().insert(req.body).value();
  const status = 200;
  res.status(status).json(resource);
});

function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY, (err, decode) =>
    decode !== undefined ? decode : err
  );
}

// OVO JE SVE ŠTO JE OSTALO OD MIDDLEWARE-A
server.use(/^(?!\/auth).*$/, (req, res, next) => {
  // Ako je GET, pusti anonimnog korisnika
  if (req.method === 'GET') {
    next();
    return;
  }

  // Ako nije GET, traži token (ovo štiti POST, PUT, DELETE)
  if (
    req.headers.authorization === undefined ||
    req.headers.authorization.split(" ")[0] !== "Bearer"
  ) {
    const status = 401;
    res.status(status).json({ status, message: "Bad authorization header" });
    return;
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, SECRET_KEY, (err, decode) => {
      if (err) return res.status(401).json({ error: err.message });
      next();
    });
  } catch (err) {
    res.status(401).json({ status: 401, message: "Error" });
  }
});

server.use(middlewares);
server.use(router); // OVO MORA BITI NA KRAJU!

server.listen(3000, () => {
  console.log("JSON Server is running");
});