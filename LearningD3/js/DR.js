//////////////////////////////////////////////////////////////////////////////////////////////
// INPUT NAME: name of DR                                                                   //
// INPUT DATA: Array[data instance][coordinates/dimensions of instance] => Matrix NxD       //
// INPUT GROUP: group = true => last column of data is group                                //
// need to call computeDR()                                                                 //
//////////////////////////////////////////////////////////////////////////////////////////////

class DR {
    constructor(data,group) {
        this.data = data.map(element=>element.map(element_=>element_));
        this.group = group;
    }

    // COMPUTE PCA
    computePCA() {
        let D = (this.group) ? this.data[0].length - 1 : this.data[0].length;
        let N = this.data.length;
        let rawData;
        if (this.group) {                           // time: O(NxD)
            rawData = [];
            this.data.forEach((element,index)=>{
                rawData[index] = [];
                for (let i = 0; i < D; i++) {
                    rawData[index][i] = element[i];
                }
            });
        } else rawData = this.data.map(element=>element.map(element_=>element_));
        let data = DR.standardize(rawData);
        let X = array2mat(data);
        let S = DR.covarianceMatrix(X);
        let eigenMatrix = eigs(S,D);
        let eigenValues = eigenMatrix.V;
        let M = transpose(array2mat([eigenMatrix.U.val.slice(0,D),eigenMatrix.U.val.slice(D,2*D)]));
        let Y = mul(X,M);
        let y = [];
        for (let i = 0; i < N; i++) {
            y[i] = (this.group) ? [get(Y,i,0),get(Y,i,1),this.data[i][D]] : [get(Y,i,0),get(Y,i,1)];
        }
        let sum = 0;
        eigenValues.forEach(element=>sum += element);
        let SPCA = [];
        for (let i = 0; i < D; i++) {
            SPCA[i] = eigenValues[i]/sum;
        }
        return {result: y, information: SPCA};
    }

    // COMPUTE SUPERVISED PCA
    computeSupervisedPCA() {
        if (!this.group) {
            console.log('Supervised PCA needs label information!');
        } else {
            let D = this.data[0].length - 1;
            let N = this.data.length;
            let rawData = [];
            this.data.forEach((element,index)=>{
                rawData[index] = [];
                for (let i = 0; i < D; i++) {
                    rawData[index][i] = element[i];
                }
            });
            let data = DR.standardize(rawData);
            let X = array2mat(data);
            let lArr = [];
            for (let i = 0; i < N; i++) {
                lArr[i] = [];
                for (let j = 0; j < N; j++) {
                    lArr[i][j] = (this.data[i][D] === this.data[j][D]) ? 1 : 0;
                }
            }
            let L = array2mat(lArr);
            let H = sub(eye(N,N),mul(ones(N,N),1/N));
            let Q = mul(transpose(X),mul(H,mul(L,mul(H,X))));
            let eigenMatrix = eigs(Q,D);
            let eigenValues = eigenMatrix.V;
            let M = transpose(array2mat([eigenMatrix.U.val.slice(0,D),eigenMatrix.U.val.slice(D,2*D)]));
            let Y = mul(X,M);
            let y = [];
            for (let i = 0; i < N; i++) {
                y[i] = (this.group) ? [get(Y,i,0),get(Y,i,1),this.data[i][D]] : [get(Y,i,0),get(Y,i,1)];
            }
            let sum = 0;
            eigenValues.forEach(element=>sum += element);
            let PCA = [];
            for (let i = 0; i < D; i++) {
                PCA[i] = eigenValues[i]/sum;
            }
            return {result: y, information: PCA};
        }
    }

    // KERNEL PCA
    computeKernelPCA(kernel_function,parameter) {
        let D = (this.group) ? this.data[0].length - 1 : this.data[0].length;
        let N = this.data.length;
        let rawData;
        if (this.group) {                           // time: O(NxD)
            rawData = [];
            this.data.forEach((element,index)=>{
                rawData[index] = [];
                for (let i = 0; i < D; i++) {
                    rawData[index][i] = element[i];
                }
            });
        } else rawData = this.data.map(element=>element.map(element_=>element_));
        let data = DR.standardize(rawData);
        let kArr = [];
        for (let i = 0; i < N; i++) {
            kArr[i] = [];
            for (let j = 0; j < N; j++) {
                switch (kernel_function) {
                    case 'Gaussian':
                        kArr[i][j] = 0;
                        for (let e = 0; e < D; e++) {
                            kArr[i][j] += (data[i][e]-data[j][e])*(data[i][e]-data[j][e]);
                        }
                        kArr[i][j] = Math.exp(-parameter*kArr[i][j]);
                        break;
                    case 'Polynomial':
                        kArr[i][j] = 0;
                        for (let e = 0; e < D; e++) {
                            kArr[i][j] += data[i][e]*data[j][e];
                        }
                        kArr[i][j] = Math.pow(1+kArr[i][j],parameter);
                        break;
                    case 'Hyperbolic':
                        kArr[i][j] = 0;
                        for (let e = 0; e < D; e++) {
                            kArr[i][j] += data[i][e]*data[j][e];
                        }
                        kArr[i][j] = Math.tanh(kArr[i][j]+parameter);
                        break;
                }
            }
        }
        let K = array2mat(kArr);
        let norK = add(sub(K,mul(mul(ones(N,N),2/N),K)),mul(mul(mul(ones(N,N),1/N),K),mul(ones(N,N),1/N)));
        let eigenMatrix = eigs(norK,N);
        let eigenValues = eigenMatrix.V;
        let M = transpose(array2mat([eigenMatrix.U.val.slice(0,N),eigenMatrix.U.val.slice(N,2*N)]));
        let Y = mul(K,M);
        let y = [];
        for (let i = 0; i < N; i++) {
            y[i] = (this.group) ? [get(Y,i,0),get(Y,i,1),this.data[i][D]] : [get(Y,i,0),get(Y,i,1)];
        }
        let sum = 0;
        eigenValues.forEach(element=>sum += Math.abs(element));
        let KPCA = [];
        for (let i = 0; i < D; i++) {
            KPCA[i] = Math.abs(eigenValues[i]/sum);
        }
        return {result: y, information: KPCA};
    }

    // STANDARDIZE INPUT DATA
    static standardize(data_) {
        let data = data_.map(element=>element.map(element_=>element_));
        let N = data.length;
        let D = (this.group) ? data[0].length - 1 : data[0].length;
        let myMean = [], mySD = [];                          // space: O(D)
        // calculate mean and standard deviation
        // time: O(3NxD)
        for (let j = 0; j < D; j++) {
            myMean[j] = 0; mySD[j] = 0;
            for (let i = 0; i < N; i++) {
                myMean[j] += data[i][j];
            }
            myMean[j] /= N;
            for (let i = 0; i < N; i++) {
                mySD[j] += (data[i][j]-myMean[j])*(data[i][j]-myMean[j]);
            }
            mySD[j] = Math.sqrt(mySD[j]/N);
            for (let i = 0; i < N; i++) {
                data[i][j] = (data[i][j]-myMean[j])/mySD[j];
            }
        }
        return data;
    }

    // COVARIANCE MATRIX
    static covarianceMatrix(matrix_) {
        let rows = matrix_.size[0];
        let cols = matrix_.size[1];
        let dev = sub(matrix_,mul(mul(ones(rows,rows),matrix_),1/rows));     //space: O(rows*cols), time: O(N2xD)
        return mul(mul(transpose(dev), dev), 1 / rows);
    }
}