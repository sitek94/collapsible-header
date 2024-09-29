import './app.css'

import {
  createContext,
  PropsWithChildren,
  useContext,
  useId,
  useState,
} from 'react'
import {Popover, PopoverButton, PopoverPanel} from '@headlessui/react'

export function App() {
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)

  const toggleHeader = () => setIsHeaderCollapsed(!isHeaderCollapsed)

  return (
    <>
      <Header isCollapsed={isHeaderCollapsed}>
        <HeaderSection title="General">
          <button>Add</button>
          <button>Edit</button>
          <button>Remove</button>
        </HeaderSection>
      </Header>

      <hr />

      <main>
        <button onClick={toggleHeader}>Toggle Header</button>
      </main>
    </>
  )
}

const HeaderContext = createContext({
  isCollapsed: false,
})

const Header = ({
  children,
  isCollapsed = false,
}: PropsWithChildren & {isCollapsed: boolean}) => {
  return (
    <HeaderContext.Provider value={{isCollapsed}}>
      <header>{children}</header>
    </HeaderContext.Provider>
  )
}

const useHeaderContext = () => {
  return useContext(HeaderContext)
}

const HeaderSection = ({
  title,
  children,
}: PropsWithChildren & {title: string}) => {
  const titleId = useId()
  const {isCollapsed} = useHeaderContext()

  if (isCollapsed) {
    return (
      <Popover>
        <PopoverButton>{title}</PopoverButton>
        <PopoverPanel anchor="bottom" className="header-section-popover-panel">
          {children}
        </PopoverPanel>
      </Popover>
    )
  }

  return (
    <section aria-labelledby={titleId}>
      <h2 id={titleId} className="title">
        {title}
      </h2>
      <div className="items">{children}</div>
    </section>
  )
}
