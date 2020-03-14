Promise.all([
    d3.csv('data/male.txt'),
    d3.csv('data/female.txt'),
    d3.csv('data/country_code.csv')
]).then(function(file){
    let map = new Map();
    file[1].forEach((element,index)=>{
        if (!map.get(element.code)) map.set(element.code,index);
    });
    Bao.myData = [];
    Bao.myData[0] = [];
    Bao.myData[0].push('Series ID');
    for (let year = 1991; year < 2020; year++) {
        for (let q = 1; q < 5; q++) {
            Bao.myData[0].push(','+'Q'+q+' '+year);
        }
    }
    for (let i = 0; i < file[1].length; i++) {
        Bao.myData[i+1] = [];
    }
    let changeState = false;
    file[0].forEach((element,index)=>{
        if (index) changeState = element.state !== file[0][index - 1];
        let sampleCode = map.get(element.state);
        let timeCode = 'Q'+element.qtr+' '+element.yr;
        let value = element.index_sa;
        if (changeState) {
            Bao.myData[sampleCode+1][0] = '0_'+sampleCode.toString();
            Bao.myData[sampleCode+1].push(value);
        } else {
            Bao.myData[sampleCode+1].push(value);
        }
    });
});