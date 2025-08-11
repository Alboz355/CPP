import QRCode from 'qrcode'

export async function generateQrDataUrl(data: string, size = 300): Promise<string> {
  const options = {
    width: size,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  }
  return QRCode.toDataURL(data, options)
}
