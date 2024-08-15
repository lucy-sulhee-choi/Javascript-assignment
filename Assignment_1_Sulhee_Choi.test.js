//Importing the functions and variables from the base file.
const {findAvgMinMax, findNeo}  = require('./Assignment_1_Sulhee_Choi.js');

let test_list = [{key1: 1, key2: 10, key3: 100},{key1:2, key2:20, key3: 200}, {key1: 3, key2: 30, key3: 300}]
test('Input of (test_list, key1), output of {avr:2, min:1, max:3}.',() => {
    expect(findAvgMinMax(test_list,'key1')).toEqual({property: 'key1', average: '2.000', minimum: 1, maximum: 3});
});

test('Input of (test_list, key3), output of {avr:200, min:100, mix:300}.',() => {
    expect(findAvgMinMax(test_list, 'key3')).toEqual({property: 'key3', average: '200.000', minimum: 100, maximum: 300});
});

test('input of index 0, output of NEO indexed 0',() =>{
    expect(findNeo(3)).toEqual({"designation":"414746 (2010 EH20)","discovery_date":"2010-03-06T00:00:00.000","h_mag":18,"moid_au":0.268,"q_au_1":1.25,"q_au_2":3.99,"period_yr":4.24,"i_deg":23.89,"pha":false,"orbit_class":"Amor"})
});

//unit test -  passed.