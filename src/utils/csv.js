// Minimal CSV parser (no quoted-comma support), enough for the sample statements.
export function parseCSV(text) {
  return text
    .trim()
    .split(/\r?\n/)
    .filter((l) => l.trim())
    .map((l) => l.split(','))
}

export function readTextFile(file) {
  return new Promise((resolve) => {
    const fr = new FileReader()
    fr.onload = () => resolve(String(fr.result))
    fr.readAsText(file)
  })
}
