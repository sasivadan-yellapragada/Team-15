async function load() {
  const res = await fetch('/api/notes');
  const json = await res.json();
  const ul = document.getElementById('list');
  ul.innerHTML = '';
  (json.data || []).forEach((n) => {
    const li = document.createElement('li');
    li.textContent = `#${n.id} — ${n.text}`;
    ul.appendChild(li);
  });
}

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = document.getElementById('text').value;
  await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  document.getElementById('text').value = '';
  await load();
});

load();
