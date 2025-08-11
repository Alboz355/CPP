export async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

function getOrCreateSalt(): string {
  let salt = localStorage.getItem('pin-salt')
  if (!salt) {
    // 16 bytes random salt, base64
    const random = new Uint8Array(16)
    crypto.getRandomValues(random)
    salt = btoa(String.fromCharCode(...Array.from(random)))
    localStorage.setItem('pin-salt', salt)
  }
  return salt
}

export async function setPin(pin: string): Promise<void> {
  const salt = getOrCreateSalt()
  const hash = await sha256Hex(`${salt}:${pin}`)
  localStorage.setItem('pin-hash', hash)
}

export async function verifyPin(pin: string): Promise<boolean> {
  const salt = localStorage.getItem('pin-salt')
  const storedHash = localStorage.getItem('pin-hash')
  if (!salt || !storedHash) return false
  const hash = await sha256Hex(`${salt}:${pin}`)
  return hash === storedHash
}

export async function changePin(currentPin: string, newPin: string): Promise<boolean> {
  const ok = await verifyPin(currentPin)
  if (!ok) return false
  await setPin(newPin)
  return true
}

export async function resetPin(newPin: string): Promise<void> {
  // Keep the same salt for continuity
  await setPin(newPin)
}
