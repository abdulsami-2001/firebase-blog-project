export const generateKey = (title) => {
    let stringWithSpace = `${new Date().getTime()}___${(title).substring(0, 10)}`
    return stringWithSpace.replace(/ /g, '_');
}

