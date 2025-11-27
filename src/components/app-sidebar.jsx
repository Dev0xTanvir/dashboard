"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Mern",
      logo: GalleryVerticalEnd,
      plan: "Pro",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Banner",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Create Banner",
          url: "CreateBanner",
        },
        {
          title: "All Banner",
          url: "#",
        },
      ],
    },
    {
      title: "Category",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Create Category",
          url: "CreateCategory",
        },
        {
          title: "All Category",
          url: "#",
        },
      ],
    },
    {
      title: "Sub Category",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Create subCategory",
          url: "CreateSubCategory",
        },
        {
          title: "All subCategory",
          url: "#",
        },
      ],
    },

    {
      title: "Brand",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Create Brand",
          url: "#",
        },
        {
          title: "All Brand",
          url: "#",
        },
      ],
    },
    {
      title: "Product",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Create Product",
          url: "#",
        },
        {
          title: "All Product",
          url: "#",
        },
      ],
    },
    {
      title: "Variant",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Create Variant",
          url: "#",
        },
        {
          title: "All Variant",
          url: "#",
        },
      ],
    },

    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
