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
    for (let row = 0; row < file[0].length; row++) {
        let instance = file[0][row]['Series ID'].substr(3,2);
        let variable = file[0][row]['Series ID'].substr(11,4);
        let instanceIndex = stateArr.findIndex(element=>element[0]===instance);
        let variableIndex = sectorArr.findIndex(element=>element[0]===variable);
        let seriesID = instanceIndex.toString()+'_'+variableIndex.toString();
        
    }
});