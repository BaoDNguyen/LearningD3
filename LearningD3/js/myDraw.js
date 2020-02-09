//////////////////////////////////////////////////////////////////
// INPUT DATA: data[instances][variables of each instances]     //
// INPUT DATA: last column of data is group                     //
// LIMITS: #types are less than or equal to 10                  //
//////////////////////////////////////////////////////////////////

class myDraw {
    constructor(data,location) {
        this.data = data.map(element=>element.map(element_=>element_));
        this.location = location;
    }

    // draw SPLOM
    drawSPLOM () {
        let N = this.data.length;
        let D = this.data[0].length;

    }



    static colorBrew = [
        '#8dd3c7',
        '#ffffb3',
        '#bebada',
        '#fb8072',
        '#80b1d3',
        '#fdb462',
        '#b3de69',
        '#fccde5',
        '#d9d9d9',
        '#bc80bd',
    ];
}