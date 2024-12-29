export function parseCSV(text: string): Array<{ [key: string]: string }> {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(value => value.trim());
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {} as { [key: string]: string });
    });
  }
  
  