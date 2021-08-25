export const styleExcel = (data) => {
  let wscols = [];
  let wsrows = [];
  let maxlen = {};

  for (const property in data) {
    for (const [k, v] of Object.entries(data[property])) {
      if (!(k in maxlen)) {
        maxlen[k] = v.length + 2;
      } else {
        if (v.length > maxlen[k]) {
          maxlen[k] = v.length + 2;
        }
      }
    }
  }

  for (const property in data) {
    for (const [k, v] of Object.entries(data[property])) {
      wscols.push({ wch: maxlen[k] });
      wsrows.push({ hpx: 15 });
    }
  }

  return {
    wscols,
    wsrows,
  };
};

export const dataFormat = (data) => {
  let codes = [];
  for (const [category, items] of Object.entries(data)) {
    for (const codeItem of items) {
      const obj = {};
      obj['category'] = category;
      for (const [key, value] of Object.entries(codeItem)) {
        obj[key] = value;
      }
      codes.push(obj);
    }
  }
  return codes;
};
