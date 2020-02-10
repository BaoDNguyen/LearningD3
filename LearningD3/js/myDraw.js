//////////////////////////////////////////////////////////////////
// INPUT DATA: data[instances][variables of each instances]     //
// INPUT DATA: last column of data is group if group is true    //
// INPUT LABEL: label[string/name of variable]                  //
// INPUT LOCATION: ID of div in html                            //
// LIMITS: #groups are less than or equal to 7                  //
//////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////
// drawScatterplot: input data has two or three columns         //
//////////////////////////////////////////////////////////////////

class myDraw {
    constructor(data,group,label,divID) {
        this.data = data.map(element=>{
            if (typeof(element) === 'object') return element.map(element_=>element_);
            else return element;
        });
        this.divID = divID;
        this.group = group;
        this.label = label.map(element=>element);
    }

    // DRAW SPLOM
    drawSPLOM (title) {
        let D = this.group ? this.data[0].length - 1 : this.data[0].length;
        let groups = this.group ? myDraw.getGroup(this.data) : [];                    // time: O(N)
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
            title:title,
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

    // DRAW SCATTER PLOT
    drawScatterplot(title) {
        let groups = (this.group) ? myDraw.getGroup(this.data) : [];
        let nGroup = groups.length;
        let x = [], y =[];
        if (this.group) {
            for (let i = 0; i < nGroup; i++) {
                x[i] = []; y[i] = [];
                this.data.forEach(element=>{
                    if (element[2] === groups[i]) {x[i].push(element[0]); y[i].push(element[1]);}
                });
            }
        } else {
            this.data.forEach((element,index)=>{
                x[index] = element[0];
                y[index] = element[1];
            });
        }
        let dataDraw = [];
        if (this.group) {
            for (let i = 0; i < nGroup; i++) {
                dataDraw[i] = {
                    x: x[i],
                    y: y[i],
                    mode: 'markers',
                    type: 'scatter',
                    name: groups[i],
                    marker: { size: 8 }
                }
            }
        } else {
            dataDraw[0] = {
                x: x,
                y: y,
                mode: 'markers',
                type: 'scatter',
                marker: { size: 8 }
            }
        }
        let axis = () => ({
            showline:false,
            zeroline:false,
            gridcolor:'#ffff',
            ticklen:2
        });
        let layout = {
            title:title,
            height: 600,
            width: 600,
            autosize: false,
            hovermode:'closest',
            dragmode:'select',
            plot_bgcolor:'rgba(240,240,240, 0.95)',
            xaxis:axis(),
            yaxis:axis(),
        };
        Plotly.newPlot(this.divID,dataDraw,layout);
    }

    // HISTOGRAM
    drawBarChart(title) {
        let x = this.data;
        let rows = (typeof(x[0]) === 'object') ? x.length : 1;
        if (rows === 1) {
            x = x.map(element=>element*100);
        } else {
            x = x.map(element=>element.map(element_=>element_*100));
        }
        let dataDraw = [];
        if (rows === 1) {
            dataDraw[0] = {
                x:x,
                type: 'bar',
                opacity: 1,
                marker: {
                    color: myDraw.colorBrew[0],
                },
            };
        } else {
            for (let i = 0; i < rows; i++) {
                dataDraw[i] = {
                    x:x[i],
                    type: 'bar',
                    opacity: 0.5,
                    marker: {
                        color: myDraw.colorBrew[i],
                    },
                };
            }
        }
        let layout = {
            title:title,
            barmode:'overlay',
        };
        Plotly.newPlot(this.divID,dataDraw,layout,{editable: true});
    }

    // get number of groups
    static getGroup(data_) {                       // time: O(N)
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