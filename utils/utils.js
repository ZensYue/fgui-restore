const fs = require('fs');
const { parseStringPromise, Builder } = require('xml2js');
var path = require("path"); 
const fs_extra = require('fs-extra');

const ascii2Str = (num) => {
    return String.fromCharCode(num);
}

const exists = (path) => {
    return fs.existsSync(path);
}

const xml2json = (xml) => {
    return new Promise((resolve, reject) => {
        parseStringPromise(xml, { explicitArray: false }).then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        })
    })
}

const getItemById = (itemMap, id) => {
    let item;
    for (let key in itemMap) {
        let ele = itemMap[key];
        if (ele.id == id) {
            item = ele;
        }
    };
    return item;
}

const getObjectById = (obj, id, name) => {
    for (let key in obj) {
        let value = obj[key];
        if (name == value[id]) {
            return value;
        }
    }
}

const json2xml = (json) => {
    let builder = new Builder({ xmldec: { 'version': '1.0', 'encoding': 'utf-8', noValidation: true } });
    return builder.buildObject(json);
}

const rgbaToHex = (str, alpha = true) => {
    if(!str){
        return "";
    }
    const colorArr = str.match(/(0\.)?\d+/g);
    const color = colorArr.map((ele, index, array) => {
        if (index === array.length - 1 && alpha) {
            let opacity = (ele * 100 * 255) / 100;
            return Math.round(opacity)
                .toString(16)
                .padEnd(2, "0");
        }
        return Number.parseFloat(ele)
            .toString(16)
            .padStart(2, "0");
    });
    if (alpha) {
        color.unshift(color.pop());// argb
    }
    return `#${color.join("")}`;
}


const deleteObjectProps = (object) =>{
    for(let key in object){
        let value = object[key];
        if(typeof value === "undefined"){
            delete object[key];
        }
    }
}

const changeTwoDecimal = (x) => {
    let f_x = parseFloat(x);
    if (isNaN(f_x)) {
        console.warn('parameter error');
        return false;
    }
    f_x = Math.round(f_x * 100) / 100;
    let s_x = f_x.toString();
    let pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
    }
    while (s_x.length <= pos_decimal + 2) {
        s_x += '0';
    }
    return s_x;
}

function mkdirs(dirname) {  
    bo = exists(dirname);  
    if (bo) {  
        return;
    } else {  
        mkdirs(path.dirname(dirname));
        fs_extra.mkdirSync(dirname); 
        console.log("mkdir : " + dirname);
    }  
}

module.exports.xml2json = xml2json;
module.exports.json2xml = json2xml;
module.exports.exists = exists;
module.exports.ascii2Str = ascii2Str;
module.exports.getItemById = getItemById;
module.exports.rgbaToHex = rgbaToHex;
module.exports.changeTwoDecimal = changeTwoDecimal;
module.exports.getObjectById = getObjectById;
module.exports.deleteObjectProps = deleteObjectProps;
module.exports.mkdirs = mkdirs;