
function generateSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

function secondsFromDuration(duration) {
  const parts = duration.split(":").map(Number).reverse();
  let seconds = 0;
  if (parts.length >= 1) seconds += parts[0];
  if (parts.length >= 2) seconds += parts[1] * 60;
  if (parts.length === 3) seconds += parts[2] * 3600;
  return seconds;
}

function generateOne() {
  const title = document.getElementById("title").value.trim();
  const embed = document.getElementById("embed").value.trim();
  const duration = document.getElementById("duration").value.trim();

  const slug = generateSlug(title);
  const durationSeconds = secondsFromDuration(duration);
  const focusKeyword = title;
  const description = `${title} - Watch now in full HD quality. Enjoy exclusive content, fast streaming, and mobile support.`;
  const tags = title.split(" ").slice(0, 8).join(", ").toLowerCase();

  const output = {
    post_title: title,
    post_content: embed,
    rank_math_focus_keyword: focusKeyword,
    _wp_old_slug: slug,
    rank_math_description: description,
    post_category: "Uncategorized",
    post_tag: tags,
    embed: embed,
    duration: durationSeconds,
    post_status: "draft"
  };

  document.getElementById("outputSingle").textContent = JSON.stringify(output, null, 2);
}

function generateCSV() {
  const input = document.getElementById("csvInput");
  if (!input.files.length) return alert("Please select a CSV file.");

  const reader = new FileReader();
  reader.onload = function (e) {
    const lines = e.target.result.split("\n").filter(Boolean);
    const headers = lines[0].split(",");
    const rows = lines.slice(1);

    const result = [headers.concat([
      "rank_math_focus_keyword", "_wp_old_slug", "rank_math_description",
      "post_category", "post_tag", "duration", "post_status"
    ])];

    rows.forEach(row => {
      const cols = row.split(",");
      const title = cols[0]?.trim() || "";
      const embed = cols[1]?.trim() || "";
      const duration = cols[2]?.trim() || "";

      const slug = generateSlug(title);
      const durationSeconds = secondsFromDuration(duration);
      const description = `${title} - Watch now in full HD quality. Enjoy exclusive content, fast streaming, and mobile support.`;
      const tags = title.split(" ").slice(0, 8).join(", ").toLowerCase();

      result.push(cols.concat([
        title, slug, description, "Uncategorized", tags, durationSeconds, "draft"
      ]));
    });

    const csv = result.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "generated_seo.csv";
    a.click();
  };

  reader.readAsText(input.files[0]);
}
