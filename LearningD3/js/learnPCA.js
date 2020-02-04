Bao.linearAlgebra = new Lalolab('labname',false,'lib/lalolib');

Promise.all([
    d3.csv('data/Iris_data_set.txt')
]).then(function (file) {
    // build input matries
    let name = file[0].columns;
    let nVar = name.length-1;
    let nTrain = file[0].length;
    let nGroup = 3;
    let groupName = [];
    console.log(groupName);
    let dataArr = [];
    for (let i = 0; i <= nVar; i++) {
        dataArr[i] = [];
    }
    file[0].forEach((element,index)=>{
        for (let i = 0; i <= nVar; i++) {
            dataArr[i][index] = element[name[i]];
        }
        if(index < file[0].length-1) {
            if (element[name[nVar]] !== file[0][index+1][name[nVar]]) groupName.push(element[name[nVar]]);
        } else {
            groupName.push(element[name[nVar]]);
        }
    });
    // data array
    let xArr = [];
    dataArr.forEach((element,index)=>{
        if (index !== dataArr.length-1) {
            xArr[index] = [];
            element.forEach((element_,index_)=>{
                xArr[index][index_] = +element_;
            });
        }
    });
    let X = array2mat(xArr);
    // label array
    let lArr = [];
    for (let i = 0; i < dataArr[0].length; i++) {
        lArr[i] = [];
        for (let j = 0; j < dataArr[0].length; j++) {
            lArr[i][j] = (dataArr[nVar][i] === dataArr[nVar][j]) ? 1 : 0;
        }
    }
    let L = array2mat(lArr);
    // centering matrix
    let hArr = [];
    for (let i = 0; i < dataArr[0].length; i++) {
        hArr[i] = [];
        for (let j = 0; j < dataArr[0].length; j++) {
            if (i===j) hArr[i][j] = 1 - 1/nTrain;
            else hArr[i][j] = -1/nTrain;
        }
    }
    let H = array2mat(hArr);
    let Q = mul(X,mul(H,mul(L,mul(H,transpose(X)))));
    // find eigenvectors
    let uArr = [];
    for (let i = 0; i < 2; i++) {
        uArr[i] = [];
        for (let j = 0; j < nVar; j++) {
            uArr[i][j] = eigs(Q,2).U.val[i*nVar+j];
        }
    }
    let UT = array2mat(uArr);
    // SPCA result
    Bao.SPCA = mul(UT,X);
    // find mean of X
    let xMean = entrywisediv(sum(X,2),nTrain);
    // find variance of X
    let S = new Matrix(nVar,nVar);
    for (let i = 0; i < nTrain; i++) {
        let xIArr = [];
        for (let j = 0; j < nVar; j++) {
            xIArr[j] = get(X,j,i);
        }
        let Xi = array2vec(xIArr);
        S = add(S,mul(sub(Xi,xMean),transpose(sub(Xi,xMean))));
    }
    S = entrywisediv(S,nTrain);
    // find eigenvectors
    uArr = [];
    for (let i = 0; i < 2; i++) {
        uArr[i] = [];
        for (let j = 0; j < nVar; j++) {
            uArr[i][j] = eigs(S,2).U.val[i*nVar+j];
        }
    }
    let UT2 = array2mat(uArr);
    // PCA result
    Bao.PCA = mul(UT2,X);

    // draw results
    let dataPCA = [];
    let dataSPCA = [];
    for (let i = 0; i < nGroup; i++) {
        dataPCA[i] = {};
        dataPCA[i].mode = 'markers';
        dataPCA[i].type = 'scatter';
        dataPCA[i].name = 'Principal component ' + i;
        dataPCA[i].marker = {size: 12};
        dataPCA[i].x = [];
        dataPCA[i].y = [];
        dataSPCA[i] = {};
        dataSPCA[i].mode = 'markers';
        dataSPCA[i].type = 'scatter';
        dataSPCA[i].name = 'Principal component ' + i;
        dataSPCA[i].marker = {size: 12};
        dataSPCA[i].x = [];
        dataSPCA[i].y = [];
        let count = 0;
        for (let j = 0; j < nTrain; j++) {
            if (dataArr[nVar][j] === groupName[i]) {
                dataPCA[i].x[count] = get(Bao.PCA,0,j);
                dataPCA[i].y[count] = get(Bao.PCA,1,j);
                dataSPCA[i].x[count] = get(Bao.SPCA,0,j);
                dataSPCA[i].y[count] = get(Bao.SPCA,1,j);
                count += 1;
            }
        }
    }
    let layoutPCA = {
        xaxis: {
            range: [ min(Bao.PCA.row(0)), max(Bao.PCA.row(0)) ],
        },
        yaxis: {
            range: [min(Bao.PCA.row(1)),max(Bao.PCA.row(1))],
        },
        title:'PCA'
    };
    let layoutSPCA = {
        xaxis: {
            range: [ min(Bao.SPCA.row(0)), max(Bao.SPCA.row(0)) ],
        },
        yaxis: {
            range: [min(Bao.SPCA.row(1)),max(Bao.SPCA.row(1))],
        },
        title:'Supervised PCA'
    };
    console.log(dataArr);
    Plotly.newPlot('myDiv', dataPCA, layoutPCA);
    Plotly.newPlot('myDiv2', dataSPCA, layoutSPCA);
});
