'use client'

export default function LandingBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg,#a8edcf 0%,#78d4f0 35%,#4ab8f5 60%,#6ec6f7 100%)' }}
      />
      <div
        className="blob-animate absolute -top-24 -left-36 w-[600px] h-[600px] rounded-full opacity-45"
        style={{ background: 'radial-gradient(circle,#a0f0d0,#4dd9f5)', filter: 'blur(80px)' }}
      />
      <div
        className="blob-animate absolute -bottom-24 -right-24 w-[500px] h-[500px] rounded-full opacity-45"
        style={{ background: 'radial-gradient(circle,#b8eaff,#72c8f8)', filter: 'blur(80px)', animationDelay: '3s' }}
      />
      <div
        className="blob-animate absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full opacity-45"
        style={{ background: 'radial-gradient(circle,#d0f8e8,#8de8f5)', filter: 'blur(80px)', animationDelay: '1.5s' }}
      />
    </div>
  )
}
