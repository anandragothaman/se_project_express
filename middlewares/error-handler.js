const errorHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(
    `Error ${err.name} with the message ${err.message} has occurred while executing the code`
  );
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message:
      statusCode === 500 ? "An error has occurred on the server." : message,
  });
  next();
};

module.exports = errorHandler;
