 async function editParameterQuery(value){
    var editedValue = {};
    for (var keys in value) {
      if (value[keys] != "") editedValue[keys] = value[keys];
    }

    return editedValue;
  }

  module.exports = editParameterQuery;