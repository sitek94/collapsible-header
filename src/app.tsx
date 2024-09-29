import './app.css'

import {useState} from 'react'
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/react'

export function App() {
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)

  const toggleHeader = () => setIsHeaderCollapsed(!isHeaderCollapsed)

  return (
    <>
      <Header isCollapsed={isHeaderCollapsed} />

      <hr />

      <main>
        <button onClick={toggleHeader}>Toggle Header</button>
      </main>
    </>
  )
}

function Header({isCollapsed = false}) {
  if (isCollapsed) {
    return (
      <header>
        <Menu as="section">
          <MenuButton>My account</MenuButton>
          <MenuItems anchor="bottom" className="menu-items">
            <MenuItem>
              <a href="/settings">Settings</a>
            </MenuItem>
            <MenuItem>
              <a href="/support">Support</a>
            </MenuItem>
            <MenuItem>
              <a href="/license">License</a>
            </MenuItem>
          </MenuItems>
        </Menu>
      </header>
    )
  }

  return (
    <header>
      <section className="general">
        <h2 className="title">General</h2>

        <div className="buttons">
          <button>Add</button>
          <button>Edit</button>
          <button>Remove</button>
        </div>
      </section>

      <section className="general">
        <h2 className="title">General</h2>

        <div className="buttons">
          <button>Add</button>
          <button>Edit</button>
          <button>Remove</button>
        </div>
      </section>

      <section className="layout">
        <h2 className="title">Search</h2>

        <input type="text" placeholder="Search..." />
      </section>
    </header>
  )
}
