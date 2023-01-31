function generateId(data) {
  let maxId = 0;

  data.forEach(obj => {
    if (obj.id > maxId) maxId = obj.id;
  });

  return ++maxId;
}

function updateObject(obj, updates) {
  return Object.assign({}, obj, updates);
}
module.exports = { generateId, updateObject };