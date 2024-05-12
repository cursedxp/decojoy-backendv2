import { auth, router } from "../config/index.js";

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: `../../${process.env.AUTH0_SECRET}`,
  baseURL: "http://localhost:3000/",
  clientID: "rfzcUeFq5mwmX8wmXtA9YsXG3Tp1rx38",
  issuerBaseURL: "https://dev-ktd8rhv6yul44w8c.eu.auth0.com",
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
router.use(auth(config));

// req.isAuthenticated is provided from the auth router
router.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

export default router;
