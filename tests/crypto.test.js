import { describe, it, expect } from 'vitest';
import { generateCertificateHash } from '../src/utils/crypto.js';

describe('Utilidad Criptográfica de Certificados', () => {
  it('genera un hash consistente para el mismo payload', async () => {
    const payload = 'Kevin Felipe|2026-10-15|600|Maestro';
    const hash1 = await generateCertificateHash(payload);
    const hash2 = await generateCertificateHash(payload);

    expect(hash1).toBe(hash2);
    expect(hash1.startsWith('VX-')).toBe(true);
  });

  it('produce hashes distintos si cambian los datos del estudiante o puntaje', async () => {
    const hashA = await generateCertificateHash('Estudiante A|2026-10-15|300|Navegante II');
    const hashB = await generateCertificateHash('Estudiante B|2026-10-15|300|Navegante II');

    expect(hashA).not.toBe(hashB);
  });
});
