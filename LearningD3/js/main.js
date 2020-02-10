Promise.all([
    d3.csv('data/Iris_data_set.txt'),
]).then(function (file) {
    Bao.data.values = [];
    Bao.data.label = [];
    Bao.data.label = file[0].columns;
    Bao.data.group = true;
    file[0].forEach((element,index)=>{
        Bao.data.values[index] = [];
        for (let i = 0; i < Bao.data.label.length; i++) {
            if (Bao.data.group)
                Bao.data.values[index][i] = (i < Bao.data.label.length - 1) ? +element[Bao.data.label[i]] : element[Bao.data.label[i]];
            else
                Bao.data.values[index][i] = +element[Bao.data.label[i]];
        }
    });
    let dataDraw = new myDraw(Bao.data.values,Bao.data.group,Bao.data.label,'myDiv');
    dataDraw.drawSPLOM();
    let dataDR = new DR(Bao.data.values);
    let dataPCA = dataDR.computePCA();
    let pcaDraw = new myDraw(dataPCA.result,,,,dataPCA.information);
});