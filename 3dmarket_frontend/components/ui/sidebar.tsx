"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { PanelLeft, X } from "lucide-react"

import { cn } from "@/lib/utilis"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_COLLAPSED = "4.5rem"
const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, children, className, style, ...props }, ref) => {
  const [isMobile, setIsMobile] = React.useState(false)
  const [openMobile, setOpenMobile] = React.useState(false)
  const [_open, _setOpen] = React.useState(defaultOpen)

  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [open, setOpenProp],
  )

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen])

  React.useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768)
    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  React.useEffect(() => {
    // Try to get sidebar state from cookie on mount
    const cookies = document.cookie.split(";").reduce(
      (acc, cookie) => {
        const [key, value] = cookie.trim().split("=")
        acc[key] = value
        return acc
      },
      {} as Record<string, string>,
    )

    if (cookies[SIDEBAR_COOKIE_NAME] !== undefined) {
      _setOpen(cookies[SIDEBAR_COOKIE_NAME] === "true")
    }
  }, [])

  const state = open ? "expanded" : "collapsed"

  const contextValue = React.useMemo<SidebarContext>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          style={
            {
              ...style,
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-collapsed": SIDEBAR_WIDTH_COLLAPSED,
            } as React.CSSProperties
          }
          className={cn("relative flex min-h-svh", className)}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
})

SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, children, ...props }, ref) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent
            side="left"
            className="w-[260px] sm:w-[300px] p-0 bg-gradient-to-br from-amber-50 to-amber-100 border-r border-amber-200"
          >
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        data-state={state}
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 transition-all duration-300 ease-in-out",
          state === "expanded" ? "w-[var(--sidebar-width)]" : "w-[var(--sidebar-width-collapsed)]",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)

Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<React.ElementRef<typeof Button>, React.ComponentProps<typeof Button>>(
  ({ className, onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebar()

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("h-9 w-9 text-amber-700 hover:bg-amber-200 hover:text-amber-900", className)}
        onClick={(event) => {
          onClick?.(event)
          toggleSidebar()
        }}
        {...props}
      >
        <PanelLeft className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    )
  },
)

SidebarTrigger.displayName = "SidebarTrigger"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("flex flex-col gap-2 p-4", className)} {...props} />
})

SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("flex-1 overflow-auto p-4", className)} {...props} />
})

SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("p-4 mt-auto", className)} {...props} />
})

SidebarFooter.displayName = "SidebarFooter"

const sidebarMenuButtonVariants = cva(
  "flex w-full items-center gap-2 rounded-md p-2 text-sm transition-all hover:bg-amber-200/70 active:bg-amber-300 disabled:pointer-events-none disabled:opacity-50 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "text-amber-800",
        active: "bg-amber-300 text-amber-900 font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

const SidebarMenuItem = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    icon?: React.ReactNode
    isActive?: boolean
    asChild?: boolean
    tooltip?: string
    variant?: "default" | "active"
  }
>(({ className, icon, children, isActive, asChild = false, tooltip, variant, ...props }, ref) => {
  const { state } = useSidebar()
  const Comp = asChild ? Slot : "button"

  const isCollapsed = state === "collapsed"
  const variantToUse = isActive ? "active" : variant

  const itemContent = (
    <Comp ref={ref} className={cn(sidebarMenuButtonVariants({ variant: variantToUse }), className)} {...props}>
      {icon}
      <span className={cn("truncate transition-opacity", isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100")}>
        {children}
      </span>
    </Comp>
  )

  if (tooltip && isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{itemContent}</TooltipTrigger>
        <TooltipContent side="right">{tooltip}</TooltipContent>
      </Tooltip>
    )
  }

  return itemContent
})

SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarClose = React.forwardRef<React.ElementRef<typeof Button>, React.ComponentProps<typeof Button>>(
  ({ className, onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebar()

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("ml-auto h-8 w-8 text-amber-700 hover:bg-amber-200 hover:text-amber-900", className)}
        onClick={(event) => {
          onClick?.(event)
          toggleSidebar()
        }}
        {...props}
      >
        <X className="h-5 w-5" />
        <span className="sr-only">Close Sidebar</span>
      </Button>
    )
  },
)

SidebarClose.displayName = "SidebarClose"

export {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenuItem,
  SidebarClose,
  useSidebar,
}

