import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-white py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between mb-12">
          <div className="mb-8 lg:mb-0">
            <Link href="/" className="block">
              <div className="text-3xl font-bold tracking-tight">
                <span className="text-black">Daily</span>
                <br />
                <span className="text-black">Pulse</span>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-bold uppercase mb-4 tracking-wide">ABOUT</h3>
              <ul className="space-y-3">
                <li>
                  {/* <Link href="#" className="text-sm text-gray-600 hover:text-black transition-colors">
                    SUPPORT US
                  </Link> */}
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-600 hover:text-black transition-colors">
                    JOIN NEWSLETTER
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-600 hover:text-black transition-colors">
                    JOBS
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase mb-4 tracking-wide">CONTACT US</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-sm text-gray-600 hover:text-black transition-colors">
                    POLICIES
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-600 hover:text-black transition-colors">
                    TERMS OF USE
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-600 hover:text-black transition-colors">
                    PRIVACY
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 pt-8 border-t border-gray-200">
          © Daily Pulse. ALL RIGHTS RESERVED
        </div>
      </div>
    </footer>
  )
}
