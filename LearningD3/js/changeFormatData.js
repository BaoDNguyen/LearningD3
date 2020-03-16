Promise.all([
    d3.csv('data/house_price.txt'),
    d3.csv('data/us_population_1969-2017.csv'),
    d3.tsv('data/state_code.txt'),
]).then(function(file){
    let stateArr = [], variableArr = [];
    for (let row = 0; row < file[2].length; row++) {
        stateArr[row] = [file[2][row].code,file[2][row].name,row];
    }
    variableArr[0] = [0,'house price'];
    variableArr[1] = [1,'population'];
    Bao.myData.data = {housePrice: [], population: []};
    Bao.myData.data.housePrice[0] = [];
    Bao.myData.data.housePrice[0].push('Series ID');
    for (let year = 1991; year < 2018; year++) {
        Bao.myData.data.housePrice[0].push(year.toString());
    }
    let correctRow = 0;
    let instance = -1;
    let annualPrice;
    for (let row = 0; row < file[0].length; row++) {
        if (+file[0][row]['yr'] < 2018) {
            let lastInstance = instance;
            instance = stateArr.findIndex(element=>element[0]===file[0][row].state);
            let variable = 0;
            let seriesID = instance.toString()+'_'+variable.toString();
            if (row%4===0) annualPrice = +file[0][row]['index_sa'];
            else if (row%4===3) {
                annualPrice += +file[0][row]['index_sa'];
                annualPrice /= 4;
            } else annualPrice += +file[0][row]['index_sa'];
            if (instance!==lastInstance) {
                correctRow += 1;
                Bao.myData.data.housePrice[correctRow] = [];
                Bao.myData.data.housePrice[correctRow].push(seriesID);
            } else {
                if (row%4===3) Bao.myData.data.housePrice[correctRow].push(annualPrice);
            }
        }
    }
    Bao.myData.data.population[0] = [];
    Bao.myData.data.population[0].push('Series ID');
    for (let year = 1991; year < 2018; year++) {
        Bao.myData.data.population[0].push(year.toString());
    }
    correctRow = 0;
    for (let row = 0; row < file[1].length; row++) {
        let instance = stateArr.findIndex(element=>element[0]===file[1][row]['State']);
        let variable = 1;
        let seriesID = instance.toString()+'_'+variable.toString();
        if (+file[1][row]['Year'] > 1990) {
                if (+file[1][row]['Year'] === 1991) {
                    correctRow += 1;
                    Bao.myData.data.population[correctRow] = [];
                    Bao.myData.data.population[correctRow].push(seriesID);
                    Bao.myData.data.population[correctRow].push(file[1][row]['Population']);
                } else Bao.myData.data.population[correctRow].push(file[1][row]['Population']);
        }
    }
});