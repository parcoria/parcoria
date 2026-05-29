// api/fill-permit-pdf.js
// Fills the official Durham Building Permit PDF (Doc.983) with form data
// Returns a filled PDF binary for download
// Uses pdf-lib to fill the official Durham fillable PDF

import { PDFDocument } from 'pdf-lib'
import { readFileSync } from 'fs'
import { join } from 'path'

// The official Durham PDF is stored in /public/forms/
// Field map based on the official Doc.983 Rev.08.01.2025 fillable form

const FIELD_MAP = {
  // Project
  'JOB ADDRESS':                                                               'jobAddress',
  'LOTUNIT':                                                                   'lotUnit',
  'SUBDIVISION':                                                               'subdivision',
  'JOB DESCRIPTION Must align with the checklist construction plan and site plan where required': 'jobDescription',
  // Contractor
  'CONTRACTOR':                                                                'contractorName',
  'STATE CONTRACTOR LICENSE NO':                                               'contractorLicense',
  'EMAIL FOR POINTOFCONTACT':                                                  'contractorEmail',
  'PHONE':                                                                     'contractorPhone',
  'REQUIRED DURHAM CONTRACTOR ID CID':                                         'durhamCID',
  'ADDRESS':                                                                   'contractorAddress',
  'CITY':                                                                      'contractorCity',
  'STATE':                                                                     'contractorState',
  'ZIP CODE':                                                                  'contractorZip',
  // Architect
  'ARCHITECT':                                                                 'architectName',
  'EMAIL':                                                                     'architectEmail',
  'PHONE_2':                                                                   'architectPhone',
  // Owner
  'PROPERTY OWNER NAME':                                                       'ownerName',
  'EMAIL_2':                                                                   'ownerEmail',
  'PHONE_3':                                                                   'ownerPhone',
  // Costs (undefined fields in order: building, electrical, plumbing, mechanical, fire)
  'undefined':                                                                 'building',
  'undefined2':                                                                'electrical',
  'undefined3':                                                                'plumbing',
  'undefined4':                                                                'mechanical',
  'undefined5':                                                                'fire',
  // Signature
  'PRINT NAME':                                                                'signerName',
  'DATE':                                                                      'signDate',
}

// CheckBox1.x = trade work Y/N (0=Yes, 1=No)
// electrical=0, plumbing=1, mechanical=2, fire=3
// CheckBox2.x = required questions Y/N (0=Yes, 1=No)
// landDisturbance=0, publicFood=1, sprinkler=2, subSlab=3, wellSeptic=4, drainage=5

function yn(val) {
  return val ? 'Yes' : 'Off'
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  let form = req.body
  if (typeof form === 'string') {
    try { form = JSON.parse(form) } catch { form = {} }
  }

  try {
    // Load the official Durham PDF from public/forms/
    const pdfPath = join(process.cwd(), 'public', 'forms', 'durham-building-permit.pdf')
    const pdfBytes = readFileSync(pdfPath)
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const pdfForm = pdfDoc.getForm()

    // Fill text fields
    for (const [fieldName, formKey] of Object.entries(FIELD_MAP)) {
      try {
        const field = pdfForm.getTextField(fieldName)
        const value = form[formKey] || ''
        field.setText(String(value))
      } catch {
        // Field not found or wrong type — skip
      }
    }

    // Total project cost
    try {
      const total = ['building', 'electrical', 'plumbing', 'mechanical', 'fire'].reduce((sum, key) => {
        return sum + (parseFloat(String(form[key] || '0').replace(/[^0-9.]/g, '')) || 0)
      }, 0)
      pdfForm.getTextField('TOTAL PROJECT COST').setText(
        '$' + total.toLocaleString('en-US', { minimumFractionDigits: 2 })
      )
    } catch {}

    // Trade work checkboxes (CheckBox1.x.0 = Yes, CheckBox1.x.1 = No)
    const tradeChecks = [
      { yes: 'Check Box1.0.0', no: 'Check Box1.0.1', val: form.hasElectrical !== false },
      { yes: 'Check Box1.1.0', no: 'Check Box1.1.1', val: form.hasPlumbing !== false },
      { yes: 'Check Box1.2.0', no: 'Check Box1.2.1', val: form.hasMechanical !== false },
      { yes: 'Check Box1.3.0', no: 'Check Box1.3.1', val: form.hasFire === true },
    ]
    for (const { yes, no, val } of tradeChecks) {
      try { pdfForm.getCheckBox(yes).check() } catch {}
      try { if (val) pdfForm.getCheckBox(yes).check(); else pdfForm.getCheckBox(no).check() } catch {}
    }

    // Required question checkboxes (CheckBox2.x.0 = Yes, CheckBox2.x.1 = No)
    const questionChecks = [
      { yes: 'Check Box2.0.0', no: 'Check Box2.0.1', val: form.landDisturbance === true },
      { yes: 'Check Box2.1.0', no: 'Check Box2.1.1', val: form.publicFood === true },
      { yes: 'Check Box2.2.0', no: 'Check Box2.2.1', val: form.sprinkler === true },
      { yes: 'Check Box2.3.0', no: 'Check Box2.3.1', val: form.subSlab === true },
      { yes: 'Check Box2.4.0', no: 'Check Box2.4.1', val: form.wellSeptic === true },
      { yes: 'Check Box2.5.0', no: 'Check Box2.5.1', val: form.drainage === true },
    ]
    for (const { yes, no, val } of questionChecks) {
      try { if (val) pdfForm.getCheckBox(yes).check(); else pdfForm.getCheckBox(no).check() } catch {}
    }

    // Flatten form so values are embedded (not editable) — comment out to keep editable
    // pdfForm.flatten()

    const filledBytes = await pdfDoc.save()

    const address = (form.jobAddress || 'durham').replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 30)
    const filename = `durham-building-permit-${address}.pdf`

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Content-Length', filledBytes.length)
    return res.send(Buffer.from(filledBytes))
  } catch (err) {
    console.error('PDF fill error:', err.message)
    return res.status(500).json({ error: `Could not fill PDF: ${err.message}` })
  }
}
