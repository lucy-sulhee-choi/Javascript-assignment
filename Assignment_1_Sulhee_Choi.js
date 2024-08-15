//Loading JSON data
const fs = require('fs');
const data = fs.readFileSync("Assessment_1_NEOWISE_Dataset.json", "utf8");
function parseData(jsonData){
    return JSON.parse(jsonData);
};

//Basic functions
//Function that retrieves the properties of a NEO by the index
function findNeo(index) {
    return parseData(data)[index];    
};

//Function that retieves the data for NEO based on one of its properties

//Finding Neos by its orbital period
function findNeosByPeriodYr(year){
    const NeosByPeriod = [];
    for (let i =0; i <parseData(data).length; i++){
        if (parseData(data)[i].period_yr === year){
            NeosByPeriod.push(parseData(data)[i]);
        }   
    }
    return NeosByPeriod;
};

//Finding Neos declared as PHA or non PHA
function findNeosOfPHA(answer){
    const NeosOfPHA = [];
    const NeosNotPHA = [];
    const NeosPHAUndefind = [];
    for (let i =0; i <parseData(data).length; i++){
        if (parseData(data)[i].pha === true){
            NeosOfPHA.push(parseData(data)[i]);
        } else if (parseData(data)[i].pha === false){
            NeosNotPHA.push(parseData(data)[i]);
        } else if (parseData(data)[i].pha === null){
            NeosPHAUndefind.push(parseData(data)[i]);
        }
    }
    if (answer === true){
        return NeosOfPHA;
    } else if (answer === false){
        return NeosNotPHA;
    } else if (answer === null){
        return NeosPHAUndefind;
    }
};

//Finding Neos by its asteroid class
function findNeosByClass(orbitClass){
    const NeosByClass = [];
    for (let i =0; i <parseData(data).length; i++){
        if (parseData(data)[i].orbit_class === orbitClass){
            NeosByClass.push(parseData(data)[i]);
        }
    }
    return NeosByClass;
};

//Finding Neos classed as comet
function findNeosOfComet(){
    const NeosOfComet = [];
    for (let i =0; i <parseData(data).length; i++){
        if (parseData(data)[i].orbit_class.includes("Comet")){
            NeosOfComet.push(parseData(data)[i]);
        }
    }
    return NeosOfComet;
};

//Function that displays all of the information on a certain NEO
function displayNeo(Neo){
    console.table(Neo);
};

//Analysis
//Assigning each group by relavant functions
const Neos_Pha = findNeosOfPHA(true);
const Neos_NotPha = findNeosOfPHA(false);

//Finding certain key's average, minimum and maximum value from a group of objects.
function findAvgMinMax(list, key){
    let newVal = 0;
    let counter = 0;
    let allVal =[];
    for (let i=0; i<list.length; i++){
        if(list[i][key]){
            newVal = list[i][key] + newVal;
            counter = counter+1;
            allVal.push(list[i][key]);
        }
    }
    let average = (newVal / counter).toFixed(3);
    let minVal = Math.min(...allVal);
    let maxVal = Math.max(...allVal);
    return {property : key, average : average, minimum : minVal, maximum : maxVal};        
};

//Getting all the data of average, minimum and maximum values of each key from a group
function getValOfKeys(list){
    const testKeys = ['h_mag','moid_au','q_au_1','q_au_2','period_yr','i_deg'];
    const newList = [];
    for (let i=0; i<testKeys.length; i++){
        newList.push(findAvgMinMax(list, testKeys[i]));
    }
    return newList;
};

//filtering NON PHA NEOs whose moid is less than 0.05
function filterNeos_NotPHA_smallMoid(){
    const Neos_NotPHA_smallMoid = [];
    for (let i=0; i<Neos_NotPha.length; i++){
            if (Neos_NotPha[i].moid_au < 0.05){
                Neos_NotPHA_smallMoid.push(Neos_NotPha[i]);
            }
    } return Neos_NotPHA_smallMoid
};

