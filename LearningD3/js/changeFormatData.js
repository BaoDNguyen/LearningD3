Promise.all([
    d3.csv('data/#establish.txt'),
    d3.csv('data/stateCode.txt'),
    d3.csv('data/sectors_code.txt'),
]).then(function(file){
    let stateArr = [], sectorArr = [];
    for (let row = 0; row < file[1].length; row++) {
        stateArr[row] = [file[1][row].code,file[1][row].name];
    }
    for (let row = 0; row < file[2].length; row++) {
        sectorArr[row] = [file[2][row].code,file[2][row].name];
    }
    
});