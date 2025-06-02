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
    <nav className="border-t border-gray-200 hidden md:block">
      <div className="max-w-7xl mx-auto">
        <ul className="flex">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`block px-4 py-3 text-sm font-semibold tracking-wide hover:bg-gray-50 transition-colors ${
                  item.highlight ? "bg-indigo-600 text-white hover:bg-indigo-700" : "text-gray-900"
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
