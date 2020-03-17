Promise.all([
    d3.csv('data/house_price.txt'),
    d3.csv('data/Financial_activities.txt'),
    d3.tsv('data/stateCode.txt'),
    d3.tsv('data/state_code.txt'),
]).then(function(file){
    let stateArr1 = [];
    for (let row = 0; row < file[2].length; row++) {
        stateArr1[row] = [file[2][row].code,file[2][row].name];
    }
    let stateArr2 = [];
    for (let row = 0; row < file[3].length; row++) {
        stateArr2[row] = [file[3][row].code,file[3][row].name];
    }
    Bao.myData.data = {housePrice: [], financial: []};
    Bao.myData.data.housePrice[0] = [];
    Bao.myData.data.housePrice[0].push('Series ID');
    for (let year = 1991; year < 2020; year++) {
        for (let q = 1; q < 5; q++) {
            Bao.myData.data.housePrice[0].push('Q'+q.toString()+' '+year.toString());
        }
    }
    let lastState;
    let instance = '';
    let correctRow = 0;
    for (let row = 0; row < file[0].length; row++) {
        lastState = instance;
        instance = stateArr2.findIndex(element=>element[0]===file[0][row]['state']);
        let variable = 0;
        let seriesID = instance.toString()+'_'+variable.toString();
        if (lastState !== instance) {
            correctRow += 1;
            Bao.myData.data.housePrice[correctRow] = [];
            Bao.myData.data.housePrice[correctRow].push(seriesID);
            Bao.myData.data.housePrice[correctRow].push(file[0][row]['index_sa']);
        } else {
            Bao.myData.data.housePrice[correctRow].push(file[0][row]['index_sa']);
        }
    }

    let month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    for (let row = 0; row < file[1].length; row++) {
        let state = file[1][row]['Series ID'].substr(3,2);
        instance = stateArr1.findIndex(element=>element[0]===state);
        let seriesID = instance.toString()+'_1';
        Bao.myData.data.financial[row] = [];
        Bao.myData.data.financial[row].push(seriesID);
        for (let year = 1991; year < 2020; year++) {
            for (let m = 0; m < 12; m++) {
                let time = month[m]+' '+year.toString();
                let qValue = 0;
                if (m%3===0) {
                    qValue = 0;
                    qValue += +file[1][row][time];
                } else if (m%3===2) {
                    qValue += +file[1][row][time];
                    qValue /= 3;
                    Bao.myData.data.financial[row].push(file[1][row][time]);
                } else {
                    qValue += +file[1][row][time];
                }
            }
        }
    }
});