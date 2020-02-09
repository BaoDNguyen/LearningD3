//////////////////////////////////////////////////////////////////////////////////////////////
// INPUT NAME: name of DR                                                                   //
// INPUT DATA: Array[data instance][coordinates/dimensions of instance] => Matrix NxD       //
// need to call computeDR()                                                                 //
//////////////////////////////////////////////////////////////////////////////////////////////

export class DR {
    constructor(name,data,parameters) {
        this.name = name;
        this.data = data.map(element=>element.map(element_=>element_));     // space: O(NxD), time: O(NxD)
        this.parameters = parameters;
    }

    // CONTROL COMPUTATIONS
    computeDR() {         // compute corresponding technique to this.name
        switch (this.name) {
            case 'PCA':
                this.computePCA();
                break;
        }
    }

    // COMPUTE PCA
    computePCA() {
        let data = DR.standardize(this.data);
        let X = array2mat(data);
        let S = DR.covarianceMatrix(X);
        let N = X.size[0];
        let D = X.size[1];
        let eigenMatrix = eigs(S,D);
        let eigenValues = eigenMatrix.V;
        let M = transpose(array2mat([eigenMatrix.U.val.slice(0,D),eigenMatrix.U.val.slice(D,2*D)]));
        let Y = mul(X,M);
        let sum = 0;
        sum = eigenValues.forEach(element=>sum += element);
        let PCA = (eigenValues[0]+eigenValues[1])/sum;
        return {result: Y, information: PCA};
    }

    // STANDARDIZE INPUT DATA
    static standardize(data_) {
        let data = data_.map(element=>element.map(element_=>element_));
        let N = data.length;
        let D = data[0].length;
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
    }

    // COVARIANCE MATRIX
    static covarianceMatrix(matrix_) {
        let rows = matrix_.size[0];
        let cols = matrix_.size[1];
        let dev = matrix_-mul(mul(ones(rows,rows),matrix_),1/rows);     //space: O(rows*cols), time: O(N2xD)
        return mul(mul(transpose(dev), dev), 1 / rows);
    }
}