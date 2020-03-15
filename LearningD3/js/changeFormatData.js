Promise.all([
    d3.csv('data/male.csv'),
    d3.csv('data/female.csv'),
    d3.csv('data/country_code.csv'),
]).then(function(file){
    Bao.myData = {data: [], code: []};
    Bao.myData.code[0] = ['code','name'];
    for (let row = 0; row < file[2].length; row++) {
        let countryCode = file[2][row]['Country Code'];
        let tableName = file[2][row]['TableName'];
        Bao.myData.code[row+1] = [row,tableName];
    }
    Bao.myData.data[0] = [];
    Bao.myData.data[0].push('Series ID');
    for (let year = 1960; year < 2020; year++) {
        Bao.myData.data[0].push(year.toString());
    }
    let rowIndex = 1;
    for (let row = 0; row < file[0].length; row++) {
        let instance = file[0][row]['Country Name'];
        let variable = file[0][row]['Gender'] === 'male' ? 0 : 1;
        let index = Bao.myData.code.findIndex(element=>element[1]===instance);
        if (index!==-1) {
            Bao.myData.data[rowIndex] = [];
            Bao.myData.data[rowIndex].push((index-1).toString()+'_'+variable.toString());
            for (let year = 1960; year < 2020; year++) {
                Bao.myData.data[rowIndex].push(file[0][row][year.toString()]);
            }
            rowIndex += 1;
        }
    }
    console.log(file);
});