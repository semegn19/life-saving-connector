// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Server error';
  const errors = err.errors || (err.name === 'ValidationError' ? Object.values(err.errors || {}).map((e) => e.message) : undefined);
  return res.status(status).json({ message, ...(errors && { errors }) });
};

module.exports = errorHandler;

