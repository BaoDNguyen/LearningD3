
Promise.all([
    d3.tsv('data/SwissRollDataset.txt'),
]).then(function (file) {
    Bao.data.values = [];
    Bao.data.label = [];
    Bao.data.label = file[0].columns;
    Bao.data.group = false;
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
    dataDraw.drawSPLOM('Scatterplot matrix of Iris dataset');
    let dataDR = new DR(Bao.data.values,false);
    let dataPCA = dataDR.computePCA();
    let pcaDraw = new myDraw(dataPCA.result,false,[],'myDiv2');
    pcaDraw.drawScatterplot('PCA of Iris dataset');
    let pcaHis = new myDraw(dataPCA.information,false,[],'myDiv3');
    pcaHis.drawBarChart('PCA percentage of variance');
    // let dataSPCA = dataDR.computeSupervisedPCA();
    // let spcaDraw = new myDraw(dataSPCA.result,false,[],'myDiv4');
    // spcaDraw.drawScatterplot('SPCA of Iris dataset');
    // let spcaHis = new myDraw(dataSPCA.information,false,[],'myDiv5');
    // spcaHis.drawBarChart('SPCA percentage of variance');
    // let dataKPCA  = dataDR.computeKernelPCA('Hyperbolic',1);
    // let kpcaDraw = new myDraw(dataKPCA.result,false,[],'myDiv6');
    // kpcaDraw.drawScatterplot('Kernel PCA of Iris dataset');
    // let kpcaHis = new myDraw(dataKPCA.information,false,[],'myDiv7');
    // kpcaHis.drawBarChart('KPCA percentage of variance');
    let dataISOMAP = dataDR.computeISOMAP(10);
    let isomapDraw = new myDraw(dataISOMAP.result,false,[],'myDIv4');
    isomapDraw.drawScatterplot('ISOMAP of Swiss Roll dataset');
});