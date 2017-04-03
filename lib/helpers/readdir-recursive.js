import fs from 'fs-promise';
import path from 'path';

// readdir async recursively
const readdirRecursive = async (dir, list=[]) => {
  let files = await fs.readdir(dir);
  files = files.map((f) => path.join(dir, f))
    .map((f) => path.resolve(f));
  list.push(...files);

  await Promise.all(files.map(async (f) => {
    const fstat = fs.statSync(f);
    await (fstat.isDirectory() && readdirRecursive(f, list));
  }));

  return list;
};


// readdir sync recursively
export const sync = (dir, list=[]) => {
  const files = fs.readdirSync(dir)
    .map((f) => path.join(dir, f))
    .map((f) => path.resolve(f));
  list.push(...files);

  files.forEach((f) => {
    const fstat = fs.statSync(f);
    fstat.isDirectory() && sync(f, list);
  });

  return list;
};


export default readdirRecursive;
