// src/lib/permit-pdf.js
// Generates filled Durham permit application PDFs using jsPDF
// Supports: Building (Doc.983), Electrical, Plumbing, Mechanical

import { jsPDF } from 'jspdf'

// ─── Layout constants ────────────────────────────────────────────────────────

const PAGE_W = 216   // 8.5in in mm
const PAGE_H = 279   // 11in in mm
const MARGIN = 14
const COL = PAGE_W - MARGIN * 2
const LINE = 5.5     // line height
const SECTION_GAP = 4

// ─── Helpers ─────────────────────────────────────────────────────────────────

function doc(pdf) {
  // Chainable helpers scoped to a pdf instance
  let y = MARGIN

  const cursor = () => y
  const move = (n) => { y += n }
  const reset = () => { y = MARGIN }

  function checkPage(needed = 20) {
    if (y + needed > PAGE_H - MARGIN) {
      pdf.addPage()
      y = MARGIN
    }
  }

  function header(title, subtitle, docRef) {
    // Dark header band
    pdf.setFillColor(30, 30, 30)
    pdf.rect(0, 0, PAGE_W, 22, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(11)
    pdf.text(title, MARGIN, 9)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(7.5)
    pdf.text(subtitle, MARGIN, 14.5)
    if (docRef) {
      pdf.setFontSize(6.5)
      pdf.text(docRef, PAGE_W - MARGIN, 14.5, { align: 'right' })
    }
    pdf.setTextColor(0, 0, 0)
    y = 28
  }

  function sectionTitle(text) {
    checkPage(14)
    y += SECTION_GAP
    pdf.setFillColor(245, 245, 245)
    pdf.rect(MARGIN, y, COL, 6.5, 'F')
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(7)
    pdf.setTextColor(80, 80, 80)
    pdf.text(text.toUpperCase(), MARGIN + 2, y + 4.5)
    pdf.setTextColor(0, 0, 0)
    y += 8
  }

  function row(label, value, opts = {}) {
    checkPage(12)
    const halfWidth = opts.half ? COL / 2 - 2 : COL
    const xOffset = opts.xOffset || 0

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(6.5)
    pdf.setTextColor(100, 100, 100)
    pdf.text(label, MARGIN + xOffset, y)

    // Field underline
    const fieldX = MARGIN + xOffset
    const fieldWidth = halfWidth
    pdf.setDrawColor(200, 200, 200)
    pdf.line(fieldX, y + 4.5, fieldX + fieldWidth, y + 4.5)

    // Value
    if (value) {
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(0, 0, 0)
      const maxWidth = fieldWidth - 2
      const lines = pdf.splitTextToSize(String(value), maxWidth)
      pdf.text(lines[0], fieldX + 1, y + 4)
    }
    pdf.setTextColor(0, 0, 0)

    if (!opts.noAdvance) y += LINE + 2
  }

  function twoCol(label1, val1, label2, val2) {
    checkPage(12)
    const half = (COL - 4) / 2
    // Left
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(6.5)
    pdf.setTextColor(100, 100, 100)
    pdf.text(label1, MARGIN, y)
    pdf.setDrawColor(200, 200, 200)
    pdf.line(MARGIN, y + 4.5, MARGIN + half, y + 4.5)
    if (val1) {
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(0, 0, 0)
      pdf.text(pdf.splitTextToSize(String(val1), half - 2)[0], MARGIN + 1, y + 4)
    }
    // Right
    const rx = MARGIN + half + 4
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(6.5)
    pdf.setTextColor(100, 100, 100)
    pdf.text(label2, rx, y)
    pdf.setDrawColor(200, 200, 200)
    pdf.line(rx, y + 4.5, rx + half, y + 4.5)
    if (val2) {
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(0, 0, 0)
      pdf.text(pdf.splitTextToSize(String(val2), half - 2)[0], rx + 1, y + 4)
    }
    pdf.setTextColor(0, 0, 0)
    y += LINE + 2
  }

  function threeCol(items) {
    // items: [{label, value}]
    checkPage(12)
    const w = (COL - 8) / 3
    items.forEach((item, i) => {
      const x = MARGIN + i * (w + 4)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(6.5)
      pdf.setTextColor(100, 100, 100)
      pdf.text(item.label, x, y)
      pdf.setDrawColor(200, 200, 200)
      pdf.line(x, y + 4.5, x + w, y + 4.5)
      if (item.value) {
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(9)
        pdf.setTextColor(0, 0, 0)
        pdf.text(pdf.splitTextToSize(String(item.value), w - 2)[0], x + 1, y + 4)
      }
    })
    pdf.setTextColor(0, 0, 0)
    y += LINE + 2
  }

  function yesNoRow(label, checked) {
    checkPage(10)
    const boxSize = 3.5
    // Yes box
    const yesX = PAGE_W - MARGIN - 30
    pdf.setDrawColor(150, 150, 150)
    pdf.rect(yesX, y - 3, boxSize, boxSize)
    if (checked === true) {
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(8)
      pdf.setTextColor(0, 0, 0)
      pdf.text('✓', yesX + 0.3, y)
    }
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(7)
    pdf.setTextColor(80, 80, 80)
    pdf.text('Yes', yesX + boxSize + 1.5, y)
    // No box
    const noX = yesX + 14
    pdf.setDrawColor(150, 150, 150)
    pdf.rect(noX, y - 3, boxSize, boxSize)
    if (checked === false) {
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(8)
      pdf.setTextColor(0, 0, 0)
      pdf.text('✓', noX + 0.3, y)
    }
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(7)
    pdf.setTextColor(80, 80, 80)
    pdf.text('No', noX + boxSize + 1.5, y)
    // Label
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(7.5)
    pdf.setTextColor(30, 30, 30)
    const wrapped = pdf.splitTextToSize(label, COL - 40)
    pdf.text(wrapped[0], MARGIN, y)
    pdf.setTextColor(0, 0, 0)
    y += LINE + 1
  }

  function costRow(label, value, isTotal = false) {
    checkPage(8)
    if (isTotal) {
      pdf.setFillColor(240, 240, 240)
      pdf.rect(MARGIN, y - 3.5, COL, 6.5, 'F')
    }
    pdf.setFont('helvetica', isTotal ? 'bold' : 'normal')
    pdf.setFontSize(8)
    pdf.setTextColor(isTotal ? 30 : 60, isTotal ? 30 : 60, isTotal ? 30 : 60)
    pdf.text(label, MARGIN + 2, y)
    const valStr = value || (isTotal ? '—' : '$0.00')
    pdf.setTextColor(0, 0, 0)
    pdf.text(valStr, PAGE_W - MARGIN - 2, y, { align: 'right' })
    y += LINE
  }

  function scopeList(items) {
    checkPage(10)
    items.forEach(item => {
      checkPage(7)
      const boxSize = 3
      pdf.setDrawColor(150, 150, 150)
      pdf.rect(MARGIN, y - 2.5, boxSize, boxSize, 'S')
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(8)
      pdf.text('✓', MARGIN + 0.2, y)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)
      pdf.setTextColor(30, 30, 30)
      const wrapped = pdf.splitTextToSize(item, COL - 8)
      pdf.text(wrapped[0], MARGIN + 5, y)
      pdf.setTextColor(0, 0, 0)
      y += LINE
    })
  }

  function signatureBlock(signerName, date, disclaimer) {
    checkPage(40)
    y += SECTION_GAP
    // Disclaimer box
    pdf.setFillColor(250, 250, 250)
    pdf.setDrawColor(220, 220, 220)
    const disclaimerLines = pdf.splitTextToSize(disclaimer, COL - 4)
    const boxH = disclaimerLines.length * 3.8 + 4
    pdf.rect(MARGIN, y, COL, boxH, 'FD')
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(6.5)
    pdf.setTextColor(80, 80, 80)
    pdf.text(disclaimerLines, MARGIN + 2, y + 4)
    y += boxH + 6

    // Signature fields
    twoCol('Printed name', signerName, 'Date', date)
    checkPage(16)
    y += 2
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(6.5)
    pdf.setTextColor(100, 100, 100)
    pdf.text('Signature', MARGIN, y)
    pdf.setDrawColor(100, 100, 100)
    pdf.line(MARGIN, y + 8, MARGIN + (COL / 2), y + 8)
    pdf.setFontSize(6)
    pdf.setTextColor(150, 150, 150)
    pdf.text('Sign here', MARGIN + 2, y + 12)
    pdf.setTextColor(0, 0, 0)
    y += 18
  }

  function footer() {
    const pageCount = pdf.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(6)
      pdf.setTextColor(150, 150, 150)
      pdf.text(
        `Generated by Parcoria · parcoria.com · Durham City-County Building & Safety · Page ${i} of ${pageCount}`,
        PAGE_W / 2,
        PAGE_H - 5,
        { align: 'center' }
      )
    }
  }

  return { cursor, move, reset, checkPage, header, sectionTitle, row, twoCol, threeCol, yesNoRow, costRow, scopeList, signatureBlock, footer }
}

