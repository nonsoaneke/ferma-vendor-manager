function prepareFileData(data) {
    let result = data.toString();
    return JSON.parse(result);
}

module.exports = {
    prepareFileData
}