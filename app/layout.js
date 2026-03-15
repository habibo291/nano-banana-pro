export const metadata = {
  title: 'Nano Banana Pro - AI 画图',
  description: '使用 Nano Banana Pro API 生成 AI 图像',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
