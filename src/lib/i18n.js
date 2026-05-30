// src/lib/i18n.js
// Internationalization — English and Spanish
// Toggle stored in localStorage as 'parcoria_lang'
// Usage: import { t, getLang, setLang } from '../lib/i18n'

const LANG_KEY = 'parcoria_lang'

export function getLang() {
  try {
    return localStorage.getItem(LANG_KEY) || 'en'
  } catch {
    return 'en'
  }
}

export function setLang(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang)
    window.dispatchEvent(new Event('parcoria_lang_change'))
  } catch {}
}

export function isSpanish() {
  return getLang() === 'es'
}

// Translation dictionary
// NOTE: This translation should be reviewed by a native Spanish speaker
// before showing to real users. Permit and legal content must be accurate.
export const STRINGS = {

  // Navigation
  nav_home:           { en: 'Home',           es: 'Inicio' },
  nav_wizard:         { en: 'Permit Wizard',  es: 'Asistente de Permisos' },
  nav_learn:          { en: 'Learn',          es: 'Aprender' },
  nav_contractors:    { en: 'Contractors',    es: 'Contratistas' },
  nav_pricing:        { en: 'Pricing',        es: 'Precios' },
  nav_precheck:       { en: 'Plan Pre-Check', es: 'Pre-revisión de Planos' },
  nav_myjobs:         { en: 'My Jobs',        es: 'Mis Trabajos' },
  nav_dashboard:      { en: 'Dashboard',      es: 'Panel' },
  nav_get_started:    { en: 'Get started',    es: 'Comenzar' },

  // Home page
  home_hero_title:    { en: 'Build your home without the permit headache', es: 'Construye tu hogar sin el dolor de cabeza de los permisos' },
  home_hero_sub:      { en: 'Know exactly which permits you need, in the right order, before you spend a dollar on construction. No lawyers, no guesswork, no wasted months.', es: 'Sabe exactamente qué permisos necesitas, en el orden correcto, antes de gastar un dólar en construcción. Sin abogados, sin suposiciones, sin meses perdidos.' },
  home_sample_cta:    { en: 'See a sample roadmap', es: 'Ver un ejemplo de hoja de ruta' },
  home_problem:       { en: 'The problem today', es: 'El problema hoy' },
  home_how_works:     { en: 'How Parcoria works', es: 'Cómo funciona Parcoria' },
  home_four_steps:    { en: 'Four steps from empty lot to permit roadmap', es: 'Cuatro pasos desde el lote vacío hasta la hoja de ruta de permisos' },
  home_every_permit:  { en: 'Every permit, mapped for you', es: 'Todos los permisos, mapeados para ti' },
  home_bottom_cta:    { en: 'Ready to build smarter in the Triangle?', es: '¿Listo para construir mejor en el Triangle?' },
  home_bottom_sub:    { en: 'Permit intelligence for Raleigh, Durham, Chapel Hill, Apex, Holly Springs, Wake Forest, Morrisville, Garner, Fuquay-Varina, and Cary. From empty lot to certificate of occupancy.', es: 'Inteligencia de permisos para Raleigh, Durham, Chapel Hill, Apex, Holly Springs, Wake Forest, Morrisville, Garner, Fuquay-Varina y Cary. Desde el lote vacío hasta el certificado de ocupación.' },

  // Wizard steps
  wiz_step1:          { en: 'Enter your address', es: 'Ingresa tu dirección' },
  wiz_step2:          { en: 'Buildability check', es: 'Verificación de viabilidad' },
  wiz_step3:          { en: 'Project type', es: 'Tipo de proyecto' },
  wiz_step4:          { en: 'Permit roadmap', es: 'Hoja de ruta de permisos' },
  wiz_step5:          { en: 'Professionals & Concierge', es: 'Profesionales y Asistente' },
  wiz_address_ph:     { en: 'Enter your project address...', es: 'Ingresa la dirección de tu proyecto...' },
  wiz_detect:         { en: 'Detect my location', es: 'Detectar mi ubicación' },
  wiz_next:           { en: 'Next', es: 'Siguiente' },
  wiz_back:           { en: 'Back', es: 'Atrás' },
  wiz_permits_req:    { en: 'Permits required', es: 'Permisos requeridos' },
  wiz_est_timeline:   { en: 'Est. timeline', es: 'Plazo estimado' },
  wiz_est_fees:       { en: 'Est. permit fees', es: 'Tarifas de permisos estimadas' },
  wiz_roadmap_ready:  { en: 'Your permit roadmap is ready', es: 'Tu hoja de ruta de permisos está lista' },
  wiz_unlock:         { en: 'Unlock full roadmap', es: 'Desbloquear hoja de ruta completa' },
  wiz_more_permits:   { en: 'more permits', es: 'permisos más' },
  wiz_generate_brief: { en: 'Generate project brief', es: 'Generar resumen del proyecto' },
  wiz_prefill_durham: { en: 'Pre-fill Durham permit application', es: 'Pre-llenar solicitud de permiso de Durham' },
  wiz_share:          { en: 'Share this roadmap with my contractor', es: 'Compartir esta hoja de ruta con mi contratista' },
  wiz_action_plan:    { en: 'Get my action plan', es: 'Obtener mi plan de acción' },

  // Project types
  proj_sfh:           { en: 'New single-family home', es: 'Nueva vivienda unifamiliar' },
  proj_adu:           { en: 'Accessory dwelling unit (ADU)', es: 'Unidad de vivienda accesoria (ADU)' },
  proj_addition:      { en: 'Addition', es: 'Ampliación' },
  proj_deck:          { en: 'Deck or porch', es: 'Terraza o porche' },
  proj_reno:          { en: 'Major renovation', es: 'Renovación mayor' },
  proj_pool:          { en: 'Pool or spa', es: 'Piscina o spa' },
  proj_shed:          { en: 'Shed or detached garage', es: 'Cobertizo o garaje independiente' },
  proj_townhouse:     { en: 'Townhouse / duplex', es: 'Casa adosada / dúplex' },

  // Pricing
  price_homeowner:    { en: 'Homeowner', es: 'Propietario' },
  price_contractor:   { en: 'Contractor', es: 'Contratista' },
  price_developer:    { en: 'Developer', es: 'Desarrollador' },
  price_get_started:  { en: 'Get started', es: 'Comenzar' },
  price_one_time:     { en: 'one-time', es: 'pago único' },
  price_month:        { en: '/month', es: '/mes' },
  price_cancel:       { en: 'Cancel anytime', es: 'Cancela cuando quieras' },

  // Contractor Mode / Jobs
  jobs_title:         { en: 'Jobs', es: 'Trabajos' },
  jobs_active:        { en: 'active jobs', es: 'trabajos activos' },
  jobs_add:           { en: 'Add client job', es: 'Agregar trabajo de cliente' },
  jobs_total:         { en: 'Total jobs', es: 'Total de trabajos' },
  jobs_in_progress:   { en: 'In progress', es: 'En progreso' },
  jobs_inspection:    { en: 'Inspection stage', es: 'Etapa de inspección' },
  jobs_complete:      { en: 'Complete', es: 'Completado' },
  jobs_client_name:   { en: 'Client name', es: 'Nombre del cliente' },
  jobs_address:       { en: 'Property address', es: 'Dirección de la propiedad' },
  jobs_next_action:   { en: 'Next action', es: 'Próxima acción' },
  jobs_notes:         { en: 'Notes', es: 'Notas' },
  jobs_save:          { en: 'Add job', es: 'Agregar trabajo' },
  jobs_save_changes:  { en: 'Save changes', es: 'Guardar cambios' },
  jobs_cancel:        { en: 'Cancel', es: 'Cancelar' },

  // Profile
  profile_title:      { en: 'My Profile', es: 'Mi Perfil' },
  profile_business:   { en: 'Business name', es: 'Nombre del negocio' },
  profile_license:    { en: 'NC License number', es: 'Número de licencia de NC' },
  profile_phone:      { en: 'Phone', es: 'Teléfono' },
  profile_email:      { en: 'Business email', es: 'Correo del negocio' },
  profile_save:       { en: 'Save profile', es: 'Guardar perfil' },
  profile_saved:      { en: 'Profile saved', es: 'Perfil guardado' },

  // Templates
  templates_title:    { en: 'Client Templates', es: 'Plantillas para Clientes' },
  templates_choose:   { en: 'Choose a template', es: 'Elige una plantilla' },
  templates_fill:     { en: 'Fill in the details', es: 'Completa los detalles' },
  templates_copy:     { en: 'Copy message', es: 'Copiar mensaje' },
  templates_copied:   { en: 'Copied to clipboard', es: 'Copiado al portapapeles' },

  // Application pre-fill
  apply_title:        { en: 'Building Permit Application', es: 'Solicitud de Permiso de Construcción' },
  apply_review:       { en: 'Review all fields, then print or save as PDF to submit via Dplans', es: 'Revisa todos los campos, luego imprime o guarda como PDF para enviar por Dplans' },
  apply_print:        { en: 'Print / Save PDF', es: 'Imprimir / Guardar PDF' },
  apply_prefilled:    { en: 'Contractor fields pre-filled from your Parcoria profile. Review and update as needed.', es: 'Los campos del contratista fueron pre-llenados desde tu perfil de Parcoria. Revisa y actualiza según sea necesario.' },
  apply_submit_how:   { en: 'How to submit this application', es: 'Cómo enviar esta solicitud' },

  // Learning center
  learn_title:        { en: 'Learn how permitting works', es: 'Aprende cómo funcionan los permisos' },
  learn_free:         { en: 'Free for everyone - No account required', es: 'Gratis para todos - Sin cuenta requerida' },
  learn_read:         { en: 'Read guide', es: 'Leer guía' },
  learn_back:         { en: 'Back to Learning Center', es: 'Volver al Centro de Aprendizaje' },
  learn_min_read:     { en: 'min read', es: 'min de lectura' },

  // General
  gen_save:           { en: 'Save', es: 'Guardar' },
  gen_cancel:         { en: 'Cancel', es: 'Cancelar' },
  gen_delete:         { en: 'Delete', es: 'Eliminar' },
  gen_edit:           { en: 'Edit', es: 'Editar' },
  gen_back:           { en: 'Back', es: 'Atrás' },
  gen_share:          { en: 'Share link', es: 'Compartir enlace' },
  gen_copied:         { en: 'Copied!', es: '¡Copiado!' },
  gen_loading:        { en: 'Loading...', es: 'Cargando...' },
  gen_error:          { en: 'Something went wrong. Please try again.', es: 'Algo salió mal. Por favor intenta de nuevo.' },
  gen_required:       { en: 'Required', es: 'Requerido' },
  gen_optional:       { en: 'Optional', es: 'Opcional' },
  gen_yes:            { en: 'Yes', es: 'Sí' },
  gen_no:             { en: 'No', es: 'No' },

  // Footer
  footer_tagline:     { en: 'Permit intelligence for the Research Triangle. Know exactly what to build, in the right order, before you spend a dollar on construction.', es: 'Inteligencia de permisos para el Research Triangle. Sabe exactamente qué construir, en el orden correcto, antes de gastar un dólar en construcción.' },
  footer_product:     { en: 'Product', es: 'Producto' },
  footer_learn:       { en: 'Learn', es: 'Aprender' },
  footer_jurs:        { en: 'Jurisdictions', es: 'Jurisdicciones' },
  footer_company:     { en: 'Company', es: 'Empresa' },
  footer_covering:    { en: 'Covering Raleigh - Durham - Chapel Hill - Apex - Holly Springs - Wake Forest - Morrisville - Garner - Fuquay-Varina - Cary', es: 'Cubriendo Raleigh - Durham - Chapel Hill - Apex - Holly Springs - Wake Forest - Morrisville - Garner - Fuquay-Varina - Cary' },

  // Restore / access
  restore_title:      { en: 'Restore your access', es: 'Restaurar tu acceso' },
  restore_sub:        { en: 'Enter the email you used to purchase', es: 'Ingresa el correo que usaste para comprar' },
  restore_btn:        { en: 'Restore access', es: 'Restaurar acceso' },

  // Sample roadmap
  sample_banner:      { en: 'This is a sample roadmap', es: 'Este es un ejemplo de hoja de ruta' },
  sample_banner_sub:  { en: 'This shows exactly what paying customers see. Enter your address to get your specific roadmap.', es: 'Esto muestra exactamente lo que ven los clientes que pagan. Ingresa tu dirección para obtener tu hoja de ruta específica.' },
  sample_get_yours:   { en: 'Get your specific permit roadmap', es: 'Obtén tu hoja de ruta de permisos específica' },

  // Pricing page
  price_already_paid: { en: 'Already paid? Restore access', es: '¿Ya pagaste? Restaurar acceso' },
  price_see_plans:    { en: 'See all plans', es: 'Ver todos los planes' },

  // Learn center
  learn_badge:        { en: 'Free for everyone · No account required', es: 'Gratis para todos · Sin cuenta requerida' },
  learn_heading:      { en: 'Learn how permitting works', es: 'Aprende cómo funcionan los permisos' },
  learn_sub:          { en: 'Plain-English guides to residential construction permitting in the Research Triangle. Written for first-time builders, owner-builders, and anyone who\'s ever been confused by the process.', es: 'Guías en lenguaje sencillo sobre permisos de construcción residencial en el Research Triangle. Escritas para constructores primerizos, propietarios-constructores y cualquiera que haya tenido dudas sobre el proceso.' },
  learn_filter_all:   { en: 'All', es: 'Todos' },
  learn_read_guide:   { en: 'Read guide →', es: 'Leer guía →' },
  learn_read:         { en: 'read', es: 'lectura' },
  learn_cta_title:    { en: 'Ready to see your specific permit roadmap?', es: '¿Listo para ver tu hoja de ruta de permisos específica?' },
  learn_cta_sub:      { en: 'Enter your address and project type. Parcoria maps every permit, in the right order, for your jurisdiction — in under 2 minutes.', es: 'Ingresa tu dirección y tipo de proyecto. Parcoria mapea todos los permisos, en el orden correcto, para tu jurisdicción — en menos de 2 minutos.' },
  learn_cta_btn:      { en: 'Start my permit roadmap →', es: 'Iniciar mi hoja de ruta de permisos →' },

  // Guide page
  guide_not_found:    { en: 'Guide not found', es: 'Guía no encontrada' },
  guide_back:         { en: '← Back to Learning Center', es: '← Volver al Centro de Aprendizaje' },
  guide_breadcrumb:   { en: 'Learning Center', es: 'Centro de Aprendizaje' },
  guide_related:      { en: 'Related guides', es: 'Guías relacionadas' },
  guide_triangle:     { en: 'Research Triangle, NC', es: 'Research Triangle, NC' },
  guide_free:         { en: 'Free guide', es: 'Guía gratuita' },

  // Sample roadmap
  sample_warning:     { en: 'Always verify current requirements directly with your jurisdiction before submitting any permit application.', es: 'Siempre verifica los requisitos actuales directamente con tu jurisdicción antes de enviar cualquier solicitud de permiso.' },
  sample_permit_count:{ en: 'permits required', es: 'permisos requeridos' },
  sample_timeline_lbl:{ en: 'Est. timeline', es: 'Plazo estimado' },
  sample_fees_lbl:    { en: 'Est. permit fees', es: 'Tarifas estimadas' },
  sample_apply_link:  { en: 'Apply at portal →', es: 'Solicitar en portal →' },
  sample_view_full:   { en: 'View full action plan →', es: 'Ver plan de acción completo →' },
  sample_cta_title:   { en: 'This is a sample. Your roadmap will be specific to your address.', es: 'Este es un ejemplo. Tu hoja de ruta será específica para tu dirección.' },
  sample_cta_btn:     { en: 'Run my permit roadmap →', es: 'Obtener mi hoja de ruta de permisos →' },
  sample_phase_lbl:   { en: 'Phase', es: 'Fase' },
  sample_weeks_lbl:   { en: 'wks', es: 'sem.' },

  // Action plan
  action_title:       { en: 'Your Permit Action Plan', es: 'Tu Plan de Acción para Permisos' },
  action_sub:         { en: 'Week-by-week roadmap from empty lot to certificate of occupancy', es: 'Hoja de ruta semana a semana desde el lote vacío hasta el certificado de ocupación' },
  action_print:       { en: 'Print / save as PDF', es: 'Imprimir / guardar como PDF' },
  action_warning_hdr: { en: 'Always verify', es: 'Verifica siempre' },
  action_warning_txt: { en: 'Permit requirements, fees, and timelines change. Verify all details directly with your jurisdiction before submitting anything.', es: 'Los requisitos, tarifas y plazos de permisos cambian. Verifica todos los detalles directamente con tu jurisdicción antes de enviar cualquier solicitud.' },
  action_tip:         { en: 'Tip', es: 'Consejo' },
  action_warning:     { en: 'Warning', es: 'Advertencia' },
  action_tasks:       { en: 'Tasks', es: 'Tareas' },
  action_start_over:  { en: '← Run a new roadmap', es: '← Ejecutar una nueva hoja de ruta' },
  action_get_full:    { en: 'Get full permit roadmap →', es: 'Obtener hoja de ruta completa →' },

  // ApplicationPrefill
  apply_title:        { en: 'Permit Application Pre-fill', es: 'Pre-llenado de Solicitud de Permiso' },
  apply_sub:          { en: 'We pre-fill your permit application from your Parcoria wizard answers. Download, review, and submit to your jurisdiction.', es: 'Pre-llenamos tu solicitud de permiso con las respuestas del asistente de Parcoria. Descarga, revisa y envía a tu jurisdicción.' },
  apply_permit_type:  { en: 'Permit type', es: 'Tipo de permiso' },
  apply_job_info:     { en: 'Job information', es: 'Información del trabajo' },
  apply_job_address:  { en: 'Job address', es: 'Dirección del trabajo' },
  apply_lot_unit:     { en: 'Lot / Unit', es: 'Lote / Unidad' },
  apply_subdivision:  { en: 'Subdivision', es: 'Subdivisión' },
  apply_description:  { en: 'Job description', es: 'Descripción del trabajo' },
  apply_contractor:   { en: 'Contractor information', es: 'Información del contratista' },
  apply_contractor_nm:{ en: 'Contractor name', es: 'Nombre del contratista' },
  apply_license:      { en: 'NC License #', es: 'Licencia NC #' },
  apply_cid:          { en: 'Durham CID', es: 'CID de Durham' },
  apply_address:      { en: 'Address', es: 'Dirección' },
  apply_city:         { en: 'City', es: 'Ciudad' },
  apply_state:        { en: 'State', es: 'Estado' },
  apply_zip:          { en: 'ZIP', es: 'Código postal' },
  apply_owner:        { en: 'Property owner information', es: 'Información del propietario' },
  apply_owner_name:   { en: 'Owner name', es: 'Nombre del propietario' },
  apply_costs:        { en: 'Construction costs', es: 'Costos de construcción' },
  apply_quick_fill:   { en: 'Quick-fill from saved profile', es: 'Llenado rápido desde perfil guardado' },
  apply_download:     { en: 'Download pre-filled PDF', es: 'Descargar PDF pre-llenado' },
  apply_submit_me:    { en: 'Submit for me', es: 'Enviar por mí' },
  apply_review_note:  { en: 'Review all fields before submitting. You are responsible for accuracy.', es: 'Revisa todos los campos antes de enviar. Eres responsable de la exactitud.' },
  apply_scope_work:   { en: 'Scope of work', es: 'Alcance del trabajo' },
  apply_est_cost:     { en: 'Estimated cost ($)', es: 'Costo estimado ($)' },
  apply_raleigh_note: { en: 'Raleigh uses an online portal for most permit types. Download the pre-filled form and submit via email to downtownds@raleighnc.gov or through the Permit and Development Portal.', es: 'Raleigh usa un portal en línea para la mayoría de los tipos de permisos. Descarga el formulario pre-llenado y envíalo por correo a downtownds@raleighnc.gov o a través del Portal de Permisos y Desarrollo.' },
}

// Main translation function
export function t(key) {
  const lang = getLang()
  const entry = STRINGS[key]
  if (!entry) {
    console.warn(`[i18n] Missing translation key: ${key}`)
    return key
  }
  return entry[lang] || entry.en
}

// React hook for language-reactive components
import { useState, useEffect } from 'react'

export function useLang() {
  const [lang, setLangState] = useState(getLang())
  useEffect(() => {
    const handler = () => setLangState(getLang())
    window.addEventListener('parcoria_lang_change', handler)
    return () => window.removeEventListener('parcoria_lang_change', handler)
  }, [])
  return lang
}
