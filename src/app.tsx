import {
  AppBar,
  Button,
  ClickAwayListener,
  IconButton,
  MenuList,
  Paper,
  Popper,
  Toolbar,
  Typography,
} from '@material-ui/core'
import {KeyboardArrowDown, KeyboardArrowUp} from '@material-ui/icons'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useId,
  useRef,
  useState,
} from 'react'
import type React from 'react'

export function App() {
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)

  const toggleHeader = () => setIsHeaderCollapsed(!isHeaderCollapsed)

  return (
    <>
      <Header isCollapsed={isHeaderCollapsed} toggle={toggleHeader}>
        <HeaderSection title="General">
          <button>Add</button>
          <button>Edit</button>
          <button>Remove</button>
        </HeaderSection>
      </Header>
    </>
  )
}

const HeaderContext = createContext({
  isCollapsed: false,
})

const Header = ({
  children,
  isCollapsed = false,
  toggle,
}: PropsWithChildren & {isCollapsed: boolean; toggle: () => void}) => {
  return (
    <HeaderContext.Provider value={{isCollapsed}}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <IconButton
            edge="start"
            style={{marginRight: '1rem '}}
            onClick={toggle}
          >
            {isCollapsed ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
          </IconButton>
          {children}
        </Toolbar>
      </AppBar>
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
  const panelId = useId()
  const {isCollapsed} = useHeaderContext()

  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }

    setOpen(false)
  }

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    }
  }

  if (isCollapsed) {
    return (
      <div>
        <Button
          ref={anchorRef}
          aria-controls={open ? panelId : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          {title}
        </Button>

        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          disablePortal
        >
          <Paper>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList
                autoFocusItem={open}
                id="menu-list-grow"
                onKeyDown={handleListKeyDown}
              >
                {children}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popper>
      </div>
    )
  }

  return (
    <section aria-labelledby={titleId}>
      <Typography component="h2" variant="subtitle2" id={titleId} gutterBottom>
        {title}
      </Typography>
      <div className="items">{children}</div>
    </section>
  )
}
