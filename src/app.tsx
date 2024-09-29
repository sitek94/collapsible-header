import {
  AppBar,
  Button,
  ClickAwayListener,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Toolbar,
  Typography,
} from '@material-ui/core'
import {
  Add,
  Edit,
  Delete,
  KeyboardArrowDown,
  KeyboardArrowUp,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@material-ui/icons'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import type React from 'react'

type IconComponent = typeof KeyboardArrowDown

enum IconName {
  Add = 'Add',
  Delete = 'Delete',
  Edit = 'Edit',
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  ArrowUp = 'ArrowUp',
}

const icons: Record<IconName, IconComponent> = {
  Add,
  ArrowDown: KeyboardArrowDown,
  ArrowLeft: KeyboardArrowLeft,
  ArrowRight: KeyboardArrowRight,
  ArrowUp: KeyboardArrowUp,
  Delete,
  Edit,
}

export function App() {
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)

  const toggleHeader = () => setIsHeaderCollapsed(!isHeaderCollapsed)

  return (
    <>
      <Header isCollapsed={isHeaderCollapsed} toggle={toggleHeader}>
        <HeaderSection title="General">
          <HeaderButton iconName={IconName.Add}>Add</HeaderButton>
          <HeaderButton iconName={IconName.Edit}>Edit</HeaderButton>
          <HeaderButton iconName={IconName.Delete}>Remove</HeaderButton>
        </HeaderSection>
        <HeaderSection title="Selecting">
          <HeaderSelect iconName={IconName.Add} title="Add">
            <HeaderSelectOption>Add</HeaderSelectOption>
            <HeaderSelectOption>Add All</HeaderSelectOption>
          </HeaderSelect>
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
        <Toolbar variant={isCollapsed ? 'dense' : 'regular'}>
          <IconButton
            edge="start"
            style={{marginRight: '1rem '}}
            onClick={toggle}
          >
            {isCollapsed ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
          </IconButton>
          <div style={{display: 'flex', gap: '1rem'}}>{children}</div>
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
  const menuListId = useId()
  const {isCollapsed} = useHeaderContext()

  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isCollapsed) {
      setOpen(false)
    }
  }, [isCollapsed])

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
          aria-controls={open ? menuListId : undefined}
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
                dense
                id={menuListId}
                onKeyDown={handleListKeyDown}
                style={{display: 'flex', flexDirection: 'column'}}
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

const HeaderButton = ({
  iconName,
  children,
}: PropsWithChildren & {iconName: IconName}) => {
  const {isCollapsed} = useHeaderContext()

  const Icon = icons[iconName]

  if (isCollapsed) {
    return (
      <MenuItem>
        <ListItemIcon>
          <Icon fontSize="small" />
        </ListItemIcon>
        {children}
      </MenuItem>
    )
  }

  return (
    <IconButton size="small">
      <Icon fontSize="small" />
    </IconButton>
  )
}

const HeaderSelect = ({
  iconName,
  children,
  title,
}: PropsWithChildren & {iconName: IconName; title: string}) => {
  const {isCollapsed} = useHeaderContext()

  const Icon = icons[iconName]

  if (isCollapsed) {
    return (
      <Popover>
        <PopoverButton>
          <ListItemIcon>
            <Icon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={title} />
          <KeyboardArrowRight fontSize="small" />
        </PopoverButton>
        <PopoverPanel placement="right">{children}</PopoverPanel>
      </Popover>
    )
  }

  return (
    <Popover>
      <PopoverIconButton>
        <Icon fontSize="small" />
        <KeyboardArrowDown fontSize="small" />
      </PopoverIconButton>
      <PopoverPanel placement="bottom">{children}</PopoverPanel>
    </Popover>
  )
}

const HeaderSelectOption = ({children}: PropsWithChildren) => {
  return (
    <MenuItem>
      <ListItemText>{children}</ListItemText>
    </MenuItem>
  )
}

const PopoverContext = createContext<
  | {
      isOpen: boolean
      toggle: () => void
      anchorRef: React.MutableRefObject<HTMLButtonElement | null>
      menuListId: string
    }
  | undefined
>(undefined)

const usePopoverContext = () => {
  const context = useContext(PopoverContext)
  if (!context) {
    throw new Error('usePopoverContext must be used within a Popover')
  }
  return context
}

const usePopover = () => {
  const {isOpen, toggle, anchorRef, menuListId} = usePopoverContext()

  const buttonProps = {
    ref: anchorRef,
    'aria-controls': isOpen ? menuListId : undefined,
    'aria-haspopup': 'true' as const,
    onClick: toggle,
  }

  return {isOpen, buttonProps}
}

const Popover = ({children}: PropsWithChildren) => {
  const anchorRef = useRef<HTMLButtonElement>(null)
  const menuListId = useId()
  const [isOpen, setIsOpen] = useState(false)

  const value = {
    isOpen,
    toggle: () => setIsOpen(!isOpen),
    anchorRef,
    menuListId,
  }

  return (
    <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>
  )
}

const PopoverIconButton = ({children}: PropsWithChildren) => {
  const {buttonProps} = usePopover()

  return <IconButton {...buttonProps}>{children}</IconButton>
}

const PopoverButton = ({children}: PropsWithChildren) => {
  const {isOpen, toggle, anchorRef, menuListId} = usePopoverContext()

  return (
    <Button
      ref={anchorRef}
      aria-controls={isOpen ? menuListId : undefined}
      aria-haspopup="true"
      onClick={toggle}
    >
      {children}
    </Button>
  )
}

const PopoverPanel = ({
  placement,
  children,
}: PropsWithChildren & {placement: 'bottom' | 'right'}) => {
  const {isOpen, anchorRef, menuListId} = usePopoverContext()

  return (
    <Popper
      open={isOpen}
      anchorEl={anchorRef.current}
      role={undefined}
      disablePortal
      placement={placement}
    >
      <Paper>
        <ClickAwayListener onClickAway={() => {}}>
          <MenuList
            autoFocusItem={isOpen}
            dense
            id={menuListId}
            onKeyDown={() => {}}
            style={{display: 'flex', flexDirection: 'column'}}
          >
            {children}
          </MenuList>
        </ClickAwayListener>
      </Paper>
    </Popper>
  )
}
