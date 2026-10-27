const git = require('isomorphic-git');
const fs = require('fs');
const path = require('path');

const dir = __dirname;

async function initAndCommit() {
  console.log('Initializing git repository...');
  await git.init({ fs, dir, defaultBranch: 'main' });

  // Add remote
  console.log('Setting remote origin to https://github.com/JanviSingh17/hotelPro.git...');
  await git.addRemote({
    fs,
    dir,
    remote: 'origin',
    url: 'https://github.com/JanviSingh17/hotelPro.git',
    force: true,
  });

  // Get list of all files ignoring node_modules, .git, etc.
  console.log('Scanning files...');
  const files = [];
  function scan(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      const relPath = path.relative(dir, fullPath);
      if (
        relPath.startsWith('.git') ||
        relPath.includes('node_modules') ||
        relPath.startsWith('dist') ||
        relPath.includes('.DS_Store') ||
        relPath.includes('push.js')
      ) {
        continue;
      }
      if (entry.isDirectory()) {
        scan(fullPath);
      } else {
        files.push(relPath);
      }
    }
  }
  scan(dir);

  console.log(`Adding ${files.length} files to git index...`);
  for (const file of files) {
    await git.add({ fs, dir, filepath: file });
  }

  console.log('Committing changes...');
  const sha = await git.commit({
    fs,
    dir,
    message: 'Initial commit: Complete HotelPro MERN stack hotel booking & management solution',
    author: {
      name: 'Janvi Singh',
      email: 'janvisingh@users.noreply.github.com',
    },
  });

  console.log('Committed successfully with SHA:', sha);
}

initAndCommit().catch(console.error);
