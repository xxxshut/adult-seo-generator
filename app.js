
// Helper to convert duration from HH:MM:SS or MM:SS to seconds
function durationToSeconds(duration) {
  const parts = duration.split(':').map(Number).reverse();
  let seconds = 0;
  if (parts[0]) seconds += parts[0];        // SS
  if (parts[1]) seconds += parts[1] * 60;   // MM
  if (parts[2]) seconds += parts[2] * 3600; // HH
  return seconds;
}

// Generate SEO-friendly slug
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')       
    .replace(/[^\w\-]+/g, '')   
    .replace(/\-\-+/g, '-')     
    .replace(/^-+|-+$/g, '');   
}

// Generate SEO title (optional logic)
function seoTitle(title) {
  return title.trim();
}

// Generate SEO description
function seoDescription(title, duration) {
  return `${title} - Watch now in ${duration} duration on our tube site.`;
}

// Generate tags from title
function extractTags(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2)
    .slice(0, 10)
    .join(',');
}

// Handle single input
function generateOne() {
  const title = document.getElementById('title').value.trim();
  const embed = document.getElementById('embed').value.trim();
  const durationRaw = document.getElementById('duration').value.trim();
  const duration = durationToSeconds(durationRaw);

  const slug = slugify(title);
  const tags = extractTags(title);
  const description = seoDescription(title, durationRaw);

  const output = {
    post_title: seoTitle(title),
    post_content: embed,
    rank_math_focus_keyword: title,
    _wp_old_slug: slug,
    rank_math_description: description,
    post_category: '',
    post_tag: tags,
    embed: embed,
    duration: duration,
    post_status: 'draft'
  };

  document.getElementById('outputSingle').textContent = JSON.stringify(output, null, 2);
}

// Handle CSV
function generateCSV() {
  const input = document.getElementById('csvInput');
  const file = input.files[0];
  if (!file) return alert('Upload a CSV file');

  const reader = new FileReader();
  reader.onload = function (e) {
    const lines = e.target.result.split('\n');
    const headers = ['title', 'embed', 'duration'];
    const output = [Object.keys(sampleOutput()).join(',')];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',');
      if (row.length < 3) continue;

      const title = row[0].trim();
      const embed = row[1].trim();
      const durationRaw = row[2].trim();
      const duration = durationToSeconds(durationRaw);
      const slug = slugify(title);
      const tags = extractTags(title);
      const description = seoDescription(title, durationRaw);

      const post = {
        post_title: seoTitle(title),
        post_content: embed,
        rank_math_focus_keyword: title,
        _wp_old_slug: slug,
        rank_math_description: description,
        post_category: '',
        post_tag: tags,
        embed: embed,
        duration: duration,
        post_status: 'draft'
      };

      output.push(Object.values(post).map(v => `"\${v}"`).join(','));
    }

    downloadCSV(output.join('\n'), 'output.csv');
  };
  reader.readAsText(file);
}

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function sampleOutput() {
  return {
    post_title: '',
    post_content: '',
    rank_math_focus_keyword: '',
    _wp_old_slug: '',
    rank_math_description: '',
    post_category: '',
    post_tag: '',
    embed: '',
    duration: '',
    post_status: ''
  };
}
