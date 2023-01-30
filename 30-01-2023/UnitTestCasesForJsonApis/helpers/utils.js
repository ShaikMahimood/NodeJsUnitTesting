function generateId(data) {
    let maxId = 0;
  
    data.forEach(obj => {
      if (obj.id > maxId) maxId = obj.id;
    });
  
    return ++maxId;
  }

module.exports = { generateId };