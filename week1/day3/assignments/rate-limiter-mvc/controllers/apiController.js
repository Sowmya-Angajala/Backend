
export const publicHandler = (req, res) => {
  res.json({ message: "This is a public endpoint!" });
};

export const limitedHandler = (req, res) => {
  res.json({ message: "You have access to this limited endpoint!" });
};
