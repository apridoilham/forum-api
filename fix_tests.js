const fs = require('fs');

function fixRepositoryTests() {
  const dir = 'src/Infrastructures/repository/_test/';
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.test.js'));
  for (const file of files) {
    const path = dir + file;
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/Commons/g, '../../../Commons');
    content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/Domains/g, '../../../Domains');
    content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/Infrastructures/g, '../../../Infrastructures');
    fs.writeFileSync(path, content);
  }
}

function fixInterfacesTests() {
  const apiDir = 'src/Interfaces/http/api/';
  const apis = fs.readdirSync(apiDir);
  for (const api of apis) {
    const testDir = apiDir + api + '/_test/';
    if (fs.existsSync(testDir)) {
      const files = fs.readdirSync(testDir).filter(f => f.endsWith('.test.js'));
      for (const file of files) {
        const path = testDir + file;
        let content = fs.readFileSync(path, 'utf8');
        content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/Infrastructures/g, '../../../../../Infrastructures');
        content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/Commons/g, '../../../../../Commons');
        content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/tests/g, '../../../../../../tests');
        fs.writeFileSync(path, content);
      }
    }
  }
}

fixRepositoryTests();
fixInterfacesTests();
