/* Formulario de contacto (Formspree): envío sin recargar y mensaje de confirmación */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-cb');
  if (!form) return;
  const btn = form.querySelector('button[type="submit"]');
  const status = form.querySelector('.form-status');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const label = btn.innerHTML;
    btn.disabled = true; btn.textContent = 'ENVIANDO…'; status.className = 'form-status'; status.textContent = '';
    try {
      const r = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error();
      form.reset();
      status.className = 'form-status is-ok';
      status.textContent = '¡Gracias! Recibimos tu consulta y te respondemos en menos de 24 horas.';
    } catch (_) {
      status.className = 'form-status is-error';
      status.innerHTML = 'No pudimos enviar el mensaje. Escribinos por <a href="https://wa.me/5493525632567" target="_blank" rel="noopener noreferrer">WhatsApp</a>.';
    }
    btn.disabled = false; btn.innerHTML = label;
  });
});

/* Vista previa de trabajos: escala el iframe al ancho de su contenedor */
(function () {
  const ajustar = () => document.querySelectorAll('.work-frame').forEach(box => {
    const f = box.querySelector('iframe');
    if (f && box.clientWidth) f.style.transform = 'scale(' + (box.clientWidth / 1280) + ')';
  });
  window.addEventListener('load', ajustar);
  window.addEventListener('resize', ajustar);
  document.addEventListener('DOMContentLoaded', ajustar);
})();
