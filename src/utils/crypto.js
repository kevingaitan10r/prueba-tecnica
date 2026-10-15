/**
 * Genera un código hash criptográfico SHA-256 para verificar la autenticidad
 * de los certificados expedidos por la plataforma.
 *
 * @param {string} payload - Cadena canónica con los datos del certificado
 * @returns {Promise<string>} Código formateado con prefijo y hash truncado a 16 caracteres hex
 */
export async function generateCertificateHash(payload) {
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);

  if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const fullHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `VX-${fullHex.substring(0, 16).toUpperCase()}`;
  }

  // Fallback con algoritmo FNV-1a si crypto.subtle no está disponible en el entorno
  let hash = 0x811c9dc5;
  for (let i = 0; i < payload.length; i++) {
    hash ^= payload.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  const hex = (hash >>> 0).toString(16).padStart(8, '0').toUpperCase();
  return `VX-${hex}`;
}
