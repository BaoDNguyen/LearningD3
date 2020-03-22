Promise.all([
    d3.json('data/ScagnosticsML/X_train.json'),
    d3.json('data/ScagnosticsML/X_test.json'),
    d3.json('data/ScagnosticsML/y_train.json'),
    d3.json('data/ScagnosticsML/y_test.json'),
]).then(function(file){
    console.log(file);
});