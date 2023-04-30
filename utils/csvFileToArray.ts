export const csvFileToArray = async (csvTable: string) => {
  try {
 
    
    const csvHeader = csvTable.slice(0, csvTable.indexOf('\n') -1).split(',');
  
    const csvRows = csvTable.slice(csvTable.indexOf('\n')).split('\n');
    return csvRows.map((i) => {
      const values = i.split(',');
      const obj = csvHeader.reduce((object: any, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });
  } catch (error) {
    console.log(JSON.stringify(error));
  }
};
