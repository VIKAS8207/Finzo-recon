import { useState } from 'react'
import Button from '../components/Button.jsx'
import Panel, { PanelGroup } from '../components/Panel.jsx'
import DataTable from '../components/DataTable.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Switch from '../components/Switch.jsx'
import { Field, Input, Select } from '../components/Field.jsx'
import { useBank } from '../context/BankContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { RULE_ACCOUNTS } from '../data/constants.js'

export default function RulesPage() {
  const { rules, toggleRule, addRule, logAct } = useBank()
  const toast = useToast()
  const [form, setForm] = useState({ name: '', text: '', acct: RULE_ACCOUNTS[0], mode: 'Ask first' })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  function add() {
    const name = form.name.trim()
    const text = form.text.trim()
    if (!name || !text) return toast('Enter a rule name and the text to look for')
    addRule({ name, text: text.toUpperCase(), acct: form.acct, mode: form.mode })
    logAct('All accounts', `Added rule ${name}`)
    setForm({ ...form, name: '', text: '' })
    toast('Rule added')
  }

  return (
    <>
      <PageHeader crumb="Banking / Rules" title="Rules" />
      <p className="text-xs text-neutral-600">
        Rules sort bank transactions by their description, so people do not match the same charges by hand each month.
      </p>

      <PanelGroup>
      <DataTable bare
        heads={['Rule', 'When description contains', 'Post to account', 'Mode', 'Matched', 'On']}
        right={[4, 5]}
        rows={rules.map((r, i) => [
          r.name,
          r.text,
          r.acct,
          r.mode,
          r.hits,
          <Switch key="s" on={r.on} onChange={() => toggleRule(i)} label={`Turn ${r.name} on or off`} />,
        ])}
      />

      <Panel bare title="New rule">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3">
          <Field label="Name">
            <Input value={form.name} onChange={set('name')} placeholder="Courier charges" />
          </Field>
          <Field label="Description contains">
            <Input value={form.text} onChange={set('text')} placeholder="BLUEDART" />
          </Field>
          <Field label="Post to account">
            <Select value={form.acct} onChange={set('acct')}>
              {RULE_ACCOUNTS.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </Select>
          </Field>
          <Field label="Mode">
            <Select value={form.mode} onChange={set('mode')}>
              <option>Ask first</option>
              <option>Auto-apply</option>
            </Select>
          </Field>
        </div>
        <div className="mt-4">
          <Button variant="primary" onClick={add}>
            Add rule
          </Button>
        </div>
      </Panel>
    </PanelGroup>
    </>
  )
}