//filtering NON PHA NEOs whose magnitude is less than or equal to 22
function filterNeos_NotPHA_Bright(){
    const Neos_NotPHA_Bright = [];
    for (let i=0; i<Neos_NotPha.length; i++){
        if (Neos_NotPha[i].h_mag <= 22){
            Neos_NotPHA_Bright.push(Neos_NotPha[i]);
        }
    } return Neos_NotPHA_Bright
}

//checking if those 2 conditions are the factors for PHA
function conditions_PHA(){
    let PhaCounter = 0;
    for (let i=0; i<Neos_Pha.length; i++){
        if ((Neos_Pha[i].h_mag <= 22) && (Neos_Pha[i].moid_au <= 0.05)){
            PhaCounter++;
        }
    }
    if (PhaCounter === Neos_Pha.length){
        return true;
    } else if (PhaCounter !== Neos_Pha.length){
        return false;
    }
};

//Comparing datas of NEOs that are PHA VS non PHA and display the result
function displayAnalysis(){
    console.log('<Comparing data>\n1. PHA');
    displayNeo(getValOfKeys(Neos_Pha));
    console.log('2. Not PHA');
    displayNeo(getValOfKeys(Neos_NotPha));
    console.log('The data shows that PHA-NEOs have relatively small average and maximum of their MOID, compared to NON-PHA-NEOs.\nThere are however, some NEOs not classified as PHA with its MOID smaller than 0.05.\nHere is the data of NOT-PHA-NEOs with MOID smaller than 0.05.\n')
    console.log('3. NEOS-NOT-PHA with MOID < 0.05' );
    displayNeo(getValOfKeys(filterNeos_NotPHA_smallMoid()));
    console.log(`This table3 shows that NEOs with smaller MOID have their h_mag(brightness) ranged between 22.1 to 24.3.\nPHA-NEOs have maximum of 21.9 in their brightness.\n`);
    console.log('4.NEOs-NOT-PHA with Brightness <= 22');
    displayNeo(getValOfKeys(filterNeos_NotPHA_Bright()));
    console.log('This table4 shows that NEOs with smaller magnitute than 22 have larger figure of MOID, which are all more than 0.05.\n');
    //Conclusion. 
    if (conditions_PHA() === true){
    console.log('<Conclusion>\nNEOs are classified as PHA if its MOID is less than or equal to 0.05 AND its magnitute is less than 22.')
    }
    else if (conditions_PHA() === false){
    console.log('<Conclusion>\nNEOs cannot be classified as PHA just by its values in MOID and magnitude. Other factors need to be considered.')
    }
}
//calling it for displaying purpose.
displayAnalysis()

//Rearranging data into new objects with orbit classes as keys - different format to the original one
function rearrangedData(){
    let NEO_BY_CLASS = {
        Apollo : findNeosByClass('Apollo'),
        Aten : findNeosByClass('Aten'),
        Amor : findNeosByClass('Amor'),
        Comet : findNeosOfComet()
    };
    return JSON.stringify(NEO_BY_CLASS,null,1);
}

//Saving the rearranged data into a new JSON file.
fs.writeFile('NEOs_BY_CLASS.json', rearrangedData(), (err) => {
    if (err) throw err;
});

//Rearranging data by its class using sort() method - the same format.
function sortedNeoByClass(){
    let NEO_SORTED_BY_CLASS = parseData(data).sort(function(a,b){
        return a.orbit_class.localeCompare(b.orbit_class)});
    return JSON.stringify(NEO_SORTED_BY_CLASS,null,1);
};

//Saving the rearranged data into a new JSON file.
fs.writeFile('NEO_SORTED_BY_CLASS.json', sortedNeoByClass(), (err) => {
    if (err) throw err;
});

//for unit testing
module.exports = {findAvgMinMax, findNeo};
