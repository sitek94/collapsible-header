import {
  AppBar,
  Button,
  ClickAwayListener,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
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

type DialogProps = {title: string}

export function App() {
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)
  const [dialog, setDialog] = useState<DialogProps | null>(null)

  const toggleHeader = () => setIsHeaderCollapsed(!isHeaderCollapsed)

  const openDialog = (props: DialogProps) => setDialog(props)
  const closeDialog = () => setDialog(null)

  return (
    <>
      <Header isCollapsed={isHeaderCollapsed} toggle={toggleHeader}>
        <HeaderSection title="General">
          <HeaderButton
            iconName={IconName.Add}
            onClick={() => openDialog({title: 'Add'})}
          >
            Add
          </HeaderButton>
          <HeaderButton
            iconName={IconName.Edit}
            onClick={() => openDialog({title: 'Edit'})}
          >
            Edit
          </HeaderButton>
          <HeaderButton
            iconName={IconName.Delete}
            onClick={() => openDialog({title: 'Delete'})}
          >
            Remove
          </HeaderButton>
        </HeaderSection>
        <HeaderSection title="Selecting">
          <HeaderSelect iconName={IconName.Add} title="Add">
            <HeaderSelectOption onClick={() => openDialog({title: 'Add'})}>
              Add
            </HeaderSelectOption>
            <HeaderSelectOption onClick={() => openDialog({title: 'Add All'})}>
              Add All
            </HeaderSelectOption>
          </HeaderSelect>
        </HeaderSection>
      </Header>

      <Dialog open={!!dialog} onClose={closeDialog}>
        <DialogTitle>{dialog?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
            commodi tempore, dolores animi harum dolorem, consequuntur, quis
            dignissimos quas aperiam quibusdam. Voluptatum alias omnis libero.
            Quasi expedita quos nostrum tempore?
          </DialogContentText>
        </DialogContent>
      </Dialog>
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
  children,
  iconName,
  onClick,
}: PropsWithChildren & {iconName: IconName; onClick?: () => void}) => {
  const {isCollapsed} = useHeaderContext()

  const Icon = icons[iconName]

  if (isCollapsed) {
    return (
      <MenuItem onClick={onClick}>
        <ListItemIcon>
          <Icon fontSize="small" />
        </ListItemIcon>
        {children}
      </MenuItem>
    )
  }

  return (
    <IconButton size="small" onClick={onClick}>
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

const HeaderSelectOption = ({
  children,
  onClick,
}: PropsWithChildren & {onClick?: () => void}) => {
  return (
    <MenuItem onClick={onClick}>
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
