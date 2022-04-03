const sampleHandler = (a, callback) => {
    callback(200, 300);
};

sampleHandler(700, (b, c) => {
    console.log(b + c);
});

const read = (dir, file, callback) => {
    fs.readFile('demo.txt', 'utf-8', (err, data) => {
        callback(err, data);
    });
};

read('test', 'newFile', (err, readResult) => {
    console.log(err, readResult);
});

uitilities.createRandomString = (stringlength) => {
    let length = stringlength;
    length = typeof stringlength === 'number' && stringlength > 0 ? stringlength : false;
    if (length) {
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz123456789';
        let output = '';
        for (let I = 0; I <= length; I++) {
            const randomCharacter = possibleCharacters.charAt(
                Math.floor(Math.random() * possibleCharacters.length)
            );
            output += randomCharacter;
        }
        return output;
    }
    return false;
};
