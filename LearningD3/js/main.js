
Promise.all([
    d3.csv('data/contry_code.csv'),
]).then(function (file) {
    console.log(file[0]);
    let code = file[0].map(element=>[element["Country Code"],element["TableName"]]);
    console.log(code);
    // Bao.data.values = [];
    // Bao.data.label = [];
    // Bao.data.label = file[0].columns;
    // Bao.data.group = true;
    // file[0].forEach((element,index)=>{
    //     Bao.data.values[index] = [];
    //     for (let i = 0; i < Bao.data.label.length; i++) {
    //         if (Bao.data.group)
    //             Bao.data.values[index][i] = (i < Bao.data.label.length - 1) ? +element[Bao.data.label[i]] : element[Bao.data.label[i]];
    //         else
    //             Bao.data.values[index][i] = +element[Bao.data.label[i]];
    //     }
    // });
    // // remove randomly
    // // myRemove(1590);
    //
    // let dataDraw = new myDraw(Bao.data.values,Bao.data.group,Bao.data.label,'myDiv');
    // dataDraw.drawSPLOM('Scatterplot matrix of Iris dataset');
    // let dataDR = new DR(Bao.data.values,true);
    // let dataPCA = dataDR.computePCA();
    // let pcaDraw = new myDraw(dataPCA.result,true,[],'myDiv2');
    // pcaDraw.drawScatterplot('PCA of Iris dataset');
    // let pcaHis = new myDraw(dataPCA.information,true,[],'myDiv3');
    // pcaHis.drawBarChart('PCA percentage of variance');
    // let dataSPCA = dataDR.computeSupervisedPCA();
    // let spcaDraw = new myDraw(dataSPCA.result,true,[],'myDiv4');
    // spcaDraw.drawScatterplot('SPCA of Iris dataset');
    // let spcaHis = new myDraw(dataSPCA.information,true,[],'myDiv5');
    // spcaHis.drawBarChart('SPCA percentage of variance');
    // let dataKPCA  = dataDR.computeKernelPCA('Hyperbolic',0);
    // let kpcaDraw = new myDraw(dataKPCA.result,true,[],'myDiv6');
    // kpcaDraw.drawScatterplot('Kernel PCA of Iris dataset');
    // let kpcaHis = new myDraw(dataKPCA.information,true,[],'myDiv7');
    // kpcaHis.drawBarChart('KPCA percentage of variance');
    // let dataISOMAP = dataDR.computeISOMAP(5);
    // let isomapDraw = new myDraw(dataISOMAP.result,true,[],'myDIv4');
    // isomapDraw.drawScatterplot('ISOMAP of Swiss Roll dataset');
});

function myRemove(times) {
    for (let i = 0; i < times; i++) {
        let index = Math.floor(Math.random()*Bao.data.values.length);
        Bao.data.values.splice(index,1);
    }
}