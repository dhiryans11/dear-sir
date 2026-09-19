const { execSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');

console.log('Generating reverse animation video...');
const cmd = `"${ffmpeg}" -y -i public/nscardani.mp4 -vf reverse -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p -movflags +faststart public/nscardanirev.mp4`;
execSync(cmd, { stdio: 'inherit' });
console.log('Reverse video public/nscardanirev.mp4 generated successfully!');
