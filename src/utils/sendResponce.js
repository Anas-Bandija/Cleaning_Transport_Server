const sendResponce = (res, status, data, error, message) => {
    return res.status(status).send({ data, error, message })
}

export { sendResponce }