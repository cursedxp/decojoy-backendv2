const roleAuth = (roles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(403).json({ message: "No role specified" });
    }

    if (roles.includes(req.userRole)) {
      next();
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  };
};

export default roleAuth;
