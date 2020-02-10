//////////////////////////////////////////////////////////////////
// INPUT DATA: data[instances][variables of each instances]     //
// INPUT DATA: last column of data is group if group is true    //
// INPUT LABEL: label[string/name of variable]                  //
// INPUT LOCATION: ID of div in html                            //
// LIMITS: #groups are less than or equal to 7                  //
//////////////////////////////////////////////////////////////////

class myDraw {
    constructor(data,group,label,divID,parameter) {
        this.data = data.map(element=>element.map(element_=>element_));
        this.divID = divID;
        this.group = group;
        this.label = label.map(element=>element);
        this.parameter = parameter;
    }

    // DRAW SPLOM
    drawSPLOM () {
        let D = this.group ? this.data[0].length - 1 : this.data[0].length;
        let groups = this.group ? this.getGroup(this.data) : [];                    // time: O(N)
        let nGroup = groups.length;
        let pl_colorScale = [];
        for (let i = 0; i < nGroup; i++) {
            pl_colorScale.push([(i / nGroup),myDraw.colorBrew[i]]);
            pl_colorScale.push([(i+1) / nGroup,myDraw.colorBrew[i]]);
        }
        let variable = [];
        for (let i = 0; i < D; i++) {       // time: O(D)
            variable[i] = [];
        }
        let nameGroup = [];
        this.data.forEach((element,index)=>{        // time: O(NxD)
            for (let i = 0; i < D; i++) {
                variable[i][index] = element[i];
            }
            if (this.group) nameGroup[index] = element[D];
        });
        let colors = [];
        nameGroup.forEach((element,index)=>{
            if (index === 0) colors[index] = 0;
            else {
                colors[index] = (element === nameGroup[index-1]) ? colors[index-1] : colors[index-1] + 1;
            }
        });
        let dataDraw = [{
            type: 'splom',
            dimensions: [],
            text: this.group ? nameGroup : '',
            marker: {
                color: colors,
                colorscale:pl_colorScale,
                size: 6,
                line: {
                    color: 'white',
                    width: 0.5
                }
            }
        }];
        variable.forEach((element,index)=>{
            dataDraw[0].dimensions[index] = {label: this.label[index], values: element};
        });

        let axis = () => ({
            showline:false,
            zeroline:false,
            gridcolor:'#ffff',
            ticklen:D
        });
        let layout = {
            title:'Scatterplot Matrix of the dataset',
            height: 200*D,
            width: 200*D,
            autosize: false,
            hovermode:'closest',
            dragmode:'select',
            plot_bgcolor:'rgba(240,240,240, 0.95)',
            xaxis:axis(),
            yaxis:axis(),
        };
        for (let i = 2; i <= D; i++) {
            layout['xaxis'+i] = axis();
            layout['yaxis'+i] = axis();
        }
        Plotly.react(this.divID, dataDraw, layout, {modeBarButtonsToRemove: ['toggleSpikelines']})
    }

    // get number of groups
    getGroup(data_) {                       // time: O(N)
        let data = data_.map(element=>element.map(element_=>element_));
        let L = data[0].length;
        let groups = [];
        groups.push(data[0][L-1]);
        let count = 0;
        data.forEach(element=>{
            if (element[L-1] !== groups[count]) {
                groups.push(element[L-1]);
                count += 1;
            }
        });
        return groups;
    }

    static colorBrew = [
        '#1f78b4',
        '#33a02c',
        '#e31a1c',
        '#ff7f00',
        '#6a3d9a',
        '#FFFF00',
        '#b15928',
    ];
}