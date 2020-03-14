Promise.all([
    d3.csv('data/male.txt'),
    d3.csv('data/female.txt'),
    d3.csv('data/country_code.csv')
]).then(function(file){
    let map = new Map();
    for (let i = 0; i < file[2].length; i++) {
        let countryCode = file[2][i]['Country Code'];
        let tableName = file[2][i]['TableName'];
        if (!map.get(countryCode)) map
    }
});