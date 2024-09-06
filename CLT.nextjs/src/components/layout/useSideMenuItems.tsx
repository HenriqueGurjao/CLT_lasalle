import { HomeIcon, LineChart, Notebook, Shirt, Trophy, Flag, Users } from "lucide-react"
import { MenuItem } from "./propsSideMenuItems"
import { SoccerBall } from "phosphor-react";

export const useMenuItems = () => {

  const items: MenuItem[] = [
    {
      icon: HomeIcon,
      label: "Inicio",
      link: "/inicio",
      active: true,
    },
    {
      icon: Users,
      label: "Grupos",
      link: "/grupos",
      active: false,
    },
    {
      icon: Shirt,
      label: "Times",
      link: "/times",
      active: false,
    },
    {
      icon: Flag,
      label: "Partidas",
      link: "/partida",
      active: false,
    },
    {
      icon: Trophy,
      label: "Campeonatos",
      link: "/campeonatos",
      active: false,
    },
    {
      icon: LineChart,
      label: "Estatisticas",
      link: "/estatisticas",
      active: false,
    },
  ]

  return items
}