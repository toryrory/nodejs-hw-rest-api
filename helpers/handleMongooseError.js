const handleMongooseError = (error, data, next) => { // мидлвар(сработает при ошибке валидации) если при попытке сохранения данных будет ошибка, в еррор будет написано какая ошибка, в данных будут данные которые не смогли добавить 
    error.status = 400;
    next();
}

module.exports = handleMongooseError;