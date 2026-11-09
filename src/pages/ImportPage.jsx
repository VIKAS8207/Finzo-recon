import { useState } from 'react'
import Button from '../components/Button.jsx'
import Panel, { PanelGroup } from '../components/Panel.jsx'
import DataTable from '../components/DataTable.jsx'
import DropZone from '../components/DropZone.jsx'
import PageHeader from '../components/PageHeader.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import { Field, Input, Select } from '../components/Field.jsx'
import { useBank } from '../context/BankContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { IMPORT_FIELDS, SAMPLE_STATEMENT } from '../data/constants.js'
import { parseCSV, readTextFile } from '../utils/csv.js'
import { acctLabel } from '../utils/format.js'

// Guess which CSV column feeds each field from the header text
function guessMap(heads) {
  const map = {}
  IMPORT_FIELDS.forEach(([key, , words]) => {
    map[key] = heads.findIndex((h) => words.some((w) => h.toLowerCase().includes(w)))
  })
  return map
}

export default function ImportPage() {
  const { accounts, logAct } = useBank()
  const toast = useToast()
  const [rows, setRows] = useState(null)
  const [fileName, setFileName] = useState('')
  const [map, setMap] = useState({})
  const [acct, setAcct] = useState('')

  function load(text, name) {
    const parsed = parseCSV(text)
    setRows(parsed)
    setFileName(name)
    setMap(guessMap(parsed[0]))
  }

  const body = rows ? rows.slice(1) : []
  const ok = map.date >= 0 && map.desc >= 0 && (map.out >= 0 || map.in >= 0)
  const cell = (row, k) => (map[k] >= 0 ? (row[map[k]] || '').trim() : '-')

  function run() {
    logAct(acct || 'No account chosen', `Checked statement import, ${body.length} rows`)
    toast(`${body.length} rows are valid. This prototype does not save statements.`)
  }

  return (
    <>
      <PageHeader crumb="Banking / Import" title="Statement import" />

      <PanelGroup>
      <Panel bare title="1. Choose account and file">
        <div className="max-w-md mb-3">
          <Field label="Bank account">
            <Input list="import-accounts" value={acct} onChange={(e) => setAcct(e.target.value)} placeholder="Search by bank, name or last 4" />
          </Field>
          <datalist id="import-accounts">
            {accounts.slice(0, 80).map((a) => (
              <option key={a.id} value={`${acctLabel(a)} ${a.last4}`} />
            ))}
          </datalist>
        </div>
        <DropZone
          title={rows ? fileName : 'Choose a bank statement CSV'}
          accept=".csv,text/csv"
          onFile={async (f) => load(await readTextFile(f), f.name)}
        />
        <div className="mt-3">
          <Button onClick={() => load(SAMPLE_STATEMENT, 'sample-statement.csv')}>Use a sample statement</Button>
        </div>
      </Panel>

      {rows && (
        <>
          <Panel bare title="2. Match the columns">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3">
              {IMPORT_FIELDS.map(([key, label]) => (
                <Field key={key} label={label}>
                  <Select value={map[key]} onChange={(e) => setMap({ ...map, [key]: +e.target.value })}>
                    <option value={-1}>Not in file</option>
                    {rows[0].map((h, i) => (
                      <option key={i} value={i}>
                        {h}
                      </option>
                    ))}
                  </Select>
                </Field>
              ))}
            </div>
          </Panel>

          <Panel bare className="flex flex-col gap-3">
            <SectionTitle className="mb-0">3. Preview, first 5 of {body.length} rows</SectionTitle>
            <DataTable bare
              heads={['Date', 'Description', 'Reference', 'Withdrawal', 'Deposit', 'Balance']}
              right={[3, 4, 5]}
              rows={body.slice(0, 5).map((r) => ['date', 'desc', 'ref', 'out', 'in', 'bal'].map((k) => cell(r, k)))}
            />
            {!ok && (
              <p className="text-xs text-rose-600">
                Map Date, Description and at least one of Withdrawal or Deposit to continue.
              </p>
            )}
            <div>
              <Button variant="primary" disabled={!ok} onClick={run}>
                Import {body.length} rows
              </Button>
            </div>
          </Panel>
        </>
      )}
    </PanelGroup>
    </>
  )
}