// ─── Building permit PDF ──────────────────────────────────────────────────────

function buildBuildingPDF(form, totalCost) {
  const pdf = new jsPDF({ unit: 'mm', format: 'letter', orientation: 'portrait' })
  const d = doc(pdf)

  d.header(
    'City of Durham — Building Permit Application',
    'City-County Building & Safety Dept · 101 City Hall Plaza, Suite 400, Durham NC 27701 · (919) 560-4144',
    'Doc.983 Rev.08.01.2025'
  )

  d.sectionTitle('Project Information')
  d.row('Job Address', form.jobAddress)
  d.twoCol('Lot / Unit', form.lotUnit, 'Subdivision', form.subdivision)
  d.row('Description of Work', form.jobDescription)

  d.sectionTitle('Contractor Information')
  d.twoCol('Contractor / Business Name', form.contractorName, 'NC License No.', form.contractorLicense)
  d.twoCol('Durham Contractor ID (CID)', form.durhamCID, 'Phone', form.contractorPhone)
  d.twoCol('Email', form.contractorEmail, 'State', form.contractorState || 'NC')
  d.row('Address', `${form.contractorAddress}${form.contractorCity ? ', ' + form.contractorCity : ''}${form.contractorZip ? ' ' + form.contractorZip : ''}`)

  if (form.architectName) {
    d.sectionTitle('Architect / Designer')
    d.threeCol([
      { label: 'Name', value: form.architectName },
      { label: 'Email', value: form.architectEmail },
      { label: 'Phone', value: form.architectPhone },
    ])
  }

  d.sectionTitle('Property Owner')
  d.twoCol('Owner Name', form.ownerName, 'Phone', form.ownerPhone)
  d.row('Email', form.ownerEmail)

  d.sectionTitle('Construction Costs (Labor + Materials)')
  const COST_LABELS = {
    building: 'Building work', electrical: 'Electrical work',
    plumbing: 'Plumbing work', mechanical: 'Mechanical / HVAC work', fire: 'Fire protection work',
  }
  Object.entries(COST_LABELS).forEach(([key, label]) => {
    d.costRow(label, form[key] || '$0.00')
  })
  d.costRow('TOTAL PROJECT COST', `$${(totalCost || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, true)

  d.sectionTitle('Required Questions')
  d.yesNoRow('Does this project exceed 12,000 sq ft of land disturbance?', form.landDisturbance)
  d.yesNoRow('Does this project include public food service areas?', form.publicFood)
  d.yesNoRow('Single-family, duplex, or townhome with sprinkler system?', form.sprinkler)
  d.yesNoRow('Will a sub-slab soil exhaust system be installed?', form.subSlab)
  d.yesNoRow('Is this property serviced by a well or septic tank?', form.wellSeptic)
  d.yesNoRow('Is an alteration to an existing drainage system proposed?', form.drainage)

  if (form.notes) {
    d.sectionTitle('Additional Notes')
    d.row('Notes', form.notes)
  }

  d.signatureBlock(
    form.signerName,
    form.signDate,
    'The owner or authorized agent signing this application is responsible for determining whether sewer, water, gas and other utilities are available. All easements and restrictions must be shown on the plot plan. The applicant must adhere to all codes and ordinances. Applications which are not completed to "Issued" status within 6 months will expire.'
  )

  d.footer()
  return pdf
}

// ─── Electrical permit PDF ────────────────────────────────────────────────────

function buildElectricalPDF(form) {
  const pdf = new jsPDF({ unit: 'mm', format: 'letter', orientation: 'portrait' })
  const d = doc(pdf)

  d.header(
    'City of Durham — Electrical Permit Application',
    'Submit via LDO Portal: ldo4.durhamnc.gov/DurhamWeb · (919) 560-4144',
    'Durham LDO Portal'
  )

  d.sectionTitle('Project Information')
  d.row('Job Address', form.jobAddress)
  d.row('Description of Work', form.jobDescription)

  if (form.workScope?.length > 0) {
    d.sectionTitle('Scope of Electrical Work')
    d.scopeList(form.workScope)
  }

  d.sectionTitle('Electrical Details')
  d.twoCol('Service Size (Amps)', form.serviceAmps, 'Number of Circuits', form.numCircuits)
  d.twoCol('Wiring Method', form.wiringMethod, 'Estimated Cost', form.estimatedCost || '$0.00')

  d.sectionTitle('Contractor Information')
  d.twoCol('Contractor / Business Name', form.contractorName, 'NC Electrical License No.', form.contractorLicense)
  d.twoCol('Durham Contractor ID (CID)', form.durhamCID, 'Phone', form.contractorPhone)
  d.row('Email', form.contractorEmail)
  d.row('Address', `${form.contractorAddress}${form.contractorCity ? ', ' + form.contractorCity : ''}${form.contractorZip ? ' ' + form.contractorZip : ''}`)

  d.sectionTitle('Property Owner')
  d.twoCol('Owner Name', form.ownerName, 'Phone', form.ownerPhone)
  d.row('Email', form.ownerEmail)

  if (form.notes) { d.sectionTitle('Notes'); d.row('Notes', form.notes) }

  d.signatureBlock(
    form.signerName,
    form.signDate,
    'By submitting this application, the applicant certifies that all electrical work will be performed by or under the supervision of a NC-licensed electrical contractor, and that all work will conform to the 2023 NEC as adopted by NC and all applicable Durham codes.'
  )

  d.footer()
  return pdf
}

// ─── Plumbing permit PDF ──────────────────────────────────────────────────────

function buildPlumbingPDF(form) {
  const pdf = new jsPDF({ unit: 'mm', format: 'letter', orientation: 'portrait' })
  const d = doc(pdf)

  d.header(
    'City of Durham — Plumbing Permit Application',
    'Submit via LDO Portal: ldo4.durhamnc.gov/DurhamWeb · (919) 560-4144',
    'Durham LDO Portal'
  )

  d.sectionTitle('Project Information')
  d.row('Job Address', form.jobAddress)
  d.row('Description of Work', form.jobDescription)

  if (form.workScope?.length > 0) {
    d.sectionTitle('Scope of Plumbing Work')
    d.scopeList(form.workScope)
  }

  d.sectionTitle('Plumbing Details')
  d.twoCol('Number of Fixtures', form.numCircuits, 'Estimated Cost', form.estimatedCost || '$0.00')
  d.yesNoRow('Does scope include gas piping (natural gas or LP)?', form.gasWork)
  if (form.gasWork && form.gasType) d.row('Gas Type', form.gasType)

  d.sectionTitle('Contractor Information')
  d.twoCol('Contractor / Business Name', form.contractorName, 'NC Plumbing License No.', form.contractorLicense)
  d.twoCol('Durham Contractor ID (CID)', form.durhamCID, 'Phone', form.contractorPhone)
  d.row('Email', form.contractorEmail)
  d.row('Address', `${form.contractorAddress}${form.contractorCity ? ', ' + form.contractorCity : ''}${form.contractorZip ? ' ' + form.contractorZip : ''}`)

  d.sectionTitle('Property Owner')
  d.twoCol('Owner Name', form.ownerName, 'Phone', form.ownerPhone)
  d.row('Email', form.ownerEmail)

  if (form.notes) { d.sectionTitle('Notes'); d.row('Notes', form.notes) }

  d.signatureBlock(
    form.signerName,
    form.signDate,
    'By submitting this application, the applicant certifies that all plumbing work will be performed by or under the supervision of a NC-licensed plumbing contractor, and that all work will conform to the 2018 NC Plumbing Code and applicable Durham amendments.'
  )

  d.footer()
  return pdf
}

// ─── Mechanical permit PDF ────────────────────────────────────────────────────

function buildMechanicalPDF(form) {
  const pdf = new jsPDF({ unit: 'mm', format: 'letter', orientation: 'portrait' })
  const d = doc(pdf)

  d.header(
    'City of Durham — Mechanical / HVAC Permit Application',
    'Submit via LDO Portal: ldo4.durhamnc.gov/DurhamWeb · (919) 560-4144',
    'Durham LDO Portal'
  )

  d.sectionTitle('Project Information')
  d.row('Job Address', form.jobAddress)
  d.row('Description of Work', form.jobDescription)

  if (form.workScope?.length > 0) {
    d.sectionTitle('Scope of Mechanical Work')
    d.scopeList(form.workScope)
  }

  d.sectionTitle('Mechanical Details')
  d.twoCol('System Type', form.wiringMethod, 'Estimated Cost', form.estimatedCost || '$0.00')

  d.sectionTitle('Contractor Information')
  d.twoCol('Contractor / Business Name', form.contractorName, 'NC HVAC License No.', form.contractorLicense)
  d.twoCol('Durham Contractor ID (CID)', form.durhamCID, 'Phone', form.contractorPhone)
  d.row('Email', form.contractorEmail)
  d.row('Address', `${form.contractorAddress}${form.contractorCity ? ', ' + form.contractorCity : ''}${form.contractorZip ? ' ' + form.contractorZip : ''}`)

  d.sectionTitle('Property Owner')
  d.twoCol('Owner Name', form.ownerName, 'Phone', form.ownerPhone)
  d.row('Email', form.ownerEmail)

  if (form.notes) { d.sectionTitle('Notes'); d.row('Notes', form.notes) }

  d.signatureBlock(
    form.signerName,
    form.signDate,
    'By submitting this application, the applicant certifies that all mechanical work will be performed by or under the supervision of a NC-licensed HVAC/mechanical contractor, and that all work will conform to the 2018 NC Mechanical Code and applicable Durham amendments.'
  )

  d.footer()
  return pdf
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function generatePermitPDF(permitType, form, totalCost) {
  switch (permitType) {
    case 'electrical':  return buildElectricalPDF(form)
    case 'plumbing':    return buildPlumbingPDF(form)
    case 'mechanical':  return buildMechanicalPDF(form)
    default:            return buildBuildingPDF(form, totalCost)
  }
}

export function downloadPermitPDF(permitType, form, totalCost) {
  const pdf = generatePermitPDF(permitType, form, totalCost)
  const address = (form.jobAddress || 'durham-permit').replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 30)
  const filename = `durham-${permitType}-permit-${address}.pdf`
  pdf.save(filename)
  return filename
}
