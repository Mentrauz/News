import Link from "next/link"

export function NavigationMenu() {
  const menuItems = [
    { label: "POLITICS", href: "/politics" },
    { label: "JUSTICE", href: "/justice" },
    { label: "WAR ON GAZA", href: "/war-on-gaza" },
    { label: "TECHNOLOGY", href: "/technology" },
    { label: "IMMIGRATION", href: "/immigration" },
    { label: "CHILLING DISSENT", href: "/chilling-dissent" },
    { label: "ABOUT", href: "/about" },
    { label: "SUPPORT US", href: "/support-us", highlight: true },
  ]

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <ul className="flex items-center">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`block px-6 py-4 text-sm font-bold tracking-wide transition-colors ${
                  item.highlight 
                    ? "bg-blue-600 text-white hover:bg-white hover:text-black mx-2" 
                    : "text-gray-900 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
