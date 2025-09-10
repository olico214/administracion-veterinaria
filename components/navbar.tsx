// components/layout.jsx
"use client";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  SearchIcon,
  Logo,
} from "@/components/icons";
// Tu función para cerrar sesión
import { closession } from "@/libs/session/login";

export const Navbar = ({ children }) => {
  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <div className="relative flex flex-col h-screen">
      <header className="w-full">
        <HeroUINavbar maxWidth="xl" position="sticky">
          {/* Contenido Izquierdo (Logo y links principales) */}
          <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
            <NavbarBrand as="li" className="gap-3 max-w-fit">
              <NextLink
                className="flex justify-start items-center gap-1"
                href="/veterinaria"
              >
                <Logo />
                <p className="font-bold text-inherit">Veterinadmin</p>
              </NextLink>
            </NavbarBrand>
            <ul className="hidden lg:flex gap-4 justify-start ml-2">
              {siteConfig.navItems.map((item) => (
                <NavbarItem key={item.href}>
                  <NextLink
                    className={clsx(
                      linkStyles({ color: "foreground" }),
                      "data-[active=true]:text-primary data-[active=true]:font-medium"
                    )}
                    color="foreground"
                    href={item.href}
                  >
                    {item.label}
                  </NextLink>
                </NavbarItem>
              ))}
            </ul>
          </NavbarContent>

          {/* Contenido Derecho (PC) */}
          <NavbarContent
            className="hidden sm:flex basis-1/5 sm:basis-full"
            justify="end"
            gap={2}
          >
            <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
            <NavbarItem>
              <ThemeSwitch />
            </NavbarItem>
            {/* ---- BOTÓN DE CERRAR SESIÓN (ESCRITORIO) ---- */}
            <NavbarItem>
              <Button onPress={closession} color="danger" size="sm" variant="flat">
                Cerrar Sesión
              </Button>
            </NavbarItem>
          </NavbarContent>

          {/* Contenido Derecho (Móvil) */}
          <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
            <ThemeSwitch />
            <NavbarMenuToggle />
          </NavbarContent>

          {/* Menú Desplegable (Móvil) */}
          <NavbarMenu>
            {searchInput}
            <div className="mx-4 mt-2 flex flex-col gap-2">
              {siteConfig.navMenuItems.map((item, index) => (
                <NavbarMenuItem key={`${item}-${index}`}>
                  <Link
                    color={
                      index === 2
                        ? "primary"
                        : index === siteConfig.navMenuItems.length - 1
                          ? "danger"
                          : "foreground"
                    }
                    href={item.href} // Corregido para usar el href del item
                    size="lg"
                  >
                    {item.label}
                  </Link>
                </NavbarMenuItem>
              ))}
              {/* ---- BOTÓN DE CERRAR SESIÓN (MENÚ MÓVIL) ---- */}
              <NavbarMenuItem>
                <Button onPress={closession} color="danger" className="w-full">
                  Cerrar Sesión
                </Button>
              </NavbarMenuItem>
            </div>
          </NavbarMenu>
        </HeroUINavbar>
      </header>

      <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
        {children}
      </main>
    </div>
  );
};